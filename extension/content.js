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
    'red-green': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'protanopia\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#protanopia")',
    'blue-yellow': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'tritanopia\'><feColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 0.908 0.092 0 0 0 0.8 0.2 0 0 0 0 0 1\'/></filter></svg>#tritanopia")',
    'complete': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'achromatopsia\'><feColorMatrix type=\'matrix\' values=\'0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1\'/></filter></svg>#achromatopsia")'
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'applyColorBlindFilter') {
        try {
            applyColorBlindFilter(request.filterType);
            saveFilterPreference(request.filterType);
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error applying colorblind filter:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Keep the message channel open for async response
});

function applyColorBlindFilter(filterType) {
    if (!colorBlindFilters.hasOwnProperty(filterType)) {
        throw new Error(`Invalid filter type: ${filterType}`);
    }

    // Remove any existing filter
    document.body.style.filter = '';
    
    // Apply new filter if not 'none'
    if (filterType !== 'none') {
        document.body.style.filter = colorBlindFilters[filterType];
    }
}

// Store the filter preference
function saveFilterPreference(filterType) {
    chrome.storage.sync.set({
        colorBlindFilter: filterType
    }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving filter preference:', chrome.runtime.lastError);
        }
    });
}

// Load saved preference when page loads
chrome.storage.sync.get(['colorBlindFilter'], function(result) {
    if (result.colorBlindFilter) {
        try {
            applyColorBlindFilter(result.colorBlindFilter);
        } catch (error) {
            console.error('Error applying saved filter:', error);
        }
    }
});

// Append the style element to the head of the document
document.head.appendChild(style);

// Add this to verify the script is loaded
console.log('Content script loaded!');
