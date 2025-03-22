// Add this at the very top of content.js, before any other code
console.log('Setting up email storage listener');

let isAuthenticated = false;

window.addEventListener('message', function(event) {
    console.log('Received window message:', event.data);
    
    // Only accept messages from our webpage
    if (event.origin !== 'http://localhost:3000') {
        console.log('Ignored message from:', event.origin);
        return;
    }
    
    if (event.data.type === 'STORE_USER_EMAIL' && event.data.email) {
        console.log('Attempting to store email:', event.data.email);
        isAuthenticated = true;
        chrome.storage.sync.set({ userEmail: event.data.email }, function() {
            console.log('Successfully stored email in Chrome storage:', event.data.email);
            // Notify the webpage that storage was successful
            window.postMessage({ type: 'EMAIL_STORED_SUCCESS' }, 'http://localhost:3000');
        });
    }
});

// Color blindness filter styles
const colorBlindFilters = {
    'none': 'none',
    'protanopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'protanopia\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#protanopia")',
    'deuteranopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'deuteranopia\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\'/></filter></svg>#deuteranopia")',
    'tritanopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'tritanopia\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\'/></filter></svg>#tritanopia")',
    'complete': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'achromatopsia\'><feColorMatrix type=\'matrix\' values=\'0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0\'/></filter></svg>#achromatopsia")'
};

console.log('Content script loaded with colorblind filters:', Object.keys(colorBlindFilters));

// Add near the top of your content.js, before other listeners
console.log('Content script initialized for email storage');

// Modify the message listener to check authentication
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message in content script:', request);
    
    // Check authentication before processing any requests
    if (!isAuthenticated) {
        chrome.storage.sync.get(['userEmail'], function(result) {
            if (result.userEmail) {
                isAuthenticated = true;
                processRequest(request, sendResponse);
            } else {
                sendResponse({ success: false, error: 'User not authenticated' });
            }
        });
        return true;
    }
    
    processRequest(request, sendResponse);
    return true;
});

function processRequest(request, sendResponse) {
    if (request.action === 'applyColorBlindFilter') {
        try {
            console.log('Attempting to apply filter:', request.filterType);
            applyColorBlindFilter(request.filterType);
            saveFilterPreference(request.filterType);
            console.log('Successfully applied filter: ', request.filterType);
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error applying colorblind filter:', error);
            sendResponse({ success: false, error: error.message });
        }
    } else if (request.action === 'applyDyslexiaTreatment') {
        applyDyslexiaTreatment(request.dyslexiaType);
        sendResponse({ success: true });
    } else if (request.action === 'translatePage') {
        translatePage(request.targetLanguage);
        sendResponse({ success: true });
    } else if (request.action === 'restore-original') {
        restoreOriginalHTML();
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message:', request);
    if (request.action === 'translatePage') {
        console.log(`Starting translation to ${request.targetLanguage}`);
        translatePageContent(request.targetLanguage).then(() => {
            console.log('Translation completed successfully');
            sendResponse({ success: true });
        }).catch(error => {
            console.error('Translation failed:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep the message channel open for async response
    }
});

// Function to translate text content
async function translateText(text, targetLanguage) {
    try {
        console.log(`Attempting to translate: "${text}" to ${targetLanguage}`);
        const response = await fetch('http://localhost:3001/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                targetLanguage
            })
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        console.log(`Translation result: "${data.translatedText}"`);
        return data.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
    }
}

// Function to translate all text content in the page
async function translatePageContent(targetLanguage) {
    console.log(`Starting page translation to ${targetLanguage}`);
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
    console.log(`Found ${elements.length} elements to translate`);
    
    for (const element of elements) {
        if (element.textContent.trim()) {
            try {
                const translatedText = await translateText(element.textContent, targetLanguage);
                element.textContent = translatedText;
            } catch (error) {
                console.error(`Error translating element: ${error}`);
            }
        }
    }
    console.log('Page translation completed');
}

async function generatePronunciationHints(text) {
    try {
        console.log(`Attempting to generate hints for: "${text}"`);
        const response = await fetch('http://localhost:3001/api/pronunciation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text
            })
        });

        if (!response.ok) {
            throw new Error('Pronunciation hints failed');
        }

        const data = await response.json();
        console.log(`Hint results: "${data.revisedText}"`);
        return data.revisedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
    }
}

function applyColorBlindFilter(filterType) {
    console.log('Applying filter type:', filterType);
    if (!colorBlindFilters.hasOwnProperty(filterType)) {
        throw new Error(`Invalid filter type: ${filterType}`);
    }

    // Remove any existing filter
    document.body.style.filter = '';
    console.log('Removed existing filter');
    
    // Apply new filter if not 'none'
    if (filterType !== 'none') {
        document.body.style.filter = colorBlindFilters[filterType];
        console.log('Applied new filter:', colorBlindFilters[filterType]);
    }
}

