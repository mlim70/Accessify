// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add this debug code at the top
    chrome.storage.sync.get(['userEmail'], function(result) {
        console.log('Current userEmail in storage:', result.userEmail);
        const loginWarning = document.getElementById('loginWarning');
        if (!result.userEmail) {
            loginWarning.style.display = 'block';
        } else {
            loginWarning.style.display = 'none';
        }
    });

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
                    function(response) {
                        if (chrome.runtime.lastError) {
                            console.error('Error:', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            console.log('Filter applied successfully');
                        } else {
                            console.error('Failed to apply filter:', response?.error);
                        }
                    }
                );
            });
        });
    });

    // Set up event listeners for dyslexia treatment buttons
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
            console.log(`Button clicked: ${dyslexiaType}, applying treatment: ${dyslexiaType}`);
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
                    function(response) {
                        if (chrome.runtime.lastError) {
                            console.error('Error:', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            console.log('Dyslexia treatment applied successfully');
                        } else {
                            console.error('Failed to apply filter:', response?.error);
                        }
                    }
                );
            });
        });
    });

    // Translation functionality
    const targetLanguageSelect = document.getElementById('target-languages');
    if (targetLanguageSelect) {
        console.log('Setting up translation listener');
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
                    function(response) {
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
    } else {
        console.error('Translation language selector not found');
    }

    // Save button -> write to preferences (DynamoDB)
    const saveButton = document.getElementById('savePreferences');
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            const userEmail = await new Promise((resolve) => {
                chrome.storage.sync.get(['userEmail'], (result) => {
                    resolve(result.userEmail);
                });
            });

            if (!userEmail) {
                console.error('Please log in to the web app first');
                // TODO: Show error message to user
                return;
            }

            // Get current preferences from storage
            chrome.storage.sync.get(
                ['colorBlindFilter', 'preferredFont', 'dyslexiaPreference'],
                function(result) {
                    const preferences = {
                        colorBlindFilter: result.colorBlindFilter || 'none',
                        preferredFont: result.preferredFont || 'default',
                        dyslexia: result.dyslexiaPreference || 'none'
                    };

                    // Send to backend
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
                    .then(response => response.json())
                    .then(data => {
                        console.log('Preferences saved to backend:', data);
                    })
                    .catch(error => {
                        console.error('Error saving preferences:', error);
                    });
                }
            );
        });
    }
});

// Font dropdown
$(document).ready(function() {
    const fonts = [
      { name: 'OpenDyslexic', comment: ' (Dyslexic-friendly)' },
      { name: 'Dyslexie', comment: ' (Dyslexic-friendly)' },
      { name: 'Lexend Deca', comment: ' (Dyslexic-friendly)' },
      { name: 'Lexend Tera', comment: ' (Dyslexic-friendly)' },
      { name: 'Arial', comment: '' },
      { name: 'Comic Sans MS', comment: '' },
      { name: 'Courier New', comment: '' },
      { name: 'Georgia', comment: '' },
      { name: 'Impact', comment: '' },
      { name: 'Times New Roman', comment: '' },
      { name: 'Trebuchet MS', comment: '' },
      { name: 'Verdana', comment: '' },
      { name: 'Open Sans', comment: '' },
      { name: 'Roboto', comment: '' },
      { name: 'Lato', comment: '' },
      { name: 'Montserrat', comment: '' },
      { name: 'Oswald', comment: '' },
      { name: 'Raleway', comment: '' },
      { name: 'PT Sans', comment: '' },
      { name: 'Merriweather', comment: '' },
      { name: 'Nunito', comment: '' }
      // Add more fonts as needed
    ];
  
    fonts.forEach(font => {
      $('#fontSelect').append(new Option(font.name + font.comment, font.name.replace(/\s+/g, '+')));
    });
  
    $('#fontSelect').select2({
      placeholder: 'Select a font',
      allowClear: true
    });
  
    $('#applyFont').click(() => {
      const selectedFont = $('#fontSelect').val();
      chrome.storage.sync.set({ preferredFont: selectedFont }, () => {
        console.log('Font saved:', selectedFont);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    });
  });