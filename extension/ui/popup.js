// Color-blindness Treatment
document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup DOM loaded, setting up event listeners for colorblind buttons');

    // Color blindness options mapping
    const colorBlindButtons = {
        'color-blind-none': 'none',
        'color-blind-r': 'protanopia',    // Protanopia (red-blind)
        'color-blind-g': 'deuteranopia',  // Deuteranopia (green-blind)
        'color-blind-b': 'tritanopia',    // Tritanopia (blue-blind)
        'color-blind-c': 'complete'       // Full color blindness
    };

    // Set up event listeners for all colorblind buttons
    Object.keys(colorBlindButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);

        if (!button) {
            console.error(`Button not found: ${buttonId}`);
            return;
        }

        console.log(`Setting up listener for button: ${buttonId}`);
        button.addEventListener('click', function() {
            const filterType = colorBlindButtons[buttonId];
            console.log(`Button clicked: ${buttonId}, applying filter: ${filterType}`);
            
            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                // Send message to content script
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyColorBlindFilter',
                        filterType: filterType
                    },
                    response => {
                        if (chrome.runtime.lastError) {
                            console.error('Error: ', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            console.log('Filter applied successfully');
                        } else {
                            console.error('Failed to apply filter: ', response?.error);
                        }
                    }
                );
            });
        });
    });
});

// Dyslexia Treatment Options
document.addEventListener("DOMContentLoaded", function() {
    console.log('Popup DOM loaded, setting up event listeners for dyslexia buttons');

    const dyslexiaButtons = [
        'dyslexia-none',
        'dyslexia-visual',
        'dyslexia-surface',
        'dyslexia-directional',
        'dyslexia-attentional'
    ];

    // Set up event listeners for all colorblind buttons
    dyslexiaButtons.forEach(dyslexiaType => {
        const button = document.getElementById(dyslexiaType);
        if (!button) {
            console.error(`Button not found: ${dyslexiaType}`);
            return;
        }

        console.log(`Setting up listener for button: ${dyslexiaType}`);
        button.addEventListener('click', function() {
            console.log(`Button clicked: ${dyslexiaType}, applying filter: ${dyslexiaType}`);
            
            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                // Send message to content script
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'applyDyslexiaTreatment',
                        dyslexiaType: dyslexiaType
                    },
                    response => {
                        if (chrome.runtime.lastError) {
                            console.error('Error: ', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            console.log('Dyslexia treatment applied successfully');
                        } else {
                            console.error('Failed to apply dyslexia treatment:', response?.error);
                        }
                    }
                );
            });
        });
    });
});

// Translation Functionality
document.addEventListener("DOMContentLoaded", function() {
    // Translation functionality
    const targetLanguageSelect = document.getElementById('target-languages');
    if (!targetLanguageSelect) {
        console.error('Translation language selector not found');
        return;
    }

    targetLanguageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        console.log(`Language selected: ${selectedLanguage}`);
        
        // Query for the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (!tabs[0]) {
                console.error('No active tab found');
                return;
            }
            
            // Send message to content script
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'translatePage',
                    targetLanguage: selectedLanguage
                },
                response => {
                    if (chrome.runtime.lastError) {
                        console.error('Translation error:', chrome.runtime.lastError);
                    } else if (response && response.success) {
                        console.log('Translation applied successfully');
                    } else {
                        console.error('Failed to apply translation:', response?.error);
                    }
                }
            );
        });
    });

    const restoreOriginalButton = document.getElementById('restore-original');
    if (!restoreOriginalButton) {
        console.error('Restore original language button');
        return;
    }
    restoreOriginalButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (!tabs[0]) {
                console.error('No active tab found');
                return;
            }
            
            // Send message to content script
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: 'restore-original'
                },
                response => {
                    if (chrome.runtime.lastError) {
                        console.error('Error restoring original:', chrome.runtime.lastError);
                    } else if (response && response.success) {
                        console.log('Successfully restored original site');
                    } else {
                        console.error('Failed to restore original site: ', response?.error);
                    }
                }
            );
        });
    });
});