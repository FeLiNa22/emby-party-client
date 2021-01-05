console.log('Hello Background');

/**
 * When extension runs on a page with the <video> tag
 */
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          // When a page contains a <video> tag...
          new chrome.declarativeContent.PageStateMatcher({
            css: ["video"]
          })
        ],
        // ... show the page action.
        actions: [new chrome.declarativeContent.ShowPageAction() ]
      }]);
    });
  });