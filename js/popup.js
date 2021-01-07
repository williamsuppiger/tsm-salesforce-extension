/*
 * Send info from tsm question section autofill program to content.js
 */
document.getElementById("send-tsm").onclick = function () {
	let s_qNames = document.getElementById("q-unique-names").value.split("\n");
	let s_labels = document.getElementById("labels").value.split("\n");
	let s_datatypes = document.getElementById("datatypes").value.split("\n");
	let s_picklistValues = document.getElementById("picklist-values").value.split("\n");
	// validate lengths of each array to be the same
	mainLength = s_qNames.length;
	if (mainLength != s_labels.length || mainLength != s_datatypes.length || mainLength != s_picklistValues.length) {
		alertDifferentLengths();
	}
	chrome.storage.local.set(
		{
			's_qNames': s_qNames,
			's_labels': s_labels,
			's_datatypes': s_datatypes,
			's_picklistValues': s_picklistValues
		}, function () {
			// notify content.js of content update
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
	let j_qNames = document.getElementById("question-names").value.split("\n");
	let j_required = document.getElementById("required").value.split("\n");
	if (j_qNames.length != j_required.length) {
		alertDifferentLengths();
	}
	chrome.storage.local.set(
		{
			'j_qNames': j_qNames,
			'j_required': j_required,
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
document.getElementById("set-sort").onclick = function () {
	chrome.storage.local.set(
		{
			'j_sortOrder': parseInt(document.getElementById("sort-order").value, 10)
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
 * Switches between two programs
 */
$("#switch-program").click(function () {
	$("#tsm-q-autofill").toggle();
	$("#junction-q-autofill").toggle();
});

function alertDifferentLengths() {
	alert("Not all fields inputted have the same length.  You may want to try a " +
		"smaller amount of records to copy in. The data entered will still be stored.");
}

function greenFlash() {
	var bg = $("html").css('background'); // store original background
	$("html").css('background', 'green'); //change second element background
	setTimeout(function () {
		$("html").css('background', bg); // change it back after ...
	}, 1000); // waiting one second  
}