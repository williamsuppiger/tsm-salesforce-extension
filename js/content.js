//setup start
var ready = false;
var items;
const fields = ['s_labels', 's_qNames', 's_datatypes', 's_picklistValues', 
  'j_qNames', 'j_required', 'j_sortOrder'];
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
      if($("li a span[title='TSM Section Question  c']").length > 0)
      {
        $('.close button.slds-button').each(function(){ 
          this.click() 
        });
      }
      $("button[tabindex]").each(function (index) {
        if ($(this).text().indexOf("Close SQJ-") !== -1 || 
          $(this).text().indexOf("New Tsm Section Question Junction") !== -1) {
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

function loadTSMQuestionInfo(){
  //field inputs
  let input_qName = $('input:not(:disabled)[name=Name]');
  let input_qUniqueName = $('input:not(:disabled)[name=Question_Unique_Name__c]');
  let input_label = $('textarea.slds-textarea:eq(0)');
  let input_dataType = $("input.slds-input.slds-combobox__input:eq(1)");
  let input_picklistValues = $('textarea.slds-textarea:eq(1)');
  
  //validate all fields that will be used do exist on page
  if(!input_qName.length || !input_qUniqueName.length || !input_label.length || 
    !input_dataType.length || !input_picklistValues.length)
  {
    console.log("Can not find all fields on page that are needed to input data")
    return;
  }

  // autofill questionnaire question name & unique name
  qName = items["s_qNames"].shift();
  input_qName.val(qName);
  input_qUniqueName.val(qName)
  // after data updated for field, trigger changes
  input_qName[0].dispatchEvent(new Event('change', { bubbles: true }));
  input_qUniqueName[0].dispatchEvent(new Event('change', { bubbles: true }));

  // autofill label
  input_label.val(items["s_labels"].shift());
  input_label[0].dispatchEvent(new Event('input', { bubbles: true }));

  // more complex select for datatype picklist
  let dataType = items["s_datatypes"].shift().toLowerCase();
  input_dataType.click();
  //wait till data type picklist loads in
  waitForElementToDisplay("lightning-base-combobox-item",function(){
    $("lightning-base-combobox-item").each(function(index, value) {
    if( $(value).text().toLowerCase() == dataType ){
      $(value).click();
    }
  });},50,5000);
  //autofill picklist values if necessary
  if (dataType == "picklist") {
    input_picklistValues.val(items["s_picklistValues"].shift())
    input_picklistValues[0].dispatchEvent(new Event('input', { bubbles: true }));
  }
  else{
    // if not picklist, skip current element's picklist values
    items["s_picklistValues"].shift();
  }

  // update and store values
  setStorageData(items);
}

function loadJunctionInfo(){
  let input_qName = $('input[lightning-basecombobox_basecombobox][required]:first');
  let input_sortOrder = $('input:not(:disabled)[name=Sort_Order__c]');
  let input_required = $('input:not(:disabled)[name=Required__c]');

  //validate all fields that will be used do exist on page
  if(!input_qName.length || !input_sortOrder.length || !input_required.length)
  {
    console.log("Can not find all fields on page that are needed to input data")
    return;
  }

  // load in TSM Section question for current record
  let TSMQuestion = items["j_qNames"].shift().toLowerCase();
  input_qName.val(TSMQuestion);
  input_qName[0].dispatchEvent(new Event('input', { bubbles: true }));
  clickUntilDisplayed(input_qName, 'lightning-base-combobox-item', function(){
    $('ul[lightning-basecombobox_basecombobox] li lightning-base-combobox-item span.slds-media__body span.slds-listbox__option-text_entity').each(function() {
      if($(this).text().toLowerCase() == TSMQuestion){
        $(this).click()
      };
    });
  }, 50, 5000);

  input_sortOrder.val(items["j_sortOrder"]);
  input_sortOrder[0].dispatchEvent(new Event('change', { bubbles: true }));
  
  if (items["j_required"].shift().toLowerCase() == "required") {
    input_required[0].click();
  }

  // update and store values
  items["j_sortOrder"] += 1;
  setStorageData(items);
}

function getStorageData() {
  ready = false;
  // load in arrys of data
  chrome.storage.local.get(fields, function (storage) {
    items = storage;
    ready = true;
    console.log("Load Data executed");
  });
}

function setStorageData(data) {
  chrome.storage.local.set(
    data, function () {
    console.log('Questionnaire Data Saved');
  });
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

// modfied version of waitForElementToDisplay to click element until displayed
function clickUntilDisplayed(selectorClick, selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      selectorClick.click();
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
  
}