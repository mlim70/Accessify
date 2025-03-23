// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Extension Popup Initialized ===');

    // Debug: Check if user is logged in
    chrome.storage.sync.get(['userEmail'], function(result) {
        console.log('Current user email in storage:', result.userEmail);
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
            chrome.storage.sync.set({ colorBlindFilter: filterType }, () => {
                console.log('Saved color filter to storage:', filterType);
                
                // Then apply the filter
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
                        function(response) {
                            console.log('Color filter response:', response);
                        }
                    );
                });
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

    // Save button -> write to preferences (DynamoDB)
    const saveButton = document.querySelector('.save-button');
    console.log('Save button found:', saveButton ? 'Yes' : 'No');
    
    if (saveButton) {
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
                        alert('Preferences saved successfully!');
                    })
                    .catch(error => {
                        console.error('Error saving to DynamoDB:', error);
                        alert('Error saving preferences: ' + error.message);
                    });
                }
            );
        });
    }

    // Reset button
    const resetButton = document.querySelector('.reset-button');
    console.log('Reset button found:', resetButton ? 'Yes' : 'No');
    
    if (resetButton) {
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
