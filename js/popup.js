/*
 * Send info from autoload program to content.js
 */
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

/*
 * Resets the sort order for autoload program in content.js
 */
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

/*
 * Switches between two programs
 */
$("#switch-program").click(function () {
    $("#autoload-program").toggle();
    $("#api-names-program").toggle();
});

/*
 * Load new API names
 */
// TO DO: HANDLE TWO SPECIAL CASES General_Date_1__c, General_Picklist_1__c
$("#load-new-apis").click(function () {
    //clear ul contents
    $('#api-list').empty()
    const CUSTOM_OBJECT_TAG = "__c";
    //get old list from html
    let oldAPINames = document.getElementById("old-apis").value.split("\n");
    console.log(oldAPINames);
    //map of counts of objects
    let countMap = new Map();
    //new array of objects
    let newAPINames = [];

    //iterate over api names counting and updating values into new list
    oldAPINames.forEach(function (entry) {
        let baseName;
        // extract each special base name
        if (entry == "") {
            newAPINames.push("");
            // continue to next element
            return;
        }
        // handles cases such as General_Date_1__c where aleady using the numerated char
        // also does not trigger for general_text_100__c
        else if (parseInt(entry.charAt(entry.length - 4)) >= 1) {
            baseName = entry.substr(0, entry.length - 4);
            console.log(baseName);
        }
        else {
            baseName = entry.substr(0, entry.length - 3);
        }
        // setup the new full name of API by checking if it is alreday used
        let newName;
        if (countMap.has(baseName)) {
            let count = countMap.get(baseName);
            count++;
            newName = baseName + count + CUSTOM_OBJECT_TAG;
            countMap.set(baseName, count);
        }
        else {
            countMap.set(baseName, 1);
            newName = baseName + CUSTOM_OBJECT_TAG;
        }
        // insert into new api names array
        newAPINames.push(newName);
    });
    //display count list for duplicates
    countMap.forEach(function (value, key) {
        if(value > 1)
        {
            $("#api-list").append('<li>' + key + ': ' + value + '</li>');
        }
    })
    //display new api names
    document.getElementById("new-apis").value = newAPINames.join("\n");
});
