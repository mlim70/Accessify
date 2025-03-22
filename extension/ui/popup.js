// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
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
        button.addEventListener('click', function () {
            const filterType = colorBlindButtons[buttonId];
            console.log(`Button clicked: ${buttonId}, applying filter: ${filterType}`);

            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
                    function (response) {
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
});

document.addEventListener("DOMContentLoaded", function () {
    console.log('Popup DOM loaded, setting up event listeners for dyslexia buttons');

    const dyslexiaButtons = [
        'dyslexia-none',
        'dyslexia-visual',
        'dyslexia-surface',
        'dyslexia-directional',
        'dyslexia-attentional'
    ];

    // Set up event listeners for all dyslexia buttons
    dyslexiaButtons.forEach(dyslexiaType => {
        const button = document.getElementById(dyslexiaType);
        if (!button) {
            console.error(`Button not found: ${dyslexiaType}`);
            return;
        }

        console.log(`Setting up listener for button: ${dyslexiaType}`);
        button.addEventListener('click', function () {
            console.log(`Button clicked: ${dyslexiaType}, applying filter: ${dyslexiaType}`);

            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
                    function (response) {
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

    // Translation functionality
    const targetLanguageSelect = document.getElementById('target-languages');
    if (targetLanguageSelect) {
        console.log('Setting up translation listener');
        targetLanguageSelect.addEventListener('change', function () {
            const selectedLanguage = this.value;
            console.log(`Language selected: ${selectedLanguage}`);

            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
                    function (response) {
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
});

// Enable Zoom functionality
document.addEventListener('DOMContentLoaded', function () {
    const enableZoomCheckbox = document.getElementById('enableZoom');
  
    chrome.storage.sync.get('enableZoom', (data) => {
      enableZoomCheckbox.checked = data.enableZoom || false;
    });
  
    enableZoomCheckbox.addEventListener('change', () => {
      const isEnabled = enableZoomCheckbox.checked;
      chrome.storage.sync.set({ enableZoom: isEnabled }, () => {
        chrome.runtime.sendMessage({ action: 'toggleZoom', enabled: isEnabled }, (response) => {
          if (response && response.success) {
            console.log('Zoom toggled and screenshot displayed in new tab');
          } else {
            console.error('Failed to toggle zoom and display screenshot');
          }
        });
      });
    });
  });

// Font selection functionality
$(document).ready(function () {
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

    // const enableZoomCheckbox = $('#enableZoom');
    // chrome.storage.sync.get('enableZoom', (data) => {
    //     enableZoomCheckbox.prop('checked', data.enableZoom || false);
    // });

    // enableZoomCheckbox.change(() => {
    //     const isEnabled = enableZoomCheckbox.is(':checked');
    //     console.log('Enable Zoom status changed:', isEnabled);
    //     chrome.storage.sync.set({ enableZoom: isEnabled }, () => {
    //         console.log('Enable Zoom status saved:', isEnabled);
    //     });
    // });
});