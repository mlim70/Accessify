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
  
  const apiKey = 'AIzaSyAfqgTUcYd1iHQ83YuPGebXnxJZz1DizGc'; // Replace with your Google Cloud API key
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  
  const requestBody = {
    input: { text: text },
    voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
    audioConfig: { audioEncoding: 'MP3' }
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    const audioContent = data.audioContent;
    
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    audio.play();
  } catch (error) {
    console.error('Error with Google Cloud Text-to-Speech API:', error);
  }
}