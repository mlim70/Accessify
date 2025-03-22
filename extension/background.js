importScripts('loadEnv.js');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "readText",
    title: "Read",
    contexts: ["selection"]
  });
  console.log("Context menu item 'Read' created");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readText") {
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
    console.log("asdf")
    loadEnv().then(env => console.log('Test loadEnv call:', env)).catch(error => console.error('Test loadEnv error:', error));
  const env = await loadEnv();
  console.log("Environment variables loaded:", env);
  const apiKey = env.OPENAI_API; // Load API key from .env file
console.log("API key:", apiKey);
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