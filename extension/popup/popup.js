const backend = 'ec2-54-166-40-219.compute-1.amazonaws.com';
const backendURL = `https://${backend}`;

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['preferences'], function(result) {
    if (result.preferences) {
      loadPreferences(result);
    }
  });
});

window.addEventListener('beforeunload', function() {
  const stateObject = {
    colorBlindFilter: document.querySelector('#colorBlind').value,
    dyslexia: document.querySelector('#dyslexia').value,
    colorBlindFilter: document.querySelector('#colorBlind').value,
    dyslexia: document.querySelector('#dyslexia').value,
    language: document.querySelector('#language').value,
    screenReader: document.querySelector('#screen-reader-toggle').checked,
    imageCaption: document.querySelector('#image-caption-toggle').checked
  };
  
  // Save to chrome.storage
  chrome.storage.local.set({myState: stateObject}, function() {
    console.log('State saved');
  });
});

// Make sure DOM is loaded first
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Extension Popup Initialized ===');

    // Load preferences
    chrome.storage.local.get(['preferences'], function(result) {
        if (result.preferences) {
            loadPreferences(result);
        }
    });

    // Screen reader toggle
    const screenReaderToggle = document.getElementById("screen-reader-toggle");
    if (screenReaderToggle) {
        chrome.storage.sync.get(['screenReaderEnabled'], function (result) {
            screenReaderToggle.checked = result.screenReaderEnabled || false;
        });

        screenReaderToggle.addEventListener('change', function () {
            chrome.storage.sync.set({ screenReaderEnabled: screenReaderToggle.checked });
        });
    }

    // Buttons
    const colorBlindButtons = {
        "color-blind-protanopia": "protanopia",
        "color-blind-deuteranopia": "deuteranopia",
        "color-blind-tritanopia": "tritanopia",
        "color-blind-complete": "complete",
    };

    Object.keys(colorBlindButtons).forEach((buttonId) => {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.warn(`Button not found: ${buttonId}`);
            return;
        }

        button.addEventListener("click", async function () {
            const filterType = colorBlindButtons[buttonId];
            console.log(`Color filter button clicked: ${buttonId} -> ${filterType}`);

            // Toggle 'selected' (active)
            const isActive = button.classList.contains('active');
            document.querySelectorAll('.colorfilter-options button').forEach(btn => btn.classList.remove('active'));
            if (!isActive) {
                button.classList.add('active');
            }

            chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                try {
                    await ensureContentScriptLoaded(tabs[0].id);
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: 'applyColorBlindFilter',
                            filterType: isActive ? 'none' : filterType
                        },
                        response => {
                            console.log('Color filter response:', response);
                        }
                    );
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    });

    // Buttons
    const dyslexiaButtons = [
        'dyslexia-visual',
        'dyslexia-surface',
        'dyslexia-directional',
        'dyslexia-attentional'
    ];

    dyslexiaButtons.forEach((dyslexiaType) => {
        const button = document.getElementById(dyslexiaType);
        if (!button) {
            console.warn(`Button not found: ${dyslexiaType}`);
            return;
        }

        button.addEventListener('click', async function() {
            console.log(`Dyslexia button clicked: ${dyslexiaType}`);

            // Toggle 'selected' (active)
            const isActive = button.classList.contains('active');
            document.querySelectorAll('.dyslexia-options button').forEach(btn => btn.classList.remove('active'));
            if (!isActive) {
                button.classList.add('active');
            }

            chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                try {
                    await ensureContentScriptLoaded(tabs[0].id);
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: 'applyDyslexiaTreatment',
                            dyslexiaType: isActive ? 'none' : dyslexiaType
                        },
                        response => {
                            console.log('Dyslexia treatment response:', response);
                        }
                    );
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    });

    // Language buttons
    const languages = [
        { code: "en", name: "English", native: "English" },
        { code: "es", name: "Spanish", native: "Español" },
        { code: "zh", name: "Chinese", native: "中文" },
        { code: "ar", name: "Arabic", native: "العربية" },
        { code: "hi", name: "Hindi", native: "हिंदी" },
        { code: "te", name: "Telugu", native: "తెలుగు" },
        { code: "ko", name: "Korean", native: "한국어" },
        { code: "ja", name: "Japanese", native: "日本語" },
        { code: "de", name: "German", native: "Deutsch" },
        { code: "fr", name: "French", native: "Français" },
        { code: "ru", name: "Russian", native: "Русский" },
        { code: "it", name: "Italian", native: "Italiano" },
        { code: "sv", name: "Swedish", native: "Svenska" },
        { code: "fi", name: "Finnish", native: "Suomi" },
        { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
    ];

    const languageList = document.getElementById("language-list");
    const searchInput = document.getElementById("language-search");

    function createLanguageButtons(filteredLanguages) {
        languageList.innerHTML = "";
        filteredLanguages.forEach((lang) => {
            const button = document.createElement("button");
            button.className = "lang-button";
            button.dataset.langCode = lang.code;
            button.innerHTML = `${lang.native} <span class="lang-name">(${lang.name})</span>`;

            button.addEventListener("click", () => {
                document.querySelectorAll(".lang-button").forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                handleLanguageSelection(lang.code);
            });

            languageList.appendChild(button);
        });
    }

    createLanguageButtons(languages);

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredLanguages = languages.filter(
                (lang) =>
                    lang.name.toLowerCase().includes(searchTerm) ||
                    lang.native.toLowerCase().includes(searchTerm)
            );
            createLanguageButtons(filteredLanguages);
        });
    }

    // Collapsibles
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('collapsed');
            
            const toggleBtn = this.querySelector('.toggle-btn');
            if (content.classList.contains('collapsed')) {
                toggleBtn.style.transform = 'rotate(-90deg)';
            } else {
                toggleBtn.style.transform = 'rotate(0deg)';
            }
        });
    });
});