const applyOpenDyslexicFont = () => {
    const styleEl = document.createElement('style');
    styleEl.id = 'dyslexia-style-override';
    styleEl.innerHTML = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL('fonts/OpenDyslexic-Regular.otf')}') format('opentype');
            font-weight: normal;
            font-style: normal;
        }
        
        body, p, h1, h2, h3, h4, h5, h6, a, span, div, li, td, th, input, button, textarea, blockquote, label, figcaption {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL('fonts/OpenDyslexic-Bold.otf')}') format('opentype');
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
}

const increaseSpacing = (domNode) => {
    const children = domNode.childNodes;
    for (const child of children) {
        if (!child || child.nodeType !== 1) {
            continue;
        }
        child.style.wordSpacing = '10px';
        increaseSpacing(child);
    }
}

const removeImages = (domNode) => {
    const children = domNode.childNodes;
    for (const child of children) {
        if (!child || !(child.nodeType === 1)) {
            continue;
        }
        console.log(child.tagName);
        if (child.tagName === 'IMG' || child.tagName === 'svg' || child.tagName === 'VIDEO') {
            domNode.removeChild(child);
        } else {
            removeImages(child);
        }
    }
}

let originalHTML = null;
let additionalStyles = null;

const restoreOriginalHTML = () => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    const children = originalHTML.childNodes;
    for (let i = children.length - 1; i >= 0; --i) {
        const child = children[i];
        document.body.appendChild(child);
    }
    originalHTML = document.body.cloneNode(true);
}

function applyDyslexiaTreatment(dyslexiaType) {
    console.log(`Applying ${dyslexiaType}`);
    if (additionalStyles) {
        document.head.removeChild(additionalStyles);
        additionalStyles = null;
    }

    if (!originalHTML) {
        // Save the original HTML BEFORE any additional transformations have been applied.
        originalHTML = document.body.cloneNode(true);
    } else {
        restoreOriginalHTML();
    }

    if (dyslexiaType === 'dyslexia-visual') {
        applyOpenDyslexicFont();
    } else if (dyslexiaType === 'dyslexia-surface') {
        // Text-to-speech features can read content aloud, helping those who struggle with decoding words
        // Font adjustments to more dyslexia-friendly options like OpenDyslexic or Comic Sans
        // Word prediction and spell-check tools assist with writing
        
        const simplifyWords = async (domNode) => {
            // Process direct text child nodes
            for (let i = 0; i < domNode.childNodes.length; i++) {
                const node = domNode.childNodes[i];
                if (node.tagName !== 'P') {
                    continue;
                }

                const result = await generatePronunciationHints(node.textContent);
                node.textContent = result;
            }
            
            // Then recursively process element children
            for (let i = 0; i < domNode.children.length; i++) {
                simplifyWords(domNode.children[i]);
            }
        }
        applyOpenDyslexicFont();
        simplifyWords(document.body);
        increaseSpacing(document.body);
    } else if (dyslexiaType === 'dyslexia-directional') {
        // Page orientation controls
        // Simplified layouts through reader view

    } else if (dyslexiaType === 'dyslexia-attentional') {
        // Reader mode removes distracting elements from webpages
        // Focus highlighting tools that isolate individual words or sentences
        // Dark mode to reduce visual fatigue
        removeImages(document.body);
        increaseSpacing(document.body);
    }
}

async function translatePage(targetLanguage) {
    console.log(`Translating page to ${targetLanguage}`);
    if (additionalStyles) {
        document.head.removeChild(additionalStyles);
        additionalStyles = null;
    }

    if (!originalHTML) {
        // Save the original HTML BEFORE any additional transformations have been applied.
        originalHTML = document.body.cloneNode(true);
    } else {
        restoreOriginalHTML();
    }

    for (const element of elements) {
        if (element.textContent.trim()) {
            try {
                const translatedText = await translateText(element.textContent, targetLanguage);
                element.textContent = translatedText;
            } catch (error) {
                console.error(`Error translating element: ${error}`);
            }
        }
    }
    console.log('Page translation completed');
}

// Store the filter preference
function saveFilterPreference(filterType) {
    console.log('Saving filter preference:', filterType);
    chrome.storage.sync.set({
        colorBlindFilter: filterType
    }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving filter preference:', chrome.runtime.lastError);
        } else {
            console.log('Successfully saved filter preference');
        }
    });
}

// Load saved preference when page loads
chrome.storage.sync.get(['colorBlindFilter'], function(result) {
    console.log('Loading saved filter preference:', result);
    if (result.colorBlindFilter) {
        try {
            applyColorBlindFilter(result.colorBlindFilter);
        } catch (error) {
            console.error('Error applying saved filter:', error);
        }
    }
});

// Add this to verify the script is loaded
console.log('Content script initialization complete!');
