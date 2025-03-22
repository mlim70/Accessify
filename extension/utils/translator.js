// // Function to translate text content
// async function translateText(text, targetLanguage) {
//     try {
//         console.log(`Attempting to translate: "${text}" to ${targetLanguage}`);
//         const response = await fetch('http://localhost:3001/api/translate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 text,
//                 targetLanguage
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Translation failed');
//         }

//         const data = await response.json();
//         console.log(`Translation result: "${data.translatedText}"`);
//         return data.translatedText;
//     } catch (error) {
//         console.error('Translation error:', error);
//         return text; // Return original text if translation fails
//     }
// }

// // Function to translate all text content in the page
// async function translatePageContent(targetLanguage) {
//     console.log(`Starting page translation to ${targetLanguage}`);
//     const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
//     console.log(`Found ${elements.length} elements to translate`);
    
//     for (const element of elements) {
//         if (element.textContent.trim()) {
//             try {
//                 const translatedText = await translateText(element.textContent, targetLanguage);
//                 element.textContent = translatedText;
//             } catch (error) {
//                 console.error(`Error translating element: ${error}`);
//             }
//         }
//     }
//     console.log('Page translation completed');
// }

// // Listen for messages from popup
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('Received message:', request);
//     if (request.action === 'translatePage') {
//         console.log(`Starting translation to ${request.targetLanguage}`);
//         translatePageContent(request.targetLanguage)
//             .then(() => {
//                 console.log('Translation completed successfully');
//                 sendResponse({ success: true });
//             })
//             .catch(error => {
//                 console.error('Translation failed:', error);
//                 sendResponse({ success: false, error: error.message });
//             });
//         return true; // Keep the message channel open for async response
//     }
// });