//Save/reset buttons
document.addEventListener('DOMContentLoaded', function() {
    // Save to DYNAMO
    const saveButton = document.querySelector('.save-button');
    if (!saveButton) {
        console.error('Save button not found.');
        return;
    }
    
    saveButton.addEventListener('click', () => {
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn.innerHTML !== '✅') {
            return;
        }
        const emailInputBox = document.getElementById("email-input-box");
        const emailValue = emailInputBox.value;

        let userPreferences = {}
        const colorFilterOptionsContainer = 'colorfilter-options';
        const colorFilterOptions = document.querySelector(`.${colorFilterOptionsContainer}`).getElementsByTagName('button');
        for (const option of colorFilterOptions) {
            if (option.classList.contains('active')) {
                console.log("Active Color Filter Button:");
                console.log(option.id);
                console.log();

                userPreferences[colorFilterOptionsContainer] = option.id;
                break;
            }
        }

        const dyslexiaOptionsContainer = 'dyslexia-options';
        const dyslexiaOptions = document.querySelector(`.${dyslexiaOptionsContainer}`).getElementsByTagName('button');
        for (const option of dyslexiaOptions) {
            if (option.classList.contains('active')) {
                console.log("Active Dyslexia Button:");
                console.log(option.id);
                console.log();

                userPreferences[dyslexiaOptionsContainer] = option.id;
                break;
            }
        }

        const languageOptionsContainer = 'language-options';
        const languageOptions = document.querySelector(`.${languageOptionsContainer}`).getElementsByTagName('button');
        for (const option of languageOptions) {
            if (option.classList.contains('active')) {
                console.log("Active Language Button: ");
                console.log(option.id);
                console.log();

                userPreferences[languageOptionsContainer] = option.id;
                break;
            }
        }

        const additionalConstraintsElement = 'conditions-textarea';
        const additionalConstraints = document.querySelector(`.${additionalConstraintsElement}`).value;
        userPreferences[additionalConstraintsElement] = additionalConstraints;

        const screenReaderToggle = 'screen-reader-toggle';
        const screenReader = document.getElementById(screenReaderToggle).checked;
        userPreferences[screenReaderToggle] = screenReader;

        const imageCaptionToggle = 'image-caption-toggle';
        const imageCaption = document.getElementById(imageCaptionToggle).checked;
        userPreferences[imageCaptionToggle] = imageCaption;        
        
        userPreferences['emailAddress'] = emailValue;
        fetch(`${backendURL}/api/save-preferences`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                userPreferences
            })
        });
    });

    const resetButton = document.querySelector('.reset-button');
    if (!resetButton) {
        console.error("Reset button not found");
        return;
    }
    
    resetButton.addEventListener('click', function() {
        resetAll(); //De-select buttons
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: 'restore-original' },
                function(response) {
                    console.log('Reset response:', response);
                }
            );
        });
    });

    const resetLanguageButton = document.querySelector('.reset-language-button');
    if (!resetLanguageButton) {
        console.error("Reset language button not found");
        return;
    }

    resetLanguageButton.addEventListener('click', function() {
        console.log('Reset language button clicked');
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: 'restore-language' },
                function(response) {
                    console.log('Reset language response:', response);
                }
            );
        });
    });

    const confirmEmailButton = document.querySelector('.confirm-email-button');
    if (!confirmEmailButton) {
        console.error("Confirm email button not found");
        return;
    }

    confirmEmailButton.addEventListener('click', function() {
        const headers = document.querySelectorAll('.collapsible-header');
        headers.forEach(async function(header) {
            const emailInputBox = document.getElementById("email-input-box");
            const emailValue = emailInputBox.value;
            if (!(emailValue && emailValue.includes('@') && emailValue.includes('.'))) {
                return;
            }
            const clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            
            result = await preferences(emailValue);

            if (!result) {
                return;
            }
            header.dispatchEvent(clickEvent);
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            const toggleBtn = document.querySelector('.toggle-btn');
            toggleBtn.innerHTML = '✅';
            toggleBtn.style.transform = 'rotate(0deg)';
            removeRegisterMessage();
            loadPreferences(result);
        });
    });
});

