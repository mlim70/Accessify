document.getElementById("applyFilter").addEventListener("click", function () {
  const filterType = document.getElementById("colorblindType").value;
  console.log("selected filter type:", filterType);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("send msg to tabs:", tabs[0].id);
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "applyColorBlindFilter",
      filterType: filterType,
    });
  });
});
