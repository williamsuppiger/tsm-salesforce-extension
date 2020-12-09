document.getElementById("send").onclick = function () {
    chrome.storage.sync.set(
        {
            'apiNames': document.getElementById("api-names").value.split("\n"),
            'questions': document.getElementById("questions").value.split("\n"),
            'requiredFields': document.getElementById("requiredFields").value.split("\n"),
            'sortOrder': 1
        }, function () {
            //notify content.js of content update
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "message": "updated data" });
            });
            var bg = $("html").css('background'); // store original background
            $("html").css('background', 'green'); //change second element background
            setTimeout(function () {
                $("html").css('background', bg); // change it back after ...
            }, 1000); // waiting one second    
        });
}

document.getElementById("reset-sort").onclick = function () {
    chrome.storage.sync.set(
        {
            'sortOrder': 1
        }, function () {
            //notify content.js of content update
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "message": "updated data" });
            });
            var bg = $("html").css('background'); // store original background
            $("html").css('background', 'green'); //change second element background
            setTimeout(function () {
                $("html").css('background', bg); // change it back after ...
            }, 1000); // waiting one second    
        });
    document.get
}