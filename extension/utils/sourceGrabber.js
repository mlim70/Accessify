// Function to grab HTML from current page
async function grabPageHTML() {
    try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Execute script in the tab to get HTML
        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                return {
                    url: window.location.href,
                    title: document.title,
                    html: document.documentElement.outerHTML
                };
            }
        });

        // Return the page data
        return result[0].result;
    } catch (error) {
        console.error('Error grabbing HTML:', error);
        throw error;
    }
}

// Add click event listener to grab HTML button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('grabSource').addEventListener('click', async () => {
        try {
            const pageData = await grabPageHTML();
            const sourceCodeArea = document.getElementById('sourceCode');
            sourceCodeArea.value = `URL: ${pageData.url}\nTitle: ${pageData.title}\n\n${pageData.html}`;
        } catch (error) {
            console.error('Failed to grab HTML:', error);
        }
    });
}); 