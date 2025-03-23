// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Extension Popup Initialized ===');

    // Debug: Check if user is logged in
    chrome.storage.sync.get(['userEmail'], function(result) {
        console.log('Current user email in storage:', result.userEmail);
    });

    const screenReaderToggle = document.getElementById('screen-reader-toggle');

    // Load the stored state of the checkbox
    chrome.storage.sync.get(['screenReaderEnabled'], function (result) {
        screenReaderToggle.checked = result.screenReaderEnabled || false;
    });

    // Save the state of the checkbox when it changes
    screenReaderToggle.addEventListener('change', function () {
        chrome.storage.sync.set({ screenReaderEnabled: screenReaderToggle.checked });
    });



    // Color blindness options mapping
    const colorBlindButtons = {
        'color-blind-protanopia': 'protanopia',
        'color-blind-deuteranopia': 'deuteranopia',
        'color-blind-tritanopia': 'tritanopia',
        'color-blind-complete': 'complete'
    };

    // Set up event listeners for all colorblind buttons
    Object.keys(colorBlindButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        console.log(`Looking for button: ${buttonId}`, button ? 'Found' : 'Not found');
        if (!button) {
            console.warn(`Button not found: ${buttonId}`);
            return;
        }

        button.addEventListener('click', function() {
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

    // Set up event listeners for dyslexia treatment buttons
    const dyslexiaButtons = [
        'dyslexia-visual',
        'dyslexia-surface',
        'dyslexia-directional',
        'dyslexia-attentional'
    ];

    dyslexiaButtons.forEach(dyslexiaType => {
        const button = document.getElementById(dyslexiaType);
        console.log(`Looking for button: ${dyslexiaType}`, button ? 'Found' : 'Not found');
        if (!button) {
            console.warn(`Button not found: ${dyslexiaType}`);
            return;
        }

        button.addEventListener('click', function() {
            console.log(`Dyslexia button clicked: ${dyslexiaType}`);
            
            // Save to storage first
            chrome.storage.sync.set({ dyslexiaPreference: dyslexiaType }, () => {
                console.log('Saved dyslexia preference to storage:', dyslexiaType);
            });

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

    // Save button -> write to preferences (DynamoDB)
    const saveButton = document.querySelector('.save-button');
    if (!saveButton) {
        console.error('Save button not found.');
        return;
    }
    
    saveButton.addEventListener('click', async function() {
        console.log('=== Starting Save Process ===');
        
        // 1. Get user email
        const userEmail = await new Promise((resolve) => {
            chrome.storage.sync.get(['userEmail'], (result) => {
                console.log('Retrieved user email from storage:', result.userEmail);
                resolve(result.userEmail);
            });
        });

        if (!userEmail) {
            console.error('No user email found - user must log in first');
            alert('Please log in to the web app first');
            return;
        }

            // 2. Get current preferences
            console.log('Getting preferences from storage...');
            chrome.storage.sync.get(
                ['colorBlindFilter', 'preferredFont', 'dyslexiaPreference', 'language', 'additionalInfo'],
                function(result) {
                    console.log('Current storage state:', result);
                    
                    const additionalInfo = document.querySelector('.conditions-textarea')?.value || '';
                    console.log('Additional info from textarea:', additionalInfo);

                    const preferences = {
                        colorBlindFilter: result.colorBlindFilter || 'none',
                        preferredFont: result.preferredFont || 'default',
                        dyslexia: result.dyslexiaPreference || 'none',
                        language: result.language || 'en',
                        additionalInfo: additionalInfo
                    };

                    console.log('Assembled preferences object:', preferences);

                    // 3. Send to backend
                    console.log('Sending POST request to backend...');
                    fetch('http://localhost:3001/api/input', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userEmail,
                            preferences
                        })
                    })
                    .then(response => {
                        console.log('Received response:', response.status, response.statusText);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Successfully saved to DynamoDB:', data);
                        
                        // 4. Send to Claude for analysis
                        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                            if (!tabs[0]) {
                                console.error('No active tab found');
                                return;
                            }

                            chrome.tabs.sendMessage(
                                tabs[0].id,
                                {
                                    action: 'sendToClaude',
                                    preferences: preferences
                                },
                                function(response) {
                                    if (response.success) {
                                        console.log('Claude analysis:', response.response);
                                        alert('Preferences saved and page analyzed successfully!');
                                    } else {
                                        console.error('Claude analysis error:', response.error);
                                        alert('Preferences saved but analysis failed: ' + response.error);
                                    }
                                }
                            );
                        });
                    })
                })
                .then(response => {
                    console.log('Received response:', response.status, response.statusText);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Successfully saved to DynamoDB:', data);
                    alert('Preferences saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving to DynamoDB:', error);
                    alert('Error saving preferences: ' + error.message);
                });
            }
        );
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
});

