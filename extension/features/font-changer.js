// Load the preferred font from storage
chrome.storage.sync.get('preferredFont', (data) => {
  const preferredFont = data.preferredFont || 'Comic+Sans+MS';

  // Create a link element to load the Google Web Font
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${preferredFont}&display=swap`;
  link.rel = 'stylesheet';

  // Append the link element to the head of the document
  document.head.appendChild(link);

  // Create a style element to apply the font to all elements
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      font-family: '${preferredFont.replace(/\+/g, ' ')}', sans-serif !important;
    }
  `;

  // Append the style element to the head of the document
  document.head.appendChild(style);
});
