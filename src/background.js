console.log("Hello Background");

// injection script
const script = { file: "/static/js/content.js" };

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  switch (message.background) {
    case "join-party":
      chrome.tabs.update(
        { url: chrome.runtime.getURL("video.html") },
        function (tab) {
          chrome.tabs.onUpdated.addListener(function listener(
            tabId,
            changeInfo
          ) {
            if (tabId === tab.id && changeInfo.status == "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              // Now the tab is ready!
              
              // send the partyId to the sidebar
              chrome.tabs.sendMessage(tab.id, {
                content: "join-party",
                data: message.data,
              });
            }
          });
        }
      );
      break;
    default:
      break;
  }
});