document.addEventListener('DOMContentLoaded', function() {
    // Updated language data with correct character encoding
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'zh', name: 'Chinese', native: '中文' },
        { code: 'ar', name: 'Arabic', native: 'العربية' },
        { code: 'hi', name: 'Hindi', native: 'हिंदी' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' },
        { code: 'ko', name: 'Korean', native: '한국어' },
        { code: 'ja', name: 'Japanese', native: '日本語' },
        { code: 'de', name: 'German', native: 'Deutsch' },
        { code: 'fr', name: 'French', native: 'Français' },
        { code: 'ru', name: 'Russian', native: 'Русский' },
        { code: 'it', name: 'Italian', native: 'Italiano' },
        { code: 'sv', name: 'Swedish', native: 'Svenska' },
        { code: 'fi', name: 'Finnish', native: 'Suomi' },
        { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' }
    ];

    // Make sure the HTML file has proper UTF-8 encoding
    document.querySelector('head').innerHTML += '<meta charset="UTF-8">';

    const languageList = document.getElementById('language-list');
    const searchInput = document.getElementById('language-search');

    // Create and append language buttons
    function createLanguageButtons(filteredLanguages) {
        languageList.innerHTML = ''; // Clear current list
        filteredLanguages.forEach(lang => {
            const button = document.createElement('button');
            button.className = 'lang-button';
            button.dataset.langCode = lang.code;
            button.innerHTML = `${lang.native} <span class="lang-name">(${lang.name})</span>`;
            
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                // Handle language selection
                handleLanguageSelection(lang.code);
            });
            
            languageList.appendChild(button);
        });
    }

    // Initial population of language list
    createLanguageButtons(languages);

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLanguages = languages.filter(lang => 
            lang.name.toLowerCase().includes(searchTerm) || 
            lang.native.toLowerCase().includes(searchTerm)
        );
        createLanguageButtons(filteredLanguages);
    });

    // Handle language selection
    function handleLanguageSelection(langCode) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'translatePage',
                    targetLanguage: langCode
                },
                response => {
                    if (chrome.runtime.lastError) {
                        console.error('Translation error:', chrome.runtime.lastError);
                    }
                }
            );
        });
    }

    // Handle option buttons (Color Filters and Dyslexia)
    document.querySelectorAll('.option-group .big-button').forEach(button => {
        button.addEventListener('click', function() {
            const parentGroup = this.closest('.option-group');
            
            if (this.classList.contains('active')) {
                // If clicking an active button, deselect it (equivalent to 'none')
                this.classList.remove('active');
                // Handle deactivation logic
                handleOptionDeactivation(this.id);
            } else {
                // Remove active class from all buttons in this group
                parentGroup.querySelectorAll('.big-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                // Add active class to clicked button
                this.classList.add('active');
                // Handle activation logic
                handleOptionActivation(this.id);
            }
        });
    });

    function handleOptionActivation(optionId) {
        if (optionId.startsWith('color-blind-')) {
            // Handle color blindness filter activation
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyColorBlindFilter',
                        filterType: optionId.replace('color-blind-', '')
                    }
                );
            });
        } else if (optionId.startsWith('dyslexia-')) {
            // Handle dyslexia treatment activation
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyDyslexiaTreatment',
                        dyslexiaType: optionId
                    }
                );
            });
        }
    }

    function handleOptionDeactivation(optionId) {
        if (optionId.startsWith('color-blind-')) {
            // Handle color blindness filter deactivation
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyColorBlindFilter',
                        filterType: 'none'
                    }
                );
            });
        } else if (optionId.startsWith('dyslexia-')) {
            // Handle dyslexia treatment deactivation
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyDyslexiaTreatment',
                        dyslexiaType: 'dyslexia-none'
                    }
                );
            });
        }
    }
});
// Initialize font selector when jQuery is ready
window.addEventListener('load', function() {
    if (typeof jQuery !== 'undefined') {
        console.log('Initializing font selector...');
        const fonts = [
            { name: 'OpenDyslexic', comment: ' (Dyslexic-friendly)' },
            { name: 'Dyslexie', comment: ' (Dyslexic-friendly)' },
            { name: 'Arial', comment: '' },
            { name: 'Times New Roman', comment: '' }
            // Add more fonts as needed
        ];

        const fontSelect = document.createElement('select');
        fontSelect.id = 'fontSelect';
        fonts.forEach(font => {
            const option = new Option(font.name + font.comment, font.name);
            fontSelect.appendChild(option);
        });

        // Add to DOM
        const fontSection = document.createElement('div');
        fontSection.className = 'section';
        fontSection.innerHTML = '<h2>Font Selection</h2>';
        fontSection.appendChild(fontSelect);
        
        // Insert before the bottom buttons
        const buttonContainer = document.querySelector('.button-container');
        buttonContainer.parentNode.insertBefore(fontSection, buttonContainer);

        // Handle font changes
        fontSelect.addEventListener('change', function() {
            const selectedFont = this.value;
            chrome.storage.sync.set({ preferredFont: selectedFont }, () => {
                console.log('Font saved:', selectedFont);
            });
        });
    } else {
        console.error('jQuery not loaded');
    }
});
