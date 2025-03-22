
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

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'captureScreenshot') {
//       chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
//         sendResponse({ screenshotUrl: dataUrl });
//       });
//       return true; // Keep the message channel open for sendResponse
//     } else if (request.action === 'toggleZoom') {
//       chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
//         // chrome.tabs.create({ url: dataUrl });
//         sendResponse({ success: true });
//       });
//       return true; // Keep the message channel open for sendResponse
//     }
//   });
  
//   chrome.tabs.onActivated.addListener((activeInfo) => {
//     chrome.tabs.get(activeInfo.tabId, (tab) => {
//       if (!tab.active) {
//         chrome.storage.sync.set({ enableZoom: false }, () => {
//           chrome.tabs.sendMessage(tab.id, { action: 'toggleZoom', enabled: false });
//         });
//       }
//     });
//   });
  
//   chrome.windows.onFocusChanged.addListener((windowId) => {
//     if (windowId === chrome.windows.WINDOW_ID_NONE) {
//       chrome.storage.sync.set({ enableZoom: false }, () => {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           if (tabs[0]) {
//             chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleZoom', enabled: false });
//           }
//         });
//       });
//     }
//   });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleZoom') {
      if (request.enabled) {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
          chrome.storage.local.set({ screenshotUrl: dataUrl }, () => {
            chrome.tabs.create({ url: dataUrl });
            sendResponse({ success: true });
          });
        });
      } else {
        chrome.storage.local.remove('screenshotUrl', () => {
          sendResponse({ success: true });
        });
      }
      return true; // Keep the message channel open for sendResponse
    }
  });
  
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (!tab.active) {
        chrome.storage.sync.set({ enableZoom: false }, () => {
          chrome.tabs.sendMessage(tab.id, { action: 'toggleZoom', enabled: false });
        });
      }
    });
  });
  
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      chrome.storage.sync.set({ enableZoom: false }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleZoom', enabled: false });
          }
        });
      });
    }
  });