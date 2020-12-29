//setup start
var ready = false;
var items;
const fields = ['s_qUniqueNames', 's_labels', 's_qNames', 
  's_datatypes', 's_picklistValues', 'j_qNames', 'j_required', 'j_sortOrder'];
getStorageData();

/* Listen for message from the background-page and toggle the SideBar via hotkey */
chrome.runtime.onMessage.addListener(function (msg) {
  //wait for data to load in
  if (ready) {
    //if need to autoload info
    if (msg.action && (msg.action == "tsm-q-autoload")) {
      loadTSMQuestionInfo();
    }
    else if(msg.action && (msg.action == "junction-autoload")) {
      loadJunctionInfo();
    }
    else if (msg.action && (msg.action == "save-next-button")) {
      $('input').blur();
      $('button[title="Save & New"]').click();
    }
    else if (msg.action && (msg.action == "close-all-questions")) {
      $("button[tabindex]").each(function (index) {
        if ($(this).text().indexOf("Close QQ-") !== -1 || $(this).text().indexOf("New TSM Section Question") !== -1) {
          this.click()
        }
      });
    }

  }
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "updated data") {
      getStorageData();
    }
  }
);

function getStorageData() {
  ready = false;
  // load in arrys of data
  chrome.storage.sync.get(fields, function (storage) {
    items = storage;
    ready = true;
    console.log("Load Data executed");
  });
}

function setStorageData(data) {
  chrome.storage.sync.set(
    data, function () {
    console.log('Questionnaire Data Saved');
  });
}

function loadTSMQuestionInfo(){
  // autofill questionnaire question name
  $('input:not(:disabled)[name=Name]').val(items["s_qNames"].shift())
  // after data updated for field, trigger changes
  $('input:not(:disabled)[name=Name]')[0].dispatchEvent(new Event('change', { bubbles: true }));

  // autofill label
  $('textarea.slds-textarea:first').val(items["s_labels"].shift());
  $('textarea.slds-textarea:first')[0].dispatchEvent(new Event('input', { bubbles: true }));

  // more complex select for datatype picklist
  let dataType = items["s_datatypes"].shift().toLowerCase();
  $("input.slds-input.slds-combobox__input:last").click();
  //wait till data type picklist loads in
  waitForElementToDisplay("lightning-base-combobox-item",function(){
    $("lightning-base-combobox-item").each(function(index, value) {
    if( $(value).text().toLowerCase() == dataType ){
      $(value).click();
    }
  });},50,5000);
  //autofill picklist values if necessary
  if (dataType == "picklist") {
    $('input:not(:disabled)[name=Picklist_Values__c]').val(items["s_picklistValues"].shift())
    $('input:not(:disabled)[name=Picklist_Values__c]')[0].dispatchEvent(new Event('change', { bubbles: true }));
  }
  else{
    // if not picklist, skip current element's picklist values
    items["s_picklistValues"].shift();
  }

  //autofill question unique name
  $('input:not(:disabled)[name=Question_Unique_Name__c]').val(items["s_qUniqueNames"].shift())
  $('input:not(:disabled)[name=Question_Unique_Name__c]')[0].dispatchEvent(new Event('change', { bubbles: true }));

  // update and store values
  setStorageData(items);
}

function loadJunctionInfo(){
  // load in TSM Section question for current record
  let TSMQuestion = items["j_qNames"].shift().toLowerCase();
  let input = $('input[lightning-basecombobox_basecombobox][required]:first')
  input.val(TSMQuestion);
  input[0].dispatchEvent(new Event('input', { bubbles: true }));
  clickUntilDisplayed(input, 'lightning-base-combobox-item', function(){
    $('ul[lightning-basecombobox_basecombobox] li lightning-base-combobox-item span.slds-media__body').each(function() {
      if($(this).text().toLowerCase() == TSMQuestion){
        $(this).click()
      };
    });
  }, 50, 5000);

  $('input:not(:disabled)[name=Sort_Order__c]').val(items["j_sortOrder"]);
  $('input:not(:disabled)[name=Sort_Order__c]')[0].dispatchEvent(new Event('change', { bubbles: true }));
  
  // if (required.toLowerCase() == "required") {
  //   $('input:not(:disabled)[name=Required__c]')[0].click();
  // }

  // update and store values
  items["j_sortOrder"] += 1;
  setStorageData(items);
}

// found at https://stackoverflow.com/a/29754070
function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

function clickUntilDisplayed(selectorClick, selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      //modfied line to click element until displayed
      selectorClick.click();
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}