const registerMessageId = "registration-reminder";
function addRegisterMessage() {
    removeRegisterMessage();
    removeLoginMessage();

    const warningDiv = document.createElement('div');
    warningDiv.id = registerMessageId;
    warningDiv.style.backgroundColor = '#fff3cd';
    warningDiv.style.color = '#856404';
    warningDiv.style.padding = '12px';
    warningDiv.style.margin = '10px 0';
    warningDiv.style.borderRadius = '4px';
    warningDiv.style.border = '1px solid #ffeeba';
    warningDiv.style.textAlign = 'center';
    
    const warningText = document.createElement('p');
    warningText.textContent = 'You must ';
    warningText.style.margin = '0';
    warningText.style.fontSize = '16px';
    
    const signInLink = document.createElement('a');
    signInLink.href = 'https://accessify-extension.com/';
    signInLink.textContent = 'register';
    signInLink.style.color = '#0056b3';
    signInLink.style.fontWeight = 'bold';
    signInLink.style.textDecoration = 'underline';
    signInLink.target = '_blank';
    signInLink.rel = 'noopener noreferrer';
    
    const remainingText = document.createTextNode(' first to access this content.');
    
    warningText.appendChild(signInLink);
    warningText.appendChild(remainingText);
    warningDiv.appendChild(warningText);
    
    const bodyElement = document.body;
    bodyElement.insertBefore(warningDiv, document.getElementById("first-section"));
}

function removeRegisterMessage() {
    const existingWarningMessage = document.getElementById(registerMessageId);
    if (existingWarningMessage) {
        existingWarningMessage.remove();
    }
}

const loginMessageId = "registration-reminder";
function addLoginMessage() {
    removeRegisterMessage();
    removeLoginMessage();

    const warningDiv = document.createElement('div');
    warningDiv.id = registerMessageId;
    warningDiv.style.backgroundColor = '#fff3cd';
    warningDiv.style.color = '#856404';
    warningDiv.style.padding = '12px';
    warningDiv.style.margin = '10px 0';
    warningDiv.style.borderRadius = '4px';
    warningDiv.style.border = '1px solid #ffeeba';
    warningDiv.style.textAlign = 'center';
    
    const warningText = document.createElement('p');
    warningText.textContent = 'You must sign in to save preferences.';
    warningText.style.margin = '0';
    warningText.style.fontSize = '16px';
    
    warningDiv.appendChild(warningText);
    
    const bodyElement = document.body;
    bodyElement.insertBefore(warningDiv, document.getElementById("first-section"));
}

