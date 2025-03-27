// Add this at the very top of content.js, before any other code
console.log("Setting up email storage listener");

const backend = 'ubuntu@ec2-3-89-254-147.compute-1.amazonaws.com';
const portNum = 3001;
const backendURL = `${backend}:${portNum}`;

let currentAudio = null;

// window.addEventListener('message', function(event) {
//     console.log('Received window message:', event.data);

//     // Only accept messages from our webpage
//     if (event.origin !== 'http://localhost:3000') {
//         console.log('Ignored message from:', event.origin);
//         return;
//     }

//     if (event.data.type === 'STORE_USER_EMAIL' && event.data.email) {
//         console.log('Attempting to store email:', event.data.email);
//         isAuthenticated = true;
//         chrome.storage.sync.set({ userEmail: event.data.email }, function() {
//             console.log('Successfully stored email in Chrome storage:', event.data.email);
//             // Notify the webpage that storage was successful
//             window.postMessage({ type: 'EMAIL_STORED_SUCCESS' }, 'http://localhost:3000');
//         });
//     }
// });

// Create and manage speaker overlay
function createSpeakerOverlay(text) {
  const overlay = document.createElement("div");
  overlay.id = "speaker-overlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 999999;
        padding: 8px 0;
    `;

  const container = document.createElement("div");
  container.style.cssText = `
        width: 100%;
        max-width: 600px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;

  const icon = document.createElement("div");
  icon.textContent = "Reading Text...";
  icon.style.cssText = `
        color: #333;
        font-size: 14px;
        white-space: nowrap;
    `;

  const progressContainer = document.createElement("div");
  progressContainer.style.cssText = `
        flex: 1;
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
    `;

  const progressFill = document.createElement("div");
  progressFill.id = "speaker-progress-fill";
  progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: #7C3AED;
        transition: width 0.3s ease;
    `;

  progressContainer.appendChild(progressFill);
  container.appendChild(icon);
  container.appendChild(progressContainer);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  return overlay;
}

function updateSpeakerProgress(progress) {
  const progressFill = document.getElementById("speaker-progress-fill");
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
}

function removeSpeakerOverlay() {
  const overlay = document.getElementById("speaker-overlay");
  if (overlay) {
    overlay.remove();
  }
}

async function readSelectedText(text) {
  console.log("Reading text:", text);
  try {
    // Create and show speaker overlay
    const overlay = createSpeakerOverlay(text);

    const response = await fetch(`${backendURL}/api/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    console.log("Sent request to OpenAI Text-to-Speech API");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Received response from OpenAI Text-to-Speech API");
    console.log("Response:", response);
    const audioBlob = await response.blob();
    console.log("received audio blob");
    console.log("Audio blob:", audioBlob);
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    if (currentAudio) {
      currentAudio.src = "";
      currentAudio.pause();
    }

    // Update progress as audio plays
    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      updateSpeakerProgress(progress);
    });

    // Remove overlay when audio finishes playing
    audio.addEventListener("ended", removeSpeakerOverlay);

    audio.play();
    currentAudio = audio;
  } catch (error) {
    console.error("Error with OpenAI Text-to-Speech API:", error);
    removeSpeakerOverlay();
  }
}

let lastMouseMoveTime = 0;

document.addEventListener("mousemove", function () {
  lastMouseMoveTime = Date.now();
});

/**
 * Screen reader functionality
 */
document.addEventListener("mouseup", function () {
  const currentTime = Date.now();
  // Load the stored state of the screen reader toggle
  chrome.storage.sync.get(["screenReaderEnabled"], function (result) {
    const isEnabled = result.screenReaderEnabled || false;
    if (isEnabled) {
      console.log("Screen reader is enabled");
      if (currentTime - lastMouseMoveTime <= 1000) {
        // 50 milliseconds = 0.05 seconds
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          console.log("Text selected: " + selectedText);
          readSelectedText(selectedText);
        }
      }
    } else {
      console.log("Screen reader is disabled");
    }
  });
});

//color blindness filter styles
const colorBlindFilters = {
  none: "none",
  protanopia:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='protanopia'><feColorMatrix type='matrix' values='0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0'/></filter></svg>#protanopia\")",
  deuteranopia:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='deuteranopia'><feColorMatrix type='matrix' values='0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0'/></filter></svg>#deuteranopia\")",
  tritanopia:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='tritanopia'><feColorMatrix type='matrix' values='0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0'/></filter></svg>#tritanopia\")",
  complete:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='achromatopsia'><feColorMatrix type='matrix' values='0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0'/></filter></svg>#achromatopsia\")",
};

