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

// Color matrices for different types of color blindness
const colorBlindnessFilters = {
  normal: 'none',
  // Red-Blind
  protanopia: '0.567 0.433 0 0 0   0.558 0.442 0 0 0   0 0.242 0.758 0 0   0 0 0 1 0',
  // Green-Blind
  deuteranopia: '0.625 0.375 0 0 0   0.7 0.3 0 0 0   0 0.3 0.7 0 0   0 0 0 1 0',
  // Blue-Blind
  tritanopia: '0.95 0.05 0 0 0   0 0.433 0.567 0 0   0 0.475 0.525 0 0   0 0 0 1 0'
};

// Function to apply color blindness filter
function applyColorBlindFilter(filterType) {
  console.log('Applying filter:', filterType);
  
  // Always remove existing filter first
  removeExistingFilter();
  
  if (filterType === 'normal') {
    return;
  }

  // Generate a unique ID for each filter type
  const filterId = `colorBlindFilter_${filterType}`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('style', 'position: fixed; top: 0; left: 0; height: 0; width: 0;');
  svg.setAttribute('id', `svg_${filterId}`); // Add unique ID to SVG
  
  svg.innerHTML = `
    <defs>
      <filter id="${filterId}">
        <feColorMatrix type="matrix" values="${colorBlindnessFilters[filterType]}" />
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);

  // Apply the filter using the unique ID
  document.documentElement.style.filter = `url(#${filterId})`;
}

// Function to remove existing filter
function removeExistingFilter() {
  // Remove all SVG filters
  const existingSvgs = document.querySelectorAll('svg[id^="svg_colorBlindFilter"]');
  existingSvgs.forEach(svg => svg.remove());
  document.documentElement.style.filter = 'none';
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === 'applyColorBlindFilter') {
    applyColorBlindFilter(request.filterType);
  }
});

// Store the filter preference
function saveFilterPreference(filterType) {
  chrome.storage.sync.set({
    colorBlindFilter: filterType
  });
}

// Load saved preference when page loads
chrome.storage.sync.get(['colorBlindFilter'], function(result) {
  if (result.colorBlindFilter) {
    applyColorBlindFilter(result.colorBlindFilter);
  }
});

// Append the style element to the head of the document
document.head.appendChild(style);

// Add this to verify the script is loaded
console.log('Content script loaded!');
