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