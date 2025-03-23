// // Add authentication check function
// // async function checkAuthentication() {
// //     return new Promise((resolve) => {
// //         chrome.storage.sync.get(['userEmail'], function(result) {
// //             resolve(!!result.userEmail);
// //         });
// //     });
// // }

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "readText",
//     title: "Read",
//     contexts: ["selection"]
//   });
//   console.log("Context menu item 'Read' created");
// });

// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//   if (info.menuItemId === "readText") {
//     // Check authentication before proceeding
//     // const isAuthenticated = await checkAuthentication();
//     // if (!isAuthenticated) {
//     //   console.log("User not authenticated");
//     //   return;
//     // }

//     console.log("Read context menu item clicked");
//     console.log("Selected text:", info.selectionText);
//     console.log("Tab ID:", tab.id);
//     if (chrome.scripting) {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: readSelectedText,
//         args: [info.selectionText]
//       }, (results) => {
//         if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError.message);
//         } else {
//           console.log("Script executed successfully");
//         }
//       });
//     } else {
//       console.error("chrome.scripting is not available");
//     }
//   }
// });

// async function readSelectedText(text) {
//   console.log("Reading text:", text);
//   const tempaudio = new Audio();
//   tempaudio.src = "loadingNarration.mp3";
//   tempaudio.play();
//   try {
//     const response = await fetch("http://localhost:3001/api/tts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"},
//       body: JSON.stringify({ text })
//     });
//     console.log("Sent request to OpenAI Text-to-Speech API");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     console.log("Received response from OpenAI Text-to-Speech API");
//     console.log("Response:", response);
//     const audioBlob = await response.blob();
//     console.log("reviefed audio blob");
//     console.log("Audio blob:", audioBlob);
//     const audioUrl = URL.createObjectURL(audioBlob);
    
//     const audio = new Audio(audioUrl);
//     audio.play();


//   } catch (error) {
//     console.error('Error with OpenAI Text-to-Speech API:', error);
//   }
// }