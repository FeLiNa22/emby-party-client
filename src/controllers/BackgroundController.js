"use-strict";
// injection code (determines if page has shareable video)
const isShareable = {
  code: 'document.getElementsByTagName("VIDEO").length > 0;',
};

// injection script
const script = { file: "content.js" };
export class BackgroundController {
  handleJoiningParty = (message, sender, sendResponse) => {
    const { partyId } = message;

    // get extension url to video.html file
    const url = chrome.runtime.getURL("video.html") + "?party=" + partyId;

    // create new tab for video.html
    chrome.tabs
      .create({ url })
      .catch((err) => sendResponse({ error: "Failed to create new tab" }));
  };

  handleCreatingParty = (message, sender, sendResponse) => {
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs) => {
        // execute the code in the active tab
        return chrome.tabs
          .executeScript(tabs[0].id, isShareable)
          .then((resp) => {
            // check if the code injected could find a video
            if (resp[0] === true) {
              return chrome.tabs.executeScript(tabs[0].id, script).then(() => {
                // sends a message to content script
                // this will in turn create a party
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  {
                    state: "content:create",
                  },
                  (party) => {
                    if (chrome.runtime.lastError || !party) {
                      sendResponse({
                        error: "Failed to send message to content script",
                      });
                    } else {
                      sendResponse(party);
                    }
                  }
                );
              });
            } else {
              sendResponse({
                error: "Could not find a video to share on this page :(",
              });
            }
          });
      })
      .catch((err) => {
        sendResponse({ error: "Failed to access current tab" });
      });
  };

  handleGettingParty = (message, sender, sendResponse) => {
    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) =>
        // sends a message to content script
        // this will in turn create a party
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            state: "content:get",
          },
          (party) => {
            if (chrome.runtime.lastError || !party) {
              sendResponse({
                error: "Failed to send message to content script",
              });
            } else {
              sendResponse(party);
            }
          }
        )
      )
      .catch((err) => {
        sendResponse({ error: "Failed to access current tab" });
      });
  };
}
