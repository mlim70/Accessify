// // Specify your preferred Google Web Font here
// const preferredFont = 'Comic+Sans+MS';

// // Create a link element to load the Google Web Font
// const link = document.createElement('link');
// link.href = `https://fonts.googleapis.com/css2?family=${preferredFont}&display=swap`;
// link.rel = 'stylesheet';

// // Append the link element to the head of the document
// document.head.appendChild(link);

// // Create a style element to apply the font to all elements
// const style = document.createElement('style');
// style.innerHTML = `
//   * {
//     font-family: '${preferredFont.replace(/\+/g, ' ')}', sans-serif !important;
//   }
// `;

// Color blindness filter styles
const colorBlindFilters = {
    'none': 'none',
    'protanopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'protanopia\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#protanopia")',
    'deuteranopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'deuteranopia\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\'/></filter></svg>#deuteranopia")',
    'tritanopia': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'tritanopia\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\'/></filter></svg>#tritanopia")',
    'complete': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'achromatopsia\'><feColorMatrix type=\'matrix\' values=\'0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0\'/></filter></svg>#achromatopsia")'
};

console.log('Content script loaded with colorblind filters:', Object.keys(colorBlindFilters));

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message in content script:', request);
    if (request.action === 'applyColorBlindFilter') {
        try {
            console.log('Attempting to apply filter:', request.filterType);
            applyColorBlindFilter(request.filterType);
            saveFilterPreference(request.filterType);
            console.log('Successfully applied filter:', request.filterType);
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error applying colorblind filter:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Keep the message channel open for async response
});

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
