require("dotenv").config();

const Anthropic = require("@anthropic-ai/sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: '*',  // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
const express = require("express");
const fs = require("fs");
const { generateAccessibilityPrompt } = require("./services/claude-prompt");
const { GoogleGenerativeAI } = require("@google/generative-ai");
var https = require('https');
const UserInputService = require("./models/UserInput");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const credentialsPath = path.join(__dirname, "config", "service-account-key.json");
  const credentialsJson = Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    "base64"
  ).toString();
  fs.writeFileSync(credentialsPath, credentialsJson);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
}

var privateKey = fs.readFileSync(path.join(__dirname, 'config', 'privkey.pem'));
var certificate = fs.readFileSync(path.join(__dirname, 'config', 'fullchain.pem'));
var credentials = {key: privateKey, cert: certificate};

const app = express();
const PORT = process.env.PORT || 443;
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
//anthropic Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

//google cloud translation
const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

//google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//routes
app.post("/api/input", async (req, res) => {
  try {
    const { userEmail, preferences } = req.body; //email preferences
    if (!userEmail || !preferences) {
      return res
        .status(400)
        .json({ message: "Both userEmail and preferences are required" });
    }

    const newUserPreference = await UserInputService.create(
      preferences,
      userEmail
    );
    res
      .status(201)
      .json({
        message: "Preferences saved successfully",
        data: newUserPreference,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving preferences", error: error.message });
  }
});

app.post("/api/enhance-accessibility", async (req, res) => {
  try {
    const { html, preferences, url, title, forceRegenerate = false } = req.body;

    let enhancedHTML;
    let isFromCache = false;

    if (!forceRegenerate) {
      const existingEnhancement = await UserInputService.findOne({
        "input.url": url,
        "input.preferences.colorBlindness": preferences.colorBlindness,
        "input.preferences.dyslexia": preferences.dyslexia,
      });

      if (existingEnhancement) {
        console.log("Using cached enhancement for URL:", url);
        enhancedHTML = existingEnhancement.input.enhanced;
        isFromCache = true;
      }
    }

    if (!enhancedHTML || forceRegenerate) {
      console.log(
        forceRegenerate
          ? "Regenerating enhancement..."
          : "Generating new enhancement..."
      );

      const prompt = await generateAccessibilityPrompt(preferences, html); //get prompt claude-prompt.js
      const message = await anthropic.messages.create({
        //send prompt to claude
        model: "claude-3-7-sonnet-latest",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      enhancedHTML = message.content[0].text;
    }

    res.status(200).json({
      html: enhancedHTML,
      cached: isFromCache,
      message: forceRegenerate
        ? "Enhancement regenerated successfully"
        : isFromCache
        ? "Using cached enhancement"
        : "New enhancement generated",
    });
  } catch (error) {
    console.error("Error processing with Claude:", error);
    res.status(500).json({
      message: "Error enhancing accessibility",
      error: error.message,
      details: "Failed to enhance HTML with Claude",
    });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    console.log(`Received translation request: "${text}" to ${targetLanguage}`);

    const [translation] = await translate.translate(text, targetLanguage);
    console.log(`Translation result: "${translation}"`);

    res.status(200).json({ translatedText: translation });
  } catch (error) {
    console.error("Translation error:", error);
    res
      .status(500)
      .json({ error: "Translation failed", details: error.message });
  }
});

app.post("/api/pronunciation", async (req, res) => {
  try {
    let { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Set timeout for operations
    const timeout = 30000; // 30 seconds

    // Helper function to handle timeouts
    const withTimeout = async (operation) => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeout);
      });
      return await Promise.race([operation(), timeoutPromise]);
    };

    // Simplified prompt for word identification
    const wordIdentificationPrompt = `List complex words (6+ letters or containing 'ough', 'tion', 'sion', 'ph', 'th', 'ch', 'sh', 'wh', 'gh', 'qu') from: "${text}". Output as comma-separated list or "None".`;
    
    // Get complex words
    const wordResult = await withTimeout(() => model.generateContent(wordIdentificationPrompt));
    const response = wordResult.response.text();

    if (response.includes("None")) {
      return res.status(200).json({ revisedText: text });
    }

    const wordsToProcess = response.split(",").map(word => word.trim());
    const processedWords = new Set();
    
    // Process words sequentially with increased rate limiting
    for (const word of wordsToProcess) {
      if (!word || processedWords.has(word)) continue;
      processedWords.add(word);
      
      try {
        // Simplified pronunciation prompt
        const pronunciationPrompt = `Pronounce "${word}" with hyphens between syllables. Example: "pronunciation" -> "pro-nun-see-ay-shun". Output only the pronunciation.`;
        
        // Increased rate limiting delay to 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const pronunciationResult = await withTimeout(() => 
          model.generateContent(pronunciationPrompt)
        );
        
        const pronunciation = pronunciationResult.response.text().replace("\n", "").trim();
        
        if (pronunciation.toLowerCase() !== word.toLowerCase()) {
          // Use a more precise regex for word replacement
          const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
          text = text.replace(wordRegex, `${word} (${pronunciation})`);
        }
      } catch (error) {
        console.error(`Error processing word "${word}":`, error);
        // Log the error but continue processing
        continue;
      }
    }
    
    return res.status(200).json({ revisedText: text });
  } catch (error) {
    console.error("Error in pronunciation endpoint:", error);
    // Return original text with error message
    return res.status(200).json({ 
      revisedText: text,
      error: "Some words could not be processed, but the text is still readable"
    });
  }
});

