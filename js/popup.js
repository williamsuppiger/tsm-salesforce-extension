/*
 * Send info from tsm question section autofill program to content.js
 */
document.getElementById("send-tsm").onclick = function () {
    chrome.storage.local.set(
        {
            's_qNames': document.getElementById("q-unique-names").value.split("\n"),
            's_labels': document.getElementById("labels").value.split("\n"),
            's_datatypes': document.getElementById("datatypes").value.split("\n"),
            's_picklistValues': document.getElementById("picklist-values").value.split("\n"),
        }, function () {
            //notify content.js of content update
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "message": "updated data" });
            });
            greenFlash();
        });
}

/*
 * Send info from junction autofill program to content.js
 */
document.getElementById("send-junction").onclick = function () {
    chrome.storage.local.set(
        {
            'j_qNames': document.getElementById("question-names").value.split("\n"),
            'j_required': document.getElementById("required").value.split("\n"),
            'j_sortOrder': 1
        }, function () {
            //notify content.js of content update
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "message": "updated data" });
            });
            greenFlash();
        });
}

/*
 * Resets the sort order for autoload program in content.js
 */
document.getElementById("reset-sort").onclick = function () {
    chrome.storage.local.set(
        {
            'j_sortOrder': 1
        }, function () {
            //notify content.js of content update
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "message": "updated data" });
            });
            greenFlash();
        });
    document.get
}

/*
 * Switches between two programs
 */
$("#switch-program").click(function () {
    $("#tsm-q-autofill").toggle();
    $("#junction-q-autofill").toggle();
});

function greenFlash()
{
    var bg = $("html").css('background'); // store original background
    $("html").css('background', 'green'); //change second element background
    setTimeout(function () {
        $("html").css('background', bg); // change it back after ...
    }, 1000); // waiting one second  
}