require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate').v2;
const UserInputService = require('./UserInput');
const Anthropic = require('@anthropic-ai/sdk');
const { generateAccessibilityPrompt } = require('./services/claude-prompt');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic Claude
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Google Cloud Translation
const translate = new Translate({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// CORS and body parser middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Routes
app.post('/api/input', async (req, res) => {
    try {
        const { userEmail, preferences } = req.body; // Email & Preferences
        if (!userEmail || !preferences) {
            return res.status(400).json({ message: 'Both userEmail and preferences are required' });
        }

        const newUserPreference = await UserInputService.create(preferences, userEmail);
        res.status(201).json({ message: 'Preferences saved successfully', data: newUserPreference });
    } catch (error) {
        res.status(500).json({ message: 'Error saving preferences', error: error.message });
    }
});


app.post('/api/enhance-accessibility', async (req, res) => {
    try {
        const { html, preferences, url, title, forceRegenerate = false } = req.body;

        let enhancedHTML;
        let isFromCache = false;

        if (!forceRegenerate) {
            const existingEnhancement = await UserInputService.findOne({
                'input.url': url,
                'input.preferences.colorBlindness': preferences.colorBlindness,
                'input.preferences.dyslexia': preferences.dyslexia
            });

            if (existingEnhancement) {
                console.log('Using cached enhancement for URL:', url);
                enhancedHTML = existingEnhancement.input.enhanced;
                isFromCache = true;
            }
        }

        if (!enhancedHTML || forceRegenerate) {
            console.log(forceRegenerate ? 'Regenerating enhancement...' : 'Generating new enhancement...');
            
            const prompt = await generateAccessibilityPrompt(preferences, html); //Get prompt using claude-prompt.js
            const message = await anthropic.messages.create({ //Send prompt to claude
                model: "claude-3-7-sonnet-latest",
                max_tokens: 4096,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });

            enhancedHTML = message.content[0].text; //HTML enhanced w/ accessibility
        }

        res.status(200).json({ 
            html: enhancedHTML,
            cached: isFromCache,
            message: forceRegenerate ? 'Enhancement regenerated successfully' : 
                    isFromCache ? 'Using cached enhancement' : 'New enhancement generated'
        });
    } catch (error) {
        console.error('Error processing with Claude:', error);
        res.status(500).json({ 
            message: 'Error enhancing accessibility', 
            error: error.message,
            details: 'Failed to enhance HTML with Claude'
        });
    }
});

app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        console.log(`Received translation request: "${text}" to ${targetLanguage}`);
        
        // Translate the text
        const [translation] = await translate.translate(text, targetLanguage);
        console.log(`Translation result: "${translation}"`);
        
        res.status(200).json({ translatedText: translation });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', details: error.message });
    }
});

app.post('/api/pronunciation', async (req, res) => {
    try {
        let { text } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        let prompt = `Which of the following words would someone with surface dyslexia struggle with pronouncing? (Only list the words separated by commas. If there are none, output "None". "${text}"`;
        let result = await model.generateContent(prompt);
        const response = result.response.text();
    
        if (response.includes('None')) {
            console.log("No revisions made");
            return res.status(200).json({ revisedText: text });
        }
    
        const challengingWords = response.split(',');
        for (const word of challengingWords) {
            prompt = `Generate a pronunciation guide using only the English alphabet on how to pronounce "${word}". Only provide the pronunciation guide.`;
            let result = await model.generateContent(prompt);
            const pronunciation = result.response.text().replace('\n', '');
            text = text.replace(word, `${word} (${pronunciation})`)
        }
        console.log(`Made ${challengingWords.length} revisions`)
        return res.status(200).json({ revisedText: text });
    } catch (error) {
        console.error('Error generating pronunciation guide:', error);
        res.status(500).json({ error: 'Error generating pronunciation guide:', details: error.message });
    }
});

app.post('/api/tts', async (req, res) => {
    const apiKey = process.env.OPENAI_API;
    const url = 'https://api.openai.com/v1/audio/speech';

    try {
        const { text } = req.body;
        const requestBody = {
            model: "gpt-4o-mini-tts",
            input: text,
            voice: "alloy",
            response_format: "mp3"
        };
      
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        res.set({
            'Content-Type': 'audio/mp3',
            'Content-Length': buffer.length
        });
        res.send(buffer);
    } catch (error) {
        console.error('Error generating speech:', error);
        res.status(500).json({ error: 'Error generating speech:', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
