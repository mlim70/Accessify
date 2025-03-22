import config from '../config.js';

// Add authentication check function
async function checkAuthentication() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['userEmail'], function(result) {
            resolve(!!result.userEmail);
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "readText",
    title: "Read",
    contexts: ["selection"]
  });
  console.log("Context menu item 'Read' created");
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "readText") {
    // Check authentication before proceeding
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      console.log("User not authenticated");
      return;
    }

    console.log("Read context menu item clicked");
    console.log("Selected text:", info.selectionText);
    console.log("Tab ID:", tab.id);
    if (chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: readSelectedText,
        args: [info.selectionText]
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log("Script executed successfully");
        }
      });
    } else {
      console.error("chrome.scripting is not available");
    }
  }
});

async function readSelectedText(text) {
  console.log("Reading text:", text);
  
  const apiKey = config.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/audio/speech'; // Correct endpoint for TTS
  
  const requestBody = {
    model: "gpt-4o-mini-tts", // Replace with the correct model name
    input: text,
    voice: "alloy"
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error with OpenAI Text-to-Speech API:', error);
  }
}