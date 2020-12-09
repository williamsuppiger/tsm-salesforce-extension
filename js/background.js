// background.js
var contentTabId;
var url;
$(document).ready(function () {
  //alert("Welcome to the T&S Extension");
});

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: command });
    });
});