app.post("/api/tts", async (req, res) => {
  const apiKey = process.env.OPENAI_API;
  const url = "https://api.openai.com/v1/audio/speech";

  try {
    const { text } = req.body;
    const requestBody = {
      model: "gpt-4o-mini-tts",
      input: text,
      voice: "alloy",
      response_format: "mp3",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.set({
      "Content-Type": "audio/mp3",
      "Content-Length": buffer.length,
    });
    res.send(buffer);
  } catch (error) {
    console.error("Error generating speech:", error);
    res
      .status(500)
      .json({ error: "Error generating speech:", details: error.message });
  }
});

app.post("/api/create-user", async (req, res) => {
  const { emailAddress } = req.body;
  console.log(`Backend received email addr: ${emailAddress}`);
  const item = await UserInputService.queryByEmail(emailAddress);
  if (item.length !== 0) {
    console.log("User already exists.");
    return res.status(200).json({ message: "User already exists." });
  }
  UserInputService.create({}, emailAddress);
  return res
    .status(200)
    .json({ message: `Initialized new default user for ${emailAddress}` });
});

app.post("/api/check-email", async (req, res) => {
  try {
    const { emailAddress } = req.body;
    console.log(`Received email: ${emailAddress}`);
    const item = await UserInputService.queryByEmail(emailAddress);
    if (item.length) {
      // item exists
      return res.status(200).json({ preferences: item[0] });
    } else {
      return res
        .status(404)
        .json({
          error: `Record with email address ${emailAddress} does not exist`,
        });
    }
  } catch (error) {
    console.error("Error confirming email address: ", error);
    res
      .status(500)
      .json({
        error: "Error checking email address: ",
        details: error.message,
      });
  }
});

app.post("/api/save-preferences", async (req, res) => {
  try {
    const preferences = {
      colorBlindFilter: req.body.userPreferences["colorfilter-options"],
      dyslexia: req.body.userPreferences["dyslexia-options"],
      language: req.body.userPreferences["language-options"],
      screenReader: req.body.userPreferences["screen-reader-toggle"],
      imageCaption: req.body.userPreferences["image-caption-toggle"],
      additionalInfo: req.body.userPreferences["conditions-textarea"],
    };
    UserInputService.create(preferences, req.body.userPreferences.emailAddress);
    res.status(200);
  } catch (error) {
    console.error("Error confirming email address: ", error);
    res
      .status(500)
      .json({
        error: "Error checking email address: ",
        details: error.message,
      });
  }
});

const httpsServer = https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} and listening on all interfaces`);
});
