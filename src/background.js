import { BackgroundController } from "./controllers/BackgroundController";
import { UserDataController } from "./controllers/UserDataController";

// controller holds handler functions
const backgroundController = new BackgroundController();
const userDataController = new UserDataController();

setupBackgroundListeners();


function setupBackgroundListeners() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // only accept messages sent from popup
    if (sender.tab === undefined) {
      if (message.state === "popup:join") {
        // on joining a party create a new tab and join the party there
        backgroundController.handleJoiningParty(message, sender, sendResponse);
      } else if (message.state === "popup:create") {
        // on creating a party check if there is a video to share on
        // the page and then inject sidebar and controller code into the page
        backgroundController.handleCreatingParty(message, sender, sendResponse);
      } else if (message.state === "popup:get") {
        // on getting party, check if the page has injected code,
        // and check if there is a connection there
        backgroundController.handleGettingParty(message, sender, sendResponse);
      }
    }
    return true;
  });
}

