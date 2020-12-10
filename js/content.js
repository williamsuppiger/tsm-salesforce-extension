//setup start
var apiNames = questions = requiredFields = [], sortOrder;
var ready = false;
const fields = ['apiNames', 'questions', 'requiredFields', 'sortOrder'];
loadData();

/* Listen for message from the background-page and toggle the SideBar via hotkey */
chrome.runtime.onMessage.addListener(function (msg) {
  //wait for data to load in
  if (ready) {
    //if need to autoload info
    if (msg.action && (msg.action == "toggle-autoload-info")) {
      const api = apiNames.shift();
      const question = questions.shift();
      const required = requiredFields.shift();

      //update values of fields and trigger changes
      $('input:not(:disabled)[name=Field_API_Name__c]').val(api)
      $('input:not(:disabled)[name=Field_API_Name__c]')[0].dispatchEvent(new Event('change', { bubbles: true }));
      $('input:not(:disabled)[name=Sort_Order__c]').val(sortOrder);
      $('input:not(:disabled)[name=Sort_Order__c]')[0].dispatchEvent(new Event('change', { bubbles: true }));
      $('textarea.slds-textarea:first').val(question);
      $('textarea.slds-textarea:first')[0].dispatchEvent(new Event('input', { bubbles: true }));
      if (required != "") {
        $('input:not(:disabled)[name=Required__c]')[0].click();
      }
      
      // update and store values
      sortOrder += 1;
      chrome.storage.sync.set({
        'apiNames': apiNames,
        'questions': questions,
        'requiredFields': requiredFields,
        'sortOrder': sortOrder
      }, function () {
        console.log('Questionnaire Data Saved');
      });
    }
    else if (msg.action && (msg.action == "click-next-button")) {
      $('button[title="Save & New"]').click()
    }
  }
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "updated data") {
      loadData();
    }
  }
);

function loadData() {
  // load in arrys of data
  chrome.storage.sync.get(fields, function (items) {
    apiNames = items[fields[0]].slice();
    questions = items[fields[1]].slice();
    requiredFields = items[fields[2]].slice();
    sortOrder = Number(items[fields[3]]);
    ready = true;
    console.log("Load Data executed");
  });
}