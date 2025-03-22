chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "readText",
    title: "Read",
    contexts: ["selection"]
  });
  console.log("Context menu item 'Read' created");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readText") {
    console.log("Read context menu item clicked");
    console.log("Selected text:", info.selectionText);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: readSelectedText,
      args: [info.selectionText]
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log("Script executed successfully");
      }
    });
  }
});

function readSelectedText(text) {
  console.log("Reading text:", text);
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}