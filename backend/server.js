const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const UserInput = require('./UserInput');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CORS
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Initialize MongoDB
mongoose.connect('mongodb+srv://kmmatthew8:<db_password>@emoryhax.yewqq.mongodb.net/?retryWrites=true&w=majority&appName=EmoryHax', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Helper function to generate Gemini AI PROMPT!!!
async function generatePrompt(preferences, html) {
    let prompt = `You are an accessibility expert. Your task is to enhance the 
    provided HTML to make it more accessible for users with specific disabilities.

    TARGET DISABILITIES:`;
    // Color blindness specifications
    if (preferences.colorBlindness !== 'none') {
        prompt += `\n1. Color Blindness Type: ${preferences.colorBlindness}
        - For Red-Green (Deuteranopia/Protanopia): Avoid red/green contrasts, use blues and yellows
        - For Blue-Yellow (Tritanopia): Avoid blue/yellow contrasts, use reds and greens
        - For Complete (Monochromacy): Use high contrast patterns and shapes instead of color distinctions`;
    }
    // Dyslexia specifications
    if (preferences.dyslexia !== 'none') {
        prompt += `\n2. Dyslexia Type: ${preferences.dyslexia}
        - For Phonological: Ensure clear font choices (OpenDyslexic or similar)
        - For Surface Dyslexia: Increase letter and line spacing
        - General: Use left-aligned text, avoid justified text`;
    }

    prompt += `\n\nREQUIRED MODIFICATIONS:
    1. Color and Contrast:
    - Ensure WCAG 2.1 AA standard contrast ratios (minimum 4.5:1 for normal text)
    - Add visual indicators beyond color for important elements
    - Use patterns or borders to distinguish elements when needed

    2. Typography and Readability:
    - Set line height to at least 1.5
    - Maintain consistent paragraph width (50-75 characters)
    - Use sans-serif fonts (Arial, Verdana, or OpenDyslexic)
    - Ensure minimum font size of 16px
    - Add appropriate letter-spacing (0.12em) and word-spacing (0.16em)

    3. Structure and Navigation:
    - Implement proper heading hierarchy (h1 through h6)
    - Add ARIA labels to all interactive elements
    - Ensure all images have descriptive alt text
    - Add skip navigation links if needed
    - Ensure keyboard navigation works properly

    4. Layout and Spacing:
    - Add sufficient white space between elements
    - Create clear visual hierarchies
    - Ensure consistent alignment
    - Add visible focus indicators

    5. Technical Requirements:
    - Preserve all existing JavaScript functionality and event listeners
    - Maintain original semantic structure
    - Keep all form functionality intact
    - Preserve existing CSS classes and IDs
    - Add comments explaining accessibility changes

    OUTPUT FORMAT:
    Return ONLY the modified HTML with no additional text or explanations.
    Ensure the HTML is complete and valid, including:
    - All required meta tags
    - Original DOCTYPE declaration
    - Preserved script tags
    - All necessary CSS modifications inline or in style tags

    CONSTRAINTS:
    - Do not remove any existing functionality
    - Do not change form submissions or button actions
    - Preserve all data attributes
    - Keep original content intact while enhancing accessibility

    The HTML to modify follows below:
    ${html}`;

    return prompt;
}

// Routes
app.post('/api/input', async (req, res) => {
    try {
        const { input } = req.body;
        const newUserInput = new UserInput({
            input: input,
            timestamp: new Date()
        });
        
        await newUserInput.save();
        res.status(201).json({ message: 'Input saved successfully', data: newUserInput });
    } catch (error) {
        res.status(500).json({ message: 'Error saving input', error: error.message });
    }
});

app.post('/api/enhance-accessibility', async (req, res) => {
    try {
        const { html, preferences, url, title, forceRegenerate = false } = req.body;

        // Check for cached version only if not forcing regeneration
        let enhancedHTML;
        let isFromCache = false;

        if (!forceRegenerate) {
            const existingEnhancement = await UserInput.findOne({
                'input.url': url,
                'input.preferences.colorBlindness': preferences.colorBlindness,
                'input.preferences.dyslexia': preferences.dyslexia
            }).sort({ timestamp: -1 });

            if (existingEnhancement) {
                console.log('Using cached enhancement for URL:', url);
                enhancedHTML = existingEnhancement.input.enhanced;
                isFromCache = true;
            }
        }

        // Generate new enhancement if no cache or regeneration requested
        if (!enhancedHTML || forceRegenerate) {
            console.log(forceRegenerate ? 'Regenerating enhancement...' : 'Generating new enhancement...');
            
            const prompt = await generatePrompt(preferences, html);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            enhancedHTML = result.response.text();

            // Store the new enhancement in MongoDB
            const newUserInput = new UserInput({
                input: {
                    original: html,
                    enhanced: enhancedHTML,
                    url: url,
                    title: title,
                    preferences: preferences,
                    lastUpdated: new Date(),
                    isRegenerated: forceRegenerate
                },
                timestamp: new Date()
            });
            await newUserInput.save();
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
        // GET QUERY RESULT
        const inputs = await UserInput.find().sort({ timestamp: -1 });
        res.status(200).json(inputs);
    // ERROR
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inputs', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});