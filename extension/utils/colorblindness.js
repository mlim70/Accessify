// Color blindness options
document.getElementById('color-blind-none').addEventListener('click', function() {
    applyColorBlindFilter('none');
});

document.getElementById('color-blind-r').addEventListener('click', function() {
    applyColorBlindFilter('red-green');
});

document.getElementById('color-blind-g').addEventListener('click', function() {
    applyColorBlindFilter('red-green');
});

document.getElementById('color-blind-b').addEventListener('click', function() {
    applyColorBlindFilter('blue-yellow');
});

document.getElementById('color-blind-c').addEventListener('click', function() {
    applyColorBlindFilter('complete');
});

function applyColorBlindFilter(filterType) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'applyColorBlindFilter',
            filterType: filterType
        }, function(response) {
            if (response && !response.success) {
                console.error('Error applying filter:', response.error);
            }
        });
    });
}

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
