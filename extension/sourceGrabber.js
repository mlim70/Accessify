// // Function to grab HTML and selected disabilities
// async function grabPageData() {
//     try {
//         // Get the active tab
//         const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
//         // Execute script in the tab to get HTML
//         const result = await chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: () => {
//                 return {
//                     url: window.location.href,
//                     title: document.title,
//                     html: document.documentElement.outerHTML
//                 };
//             }
//         });

//         // Get selected disabilities
//         const colorBlindType = document.querySelector('.color-blind-option.active')?.id || 'none';
//         const dyslexiaType = document.querySelector('.disability-bg button.active')?.textContent.trim() || 'none';

//         // Combine page data with disability preferences
//         return {
//             ...result[0].result,
//             preferences: {
//                 colorBlindness: colorBlindType,
//                 dyslexia: dyslexiaType
//             }
//         };
//     } catch (error) {
//         console.error('Error grabbing page data:', error);
//         throw error;
//     }
// }

// // Function to enhance page accessibility
// async function enhanceAccessibility(forceRegenerate = false) {
//     const statusElement = document.getElementById('status');
//     const regenerateButton = document.getElementById('regenerateEnhancement');
    
//     try {
//         statusElement.textContent = forceRegenerate ? 'Regenerating...' : 'Processing...';
//         statusElement.style.display = 'block';
//         statusElement.className = 'status-message processing';

//         const pageData = await grabPageData();
        
//         const response = await fetch('http://localhost:3000/api/enhance-accessibility', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 ...pageData,
//                 forceRegenerate
//             })
//         });

//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.message || 'Failed to enhance accessibility');
//         }

//         // Apply the enhanced HTML to the page
//         const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//         await chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: (html) => {
//                 document.documentElement.innerHTML = html;
//             },
//             args: [data.html]
//         });

//         // Show success message and regenerate button
//         statusElement.textContent = data.message;
//         statusElement.className = 'status-message success';
        
//         // Only show regenerate button if we're using cached version
//         if (data.cached) {
//             regenerateButton.style.display = 'block';
//         }

//         setTimeout(() => {
//             statusElement.style.display = 'none';
//         }, 3000);
//     } catch (error) {
//         console.error('Error:', error);
//         statusElement.textContent = `Error: ${error.message}`;
//         statusElement.className = 'status-message error';
//     }
// }

// // Add event listeners when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     const enhanceButton = document.getElementById('enhanceAccessibility');
//     const regenerateButton = document.getElementById('regenerateEnhancement');

//     enhanceButton.addEventListener('click', () => enhanceAccessibility(false));
//     regenerateButton.addEventListener('click', () => enhanceAccessibility(true));

//     // Add active class handling for disability buttons
//     document.querySelectorAll('.color-blind-option, .disability-bg button').forEach(button => {
//         button.addEventListener('click', (e) => {
//             // Remove active class from siblings
//             e.target.parentElement.querySelectorAll('button').forEach(btn => {
//                 btn.classList.remove('active');
//             });
//             // Add active class to clicked button
//             e.target.classList.add('active');
//         });
//     });
// }); 