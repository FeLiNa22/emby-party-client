console.log("Hello Background");
// injection script
const script = { file: "/static/js/content.js" };

const handleBackgroundMessage = (message, sender, sendResponse) => {
  console.log(message);
  switch (message.background) {
    case "join-party":
      chrome.tabs.create({ url: message.data.url }, function (tab) {
        // injects script into new tab
        chrome.tabs.executeScript(tab.id, script, function () {
          // sends join message to new tab
          chrome.tabs.sendMessage(tab.id, {
            content: "join-party",
            data: message.data,
          });
        });
      });
      break;
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  sendResponse
) {
  if (message && message.background) {
    handleBackgroundMessage(message, sender, sendResponse);
  }
});
