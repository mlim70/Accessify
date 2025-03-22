require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;
const UserInputService = require('./UserInput');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
            
            const prompt = await generatePrompt(preferences, html);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            enhancedHTML = result.response.text();
        }

        res.status(200).json({ 
            html: enhancedHTML,
            cached: isFromCache,
            message: forceRegenerate ? 'Enhancement regenerated successfully' : 
                    isFromCache ? 'Using cached enhancement' : 'New enhancement generated'
        });
    } catch (error) {
        console.error('Error processing with Gemini AI:', error);
        res.status(500).json({ 
            message: 'Error enhancing accessibility', 
            error: error.message,
            details: 'Failed to process HTML with Gemini AI or database operation'
        });
    }
});

app.get('/api/inputs', async (req, res) => {
    try {
        const inputs = await UserInputService.find();
        res.status(200).json(inputs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inputs', error: error.message });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});