console.log(
  "Content script loaded with colorblind filters:",
  Object.keys(colorBlindFilters)
);

console.log("Content script loaded and initialized");

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in content script:", message);

    // Handle ping message
    if (message.action === 'ping') {
        sendResponse({ status: 'ok' });
        return true;
    }

    // Handle other messages
    switch (message.action) {
        case 'applyColorBlindFilter':
            applyColorBlindFilter(message.filterType);
            sendResponse({ success: true });
            break;

        case 'applyDyslexiaTreatment':
            applyDyslexiaTreatment(message.dyslexiaType);
            sendResponse({ success: true });
            break;

        case 'translatePage':
            translatePage(message.targetLanguage);
            sendResponse({ success: true });
            break;

        case 'restore-original':
            if (additionalStyles) {
                document.head.removeChild(additionalStyles);
                additionalStyles = null;
            }
            if (originalDocument) {
                restoreOriginalDocument();
            }
            document.body.style.filter = "";
            sendResponse({ success: true });
            break;

        case 'restore-language':
            if (originalDocument) {
                restoreOriginalDocument();
            }
            document.body.style.filter = "";
            sendResponse({ success: true });
            break;
    }
    return true;  // Will send response asynchronously
});

//translate text content
async function translateText(text, targetLanguage) {
  try {
    console.log(`Attempting to translate: "${text}" to ${targetLanguage}`);
    const response = await fetch(`${backendURL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    console.log(`Translation result: "${data.translatedText}"`);
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; //return original text if translation fails
  }
}

async function generatePronunciationHints(text) {
  try {
    console.log(`Attempting to generate hints for: "${text}"`);
    const response = await fetch(`${backendURL}/api/pronunciation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      throw new Error("Pronunciation hints failed");
    }

    const data = await response.json();
    console.log(`Hint results: "${data.revisedText}"`);
    return data.revisedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function applyColorBlindFilter(filterType) {
  console.log("Applying filter type:", filterType);
  if (!colorBlindFilters.hasOwnProperty(filterType)) {
    throw new Error(`Invalid filter type: ${filterType}`);
  }

  document.body.style.filter = "";
  console.log("Removed existing filter");

  if (filterType !== "none") {
    document.body.style.filter = colorBlindFilters[filterType];
    console.log("Applied new filter:", colorBlindFilters[filterType]);
  }
}

const applyOpenDyslexicFont = () => {
  const styleEl = document.createElement("style");
  styleEl.id = "dyslexia-style-override";
  styleEl.innerHTML = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL(
              "fonts/OpenDyslexic-Regular.otf"
            )}') format('opentype');
            font-weight: normal;
            font-style: normal;
        }
        
        body, p, h1, h2, h3, h4, h5, h6, a, span, div, li, td, th, input, button, textarea, blockquote, label, figcaption {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL(
              "fonts/OpenDyslexic-Bold.otf"
            )}') format('opentype');
            font-weight: bold;
            font-style: normal;
        }
        
        [class*="fa-"], 
        [class*="icon-"], 
        [class*="material-icons"],
        [class*="glyphicon"],
        .material-symbols-outlined,
        i[class*="fa"],
        i[class*="icon"],
        i[class*="material"] {
            font-family: inherit !important;
        }
    `;

  document.head.appendChild(styleEl);
  additionalStyles = styleEl;
};

const increaseSpacing = (domNode) => {
  const children = domNode.childNodes;
  for (const child of children) {
    if (!child || child.nodeType !== 1) {
      continue;
    }
    child.style.wordSpacing = "10px";
    increaseSpacing(child);
  }
};

const removeImages = (domNode) => {
  const children = domNode.childNodes;
  for (const child of children) {
    if (!child || !(child.nodeType === 1)) {
      continue;
    }
    console.log(child.tagName);
    if (
      child.tagName === "IMG" ||
      child.tagName === "svg" ||
      child.tagName === "VIDEO"
    ) {
      domNode.removeChild(child);
    } else {
      removeImages(child);
    }
  }
};

let originalDocument = null;
let currentLanguageDocument = null;
let additionalStyles = null;
let lastAppliedDyslexiaType = null;

const restoreOriginalDocument = () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  const children = originalDocument.childNodes;
  for (let i = children.length - 1; i >= 0; --i) {
    const child = children[i];
    document.body.appendChild(child);
  }
  originalDocument = document.body.cloneNode(true);
};

const restoreCurrentLanguageDocument = () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  const children = currentLanguageDocument.childNodes;
  for (let i = children.length - 1; i >= 0; --i) {
    const child = children[i];
    document.body.appendChild(child);
  }
  currentLanguageDocument = document.body.cloneNode(true);
};

function applyDyslexiaTreatment(dyslexiaType) {
  console.log(`Applying ${dyslexiaType}`);
  if (additionalStyles) {
    document.head.removeChild(additionalStyles);
    additionalStyles = null;
  }

  if (!originalDocument) {
    originalDocument = document.body.cloneNode(true);
  }

  if (!currentLanguageDocument) {
    currentLanguageDocument = originalDocument.cloneNode(true);
  }
  restoreCurrentLanguageDocument();

  if (dyslexiaType === "dyslexia-visual") {
    applyOpenDyslexicFont();
  } else if (dyslexiaType === "dyslexia-surface") {
    const simplifyWords = async (domNode) => {
      // Process direct text child nodes
      for (let i = 0; i < domNode.childNodes.length; i++) {
        const node = domNode.childNodes[i];
        if (node.tagName !== "P") {
          continue;
        }

        const result = await generatePronunciationHints(node.textContent);
        node.textContent = result;
      }

      //recursively process element children
      for (let i = 0; i < domNode.children.length; i++) {
        simplifyWords(domNode.children[i]);
      }
    };
    applyOpenDyslexicFont();
    simplifyWords(document.body);
    increaseSpacing(document.body);
  } else if (dyslexiaType === "dyslexia-directional") {
    //page orientation controls
    //simplified layouts through reader view
  } else if (dyslexiaType === "dyslexia-attentional") {
    //reader mode removes distracting elements from webpages
    //focus highlighting tools that isolate individual words or sentences
    //dark mode to reduce visual fatigue
    removeImages(document.body);
    increaseSpacing(document.body);
  }
  lastAppliedDyslexiaType = dyslexiaType;
}

async function translatePage(targetLanguage) {
  console.log(`Translating page to ${targetLanguage}`);

  if (!originalDocument) {
    originalDocument = document.body.cloneNode(true);
  } else {
    restoreOriginalDocument();
  }

  const elements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, span, a, figcaption"
  );
  const totalElements = elements.length;
  let translatedCount = 0;

  const overlay = createProgressOverlay();

  for (const element of elements) {
    if (element.textContent.trim()) {
      try {
        const translatedText = await translateText(
          element.textContent,
          targetLanguage
        );
        element.textContent = translatedText;
        translatedCount++;
        const progress = Math.round((translatedCount / totalElements) * 100);
        updateProgress(progress);
      } catch (error) {
        console.error(`Error translating element: ${error}`);
      }
    }
  }

  //remove progress overlay after a short delay
  setTimeout(removeProgressOverlay, 500);
  console.log("Page translation completed");

  //after translation, clone current DOM tree for safekeeping
  currentLanguageDocument = document.body.cloneNode(true);

  if (lastAppliedDyslexiaType) {
    applyDyslexiaTreatment(lastAppliedDyslexiaType);
  }
}

// Create and manage progress bar overlay
function createProgressOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "translation-progress-overlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 999999;
        padding: 8px 0;
    `;

  const container = document.createElement("div");
  container.style.cssText = `
        width: 100%;
        max-width: 600px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;

  const text = document.createElement("div");
  text.textContent = "Applying Transformation...";
  text.style.cssText = `
        color: #333;
        font-size: 14px;
        white-space: nowrap;
    `;

  const progressContainer = document.createElement("div");
  progressContainer.style.cssText = `
        flex: 1;
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
    `;

  const progressFill = document.createElement("div");
  progressFill.id = "translation-progress-fill";
  progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: #7C3AED;
        transition: width 0.3s ease;
    `;

  progressContainer.appendChild(progressFill);
  container.appendChild(text);
  container.appendChild(progressContainer);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  return overlay;
}

function updateProgress(progress) {
  const progressFill = document.getElementById("translation-progress-fill");
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
}

function removeProgressOverlay() {
  const overlay = document.getElementById("translation-progress-overlay");
  if (overlay) {
    overlay.remove();
  }
}

//store the filter preference
function saveFilterPreference(filterType) {
  console.log("Saving filter preference:", filterType);
  chrome.storage.sync.set(
    {
      colorBlindFilter: filterType,
    },
    function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error saving filter preference:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Successfully saved filter preference");
      }
    }
  );
}

//add this to verify the script is loaded
console.log("Content script initialization complete!");

//function to get HTML content and send to Claude
async function sendToClaude(prompt) {
  try {
    const html = document.documentElement.outerHTML;
    const response = await fetch(`${backendURL}/api/claude-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Claude response:", data);
    return data.response;
  } catch (error) {
    console.error("Error sending to Claude:", error);
    throw error;
  }
}
