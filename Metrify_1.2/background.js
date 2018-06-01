// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

  console.log("Running content script");
  
    chrome.tabs.executeScript(null, {file :"content.js"});
});
