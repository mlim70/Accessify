// Wait for DOM to be fully loaded
/**
 * Color-blindness Buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Extension Popup Initialized ===');

  const screenReaderToggle = document.getElementById("screen-reader-toggle");

    // // Load the stored state of the checkbox
    // chrome.storage.sync.get(['screenReaderEnabled'], function (result) {
    //     screenReaderToggle.checked = result.screenReaderEnabled || false;
    // });

    // Save the state of the checkbox when it changes
    screenReaderToggle.addEventListener('change', function () {
        // chrome.storage.sync.set({ screenReaderEnabled: screenReaderToggle.checked });
    });

  // Color blindness options mapping
  const colorBlindButtons = {
    "color-blind-protanopia": "protanopia",
    "color-blind-deuteranopia": "deuteranopia",
    "color-blind-tritanopia": "tritanopia",
    "color-blind-complete": "complete",
  };

  // Set up event listeners for all colorblind buttons
  Object.keys(colorBlindButtons).forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    console.log(
      `Looking for button: ${buttonId}`,
      button ? "Found" : "Not found"
    );
    if (!button) {
      console.warn(`Button not found: ${buttonId}`);
      return;
    }

    button.addEventListener("click", function () {
      const filterType = colorBlindButtons[buttonId];
      console.log(`Color filter button clicked: ${buttonId} -> ${filterType}`);

      // Save to storage first
      // chrome.storage.sync.set({ colorBlindFilter: filterType }, () => {
      //     console.log('Saved color filter to storage:', filterType);
      // });

            // Apply the filter
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyColorBlindFilter',
                        filterType: filterType
                    },
                    response => {
                        console.log('Color filter response:', response);
                    }
                );
            });
        });
    });
});

/**
 * Dyslexia Buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for dyslexia treatment buttons
    const dyslexiaButtons = [
        'dyslexia-visual',
        'dyslexia-surface',
        'dyslexia-directional',
        'dyslexia-attentional'
    ];

  dyslexiaButtons.forEach((dyslexiaType) => {
    const button = document.getElementById(dyslexiaType);
    console.log(
      `Looking for button: ${dyslexiaType}`,
      button ? "Found" : "Not found"
    );
    if (!button) {
      console.warn(`Button not found: ${dyslexiaType}`);
      return;
    }

        button.addEventListener('click', function() {
            console.log(`Dyslexia button clicked: ${dyslexiaType}`);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyDyslexiaTreatment',
                        dyslexiaType: dyslexiaType
                    },
                    function(response) {
                        console.log('Dyslexia treatment response:', response);
                    }
                );
            });
        });
    });
});

/**
 * Save and reset buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Save button -> write to preferences (DynamoDB)
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
        // const { emailAddress, colorFilters, dyslexiaTreatment, language, screenReader, imageCaption, additional } = req.body;
        fetch("http://localhost:3001/api/save-preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                userPreferences
            })
        });
    });

    // Reset button
    const resetButton = document.querySelector('.reset-button');
    if (!resetButton) {
        console.error("Reset button not found");
        return;
    }
    
    resetButton.addEventListener('click', function() {
        console.log('Reset button clicked');
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
            // Create a new click event
            const clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            
            result = await preferences(emailValue);

            if (!result) {
                return;
            }
            // Dispatch the click event on the header
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
    // Create warning container
    removeRegisterMessage();
    removeLoginMessage();

    const warningDiv = document.createElement('div');
    warningDiv.id = registerMessageId;
    // warningDiv.style.backgroundColor = '#90EE90';
    warningDiv.style.backgroundColor = '#fff3cd';
    warningDiv.style.color = '#856404';
    warningDiv.style.padding = '12px';
    warningDiv.style.margin = '10px 0';
    warningDiv.style.borderRadius = '4px';
    warningDiv.style.border = '1px solid #ffeeba';
    warningDiv.style.textAlign = 'center';
    
    // Create warning text
    const warningText = document.createElement('p');
    warningText.textContent = 'You must ';
    warningText.style.margin = '0';
    warningText.style.fontSize = '16px';
    
    // Create sign-in link
    const signInLink = document.createElement('a');
    signInLink.href = 'http://localhost:3000'; // Change this to your login page URL
    signInLink.textContent = 'register';
    signInLink.style.color = '#0056b3';
    signInLink.style.fontWeight = 'bold';
    signInLink.style.textDecoration = 'underline';
    signInLink.target = '_blank';
    signInLink.rel = 'noopener noreferrer';
    
    // Complete the warning message
    const remainingText = document.createTextNode(' first to access this content.');
    
    // Assemble the warning message
    warningText.appendChild(signInLink);
    warningText.appendChild(remainingText);
    warningDiv.appendChild(warningText);
    
    // Insert at the beginning of the body
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
    // warningDiv.style.backgroundColor = '#90EE90';
    warningDiv.style.backgroundColor = '#fff3cd';
    warningDiv.style.color = '#856404';
    warningDiv.style.padding = '12px';
    warningDiv.style.margin = '10px 0';
    warningDiv.style.borderRadius = '4px';
    warningDiv.style.border = '1px solid #ffeeba';
    warningDiv.style.textAlign = 'center';
    
    // Create warning text
    const warningText = document.createElement('p');
    warningText.textContent = 'You must sign in to save preferences.';
    warningText.style.margin = '0';
    warningText.style.fontSize = '16px';
    
    warningDiv.appendChild(warningText);
    
    // Insert at the beginning of the body
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
    const response = await fetch("http://localhost:3001/api/check-email", {
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
        // does not exist
        // prompt user to create account
        addRegisterMessage();
        return null;
    } else {
        throw new Error(`Unexpected status ${data.status}`);
    }
}

function loadPreferences(results) {
    // Set color blindness filter
    const colorFilterOptions = document.querySelector('.option-group').getElementsByTagName('button');
    for (const option of colorFilterOptions) {
        if (option.id === `color-blind-${results.preferences.colorBlindFilter}`) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    }

    // Set dyslexia options
    const dyslexiaOptions = document.querySelectorAll('.option-group button[id^="dyslexia-"]');
    dyslexiaOptions.forEach(option => {
        if (option.id === results.preferences.dyslexia) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Set language
    const languageOptions = document.querySelectorAll('.lang-button');
    languageOptions.forEach(option => {
        if (option.dataset.langCode === results.preferences.language) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Set screen reader toggle
    const screenReaderToggle = document.getElementById('screen-reader-toggle');
    if (screenReaderToggle) {
        screenReaderToggle.checked = results.preferences.screenReader || false;
    }

    // Set image caption toggle
    const imageCaptionToggle = document.getElementById('image-caption-toggle');
    if (imageCaptionToggle) {
        imageCaptionToggle.checked = results.preferences.imageCaption || false;
    }

    // Set additional conditions
    const additionalConditions = document.querySelector('.conditions-textarea');
    if (additionalConditions) {
        additionalConditions.value = results.preferences.additionalInfo || '';
    }

    // Apply the preferences to the current page
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (!tabs[0]) return;

        // Apply color blind filter
        if (results.preferences.colorBlindFilter !== 'none') {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'applyColorBlindFilter',
                    filterType: results.preferences.colorBlindFilter
                }
            );
        }

        // Apply dyslexia treatment
        if (results.preferences.dyslexia !== 'none') {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'applyDyslexiaTreatment',
                    dyslexiaType: results.preferences.dyslexia
                }
            );
        }

        // Apply language translation
        if (results.preferences.language !== 'en') {
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


document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('.collapsible-header');
    
    headers.forEach(header => {
      header.addEventListener('click', function() {
        // Get the next sibling element which is the collapsible content
        const content = this.nextElementSibling;
        
        // Toggle the collapsed class
        content.classList.toggle('collapsed');
        
        // Change the arrow direction
        const toggleBtn = this.querySelector('.toggle-btn');
        if (content.classList.contains('collapsed')) {
          toggleBtn.style.transform = 'rotate(-90deg)';
        } else {
          toggleBtn.style.transform = 'rotate(0deg)';
        }
      });
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  // Updated language data with correct character encoding
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

  // Make sure the HTML file has proper UTF-8 encoding
  document.querySelector("head").innerHTML += '<meta charset="UTF-8">';

  const languageList = document.getElementById("language-list");
  const searchInput = document.getElementById("language-search");

  // Create and append language buttons
  function createLanguageButtons(filteredLanguages) {
    languageList.innerHTML = ""; // Clear current list
    filteredLanguages.forEach((lang) => {
      const button = document.createElement("button");
      button.className = "lang-button";
      button.dataset.langCode = lang.code;
      button.innerHTML = `${lang.native} <span class="lang-name">(${lang.name})</span>`;

      button.addEventListener("click", () => {
        // Remove active class from all buttons
        document
          .querySelectorAll(".lang-button")
          .forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");
        // Handle language selection
        handleLanguageSelection(lang.code);
      });

      languageList.appendChild(button);
    });
  }

  // Initial population of language list
  createLanguageButtons(languages);

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredLanguages = languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm) ||
        lang.native.toLowerCase().includes(searchTerm)
    );
    createLanguageButtons(filteredLanguages);
  });

  // Handle language selection
  function handleLanguageSelection(langCode) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "translatePage",
          targetLanguage: langCode,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Translation error:", chrome.runtime.lastError);
          }
        }
      );
    });
  }

  // Handle option buttons (Color Filters and Dyslexia)
  document.querySelectorAll(".option-group .big-button").forEach((button) => {
    button.addEventListener("click", function () {
      const parentGroup = this.closest(".option-group");

      if (this.classList.contains("active")) {
        // If clicking an active button, deselect it (equivalent to 'none')
        this.classList.remove("active");
        // Handle deactivation logic
        handleOptionDeactivation(this.id);
      } else {
        // Remove active class from all buttons in this group
        parentGroup
          .querySelectorAll(".big-button")
          .forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");
        // Handle activation logic
        handleOptionActivation(this.id);
      }
    });
  });

  function handleOptionActivation(optionId) {
    if (optionId.startsWith("color-blind-")) {
      // Handle color blindness filter activation
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "applyColorBlindFilter",
          filterType: optionId.replace("color-blind-", ""),
        });
      });
    } else if (optionId.startsWith("dyslexia-")) {
      // Handle dyslexia treatment activation
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "applyDyslexiaTreatment",
          dyslexiaType: optionId,
        });
      });
    }
  }

  function handleOptionDeactivation(optionId) {
    if (optionId.startsWith("color-blind-")) {
      // Handle color blindness filter deactivation
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "applyColorBlindFilter",
          filterType: "none",
        });
      });
    } else if (optionId.startsWith("dyslexia-")) {
      // Handle dyslexia treatment deactivation
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "applyDyslexiaTreatment",
          dyslexiaType: "dyslexia-none",
        });
      });
    }
  }
});