function removeLoginMessage() {
    const existingWarningMessage = document.getElementById(loginMessageId);
    if (existingWarningMessage) {
        existingWarningMessage.remove();
    }
}

async function preferences(email) {
    const response = await fetch(`${backendURL}/api/check-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailAddress: email })
    });

    if (response.status === 200) {
        const data = await response.json();
        return data.preferences;
    } else if (response.status === 404) {
        addRegisterMessage();
        return null;
    } else {
        throw new Error(`Unexpected status ${data.status}`);
    }
}

function handleLanguageSelection(langCode) {
    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
        if (!tabs[0]) {
            console.error('No active tab found');
            return;
        }
        
        try {
            await ensureContentScriptLoaded(tabs[0].id);
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: "translatePage",
                    targetLanguage: langCode,
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Translation error:", chrome.runtime.lastError);
                    } else {
                        console.log('Translation response:', response);
                    }
                }
            );
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Load preferences
async function loadPreferences(results) {
    if (!results || !results.preferences) {
        console.warn('No preferences to load');
        return;
    }

    const colorFilterOptions = document.querySelector('.option-group').getElementsByTagName('button');
    for (const option of colorFilterOptions) {
        if (option.id === `color-blind-${results.preferences.colorBlindFilter}`) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    }

    const dyslexiaOptions = document.querySelectorAll('.option-group button[id^="dyslexia-"]');
    dyslexiaOptions.forEach(option => {
        if (option.id === results.preferences.dyslexia) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    const languageOptions = document.querySelectorAll('.lang-button');
    languageOptions.forEach(option => {
        if (option.dataset.langCode === results.preferences.language) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    const screenReaderToggle = document.getElementById('screen-reader-toggle');
    if (screenReaderToggle) {
        screenReaderToggle.checked = results.preferences.screenReader || false;
    }

    const imageCaptionToggle = document.getElementById('image-caption-toggle');
    if (imageCaptionToggle) {
        imageCaptionToggle.checked = results.preferences.imageCaption || false;
    }

    const additionalConditions = document.querySelector('.conditions-textarea');
    if (additionalConditions) {
        additionalConditions.value = results.preferences.additionalInfo || '';
    }

    //Apply the modifications
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (!tabs[0]) return;

        if (results.preferences.colorBlindFilter && results.preferences.colorBlindFilter !== 'none') {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'applyColorBlindFilter',
                    filterType: results.preferences.colorBlindFilter
                }
            );
        }

        if (results.preferences.dyslexia && results.preferences.dyslexia !== 'none') {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'applyDyslexiaTreatment',
                    dyslexiaType: results.preferences.dyslexia
                }
            );
        }

        if (results.preferences.language && results.preferences.language !== 'en') {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'translatePage',
                    targetLanguage: results.preferences.language
                }
            );
        }
    });
}

async function ensureContentScriptLoaded(tabId) {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, { action: 'ping' }, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });

        if (response && response.status === 'ok') {
            console.log('Content script is loaded');
            return true;
        }
    } catch (error) {
        console.log('Content script not loaded, injecting...');
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
            console.log('Content script injected successfully');
            return true;
        } catch (injectionError) {
            console.error('Failed to inject content script:', injectionError);
            throw injectionError;
        }
    }
}

function resetAll() {
    // reset buttons
    const colorBlindButtons = document.querySelectorAll('.colorfilter-options button');
    colorBlindButtons.forEach(button => {
        button.classList.remove('active');
    });
    const dyslexiaButtons = document.querySelectorAll('.dyslexia-options button');
    dyslexiaButtons.forEach(button => {
        button.classList.remove('active');
    });
    const languageButtons = document.querySelectorAll('.lang-button');
    languageButtons.forEach(button => {
        button.classList.remove('active');
    });
    const screenReaderToggle = document.getElementById('screen-reader-toggle');
    if (screenReaderToggle) {
        screenReaderToggle.checked = false;
    }

    const imageCaptionToggle = document.getElementById('image-caption-toggle');
    if (imageCaptionToggle) {
        imageCaptionToggle.checked = false;
    }
    // Clear current preferences
    chrome.storage.local.remove('accessifyPreferences', function() {
        console.log('All preferences reset');
    });
}
