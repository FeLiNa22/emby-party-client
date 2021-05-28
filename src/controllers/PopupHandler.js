"use-strict";

import { Member } from "../adapters/EmbyPartyAdapter";

export class PopupHandler {
  member = new Member();
  joinParty = (partyId, callback) => {
    // first checks if the party even exists
    this.member
      .existsParty(partyId)
      .then((exists) => {
        if (exists === false) {
          callback({ error: "Party doesn't exist", code: 100 });
        } else {
          // sends a message to background script
          // this will in turn open a new tab and execute the script in it
          chrome.runtime.sendMessage(
            null,
            {
              state: "popup:join",
              partyId,
            },
            (party) => {
              if (!chrome.runtime.lastError && party) {
                callback(party);
              }
            }
          );
        }
      })
      .catch((err) => callback(err));
  };

  createParty = (callback) => {
    // sends a message to background script
    // this will in inject code into the current page
    chrome.runtime.sendMessage(null, { state: "popup:create" }, (party) => {
      if (!chrome.runtime.lastError && party) {
        callback(party);
      }
    });
  };

  getParty = (callback) => {
    // sends a message to background script
    // this will then query current page to determine if a
    // connection is already established
    chrome.runtime.sendMessage(null, { state: "popup:get" }, (party) => {
      if (!chrome.runtime.lastError && party) {
        callback(party);
      }
    });
  };
}
