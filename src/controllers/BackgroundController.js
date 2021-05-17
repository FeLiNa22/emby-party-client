"use-strict";

import { Member } from "../adapters/EmbyPartyAdapter";

export class BackgroundController {
  handleJoiningParty = (message, sender, sendResponse) => {
    const { partyId } = message;

    // code to determine if new tab was able to join party
    const code = {
      code: `member.getParty(${partyId});`,
    };

    // get extension url to video.html file
    const url = chrome.runtime.getURL("video.html") + "?party=" + partyId;

    //create new tab and inject with code
    chrome.tabs
      .create({ url })
      .catch(() => sendResponse({ error: "Party doesn't exist" }))
      .then((tab) => chrome.tabs.executeScript(tab.id, code))
      .then((resp) => sendResponse(resp[0]))
      .catch(() => sendResponse({ error: "Failed to join party" }));
  };

  handleCreatingParty = (message, sender, sendResponse) => {
    // injection code (determines if page has shareable video)
    const code = {
      code: 'document.getElementsByTagName("VIDEO").length > 0;',
    };

    // injection script
    const script = { file: "content.js" };

    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs) => {
        // execute the code in the active tab
        return chrome.tabs.executeScript(tabs[0].id, code).then((resp) => {
          // check if the code injected could find a video
          if (resp[0] === true) {
            // inject content script into the page
            return chrome.tabs.executeScript(tabs[0].id, script);
          } else {
            throw new Error();
          }
        });
      })
      .then((resp) => {
        sendResponse(resp[0]); //resp[0] should be the party data
      })
      .catch(() => {
        sendResponse({
          error: "Could not find a video to share on this page :(",
        });
      });
  };

  handleGettingParty = (message, sender, sendResponse) => {
    // code to determine if active page is connected to a party
    const code = {
      code: "member.getParty();",
    };

    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        // execute the code in the active tab
        return chrome.tabs.executeScript(tabs[0].id, code);
      })
      .then((resp) => {
        sendResponse(resp[0]); //resp[0] should be the party data
      })
      .catch(() => {
        sendResponse({ error: "Party doesn't exist" });
      });
  };
}
