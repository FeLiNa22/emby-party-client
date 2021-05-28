/*global chrome*/
import { Member } from "./adapters/EmbyPartyAdapter";

import ReactDOM from "react-dom";
import { VideoController } from "./controllers/VideoController";
import App from "./views/Sidebar/App";
import { HTML5VideoAdapter } from "./components/Video/HTML5VideoAdapter";
import { NetflixVideo } from "./components/Video/NetflixVideo";

if (!window.ALREADY_INJECTED_FLAG) {
  window.ALREADY_INJECTED_FLAG = true;
  const member = new Member();
  // get controllable video object depending on the site
  const video = getVideo();
  const videoController = new VideoController(member, video);
  // join party if code is passed in the url
  joinPartyIfCodePassedInUrlParameters(member, video);
  // setup chrome event listeners to handle get/join/create party events
  setupContentListeners(member, video);
}

function getVideo() {
  const url = window.location.href;
  if (url.includes("netflix")) {
    return new NetflixVideo();
  } else {
    return new HTML5VideoAdapter();
  }
}

function joinPartyIfCodePassedInUrlParameters(
  member,
  video
) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const partyId = urlParams.get("party");
  member
    .joinParty(partyId)
    .then((party) => {
      injectCSS();
      injectSidebar(member);
      video.update(party.video);
    })
    .catch((ignore) => {});
}

function injectCSS() {
  var link = document.createElement("link");
  link.href = chrome.runtime.getURL("/static/css/content.css");
  link.type = "text/css";
  link.rel = "stylesheet";

  document.getElementsByTagName("head")[0].appendChild(link);
}

function injectSidebar(member) {
  const injection = document.createElement("div");

  // injects the sidebar into the page
  document.body.appendChild(injection);

  // render component
  ReactDOM.render(<App member={member} />, injection);
}

function setupContentListeners(member, video) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // only accept messages sent from background
    if (sender.tab === undefined) {
      if (message.state === "content:join") {
        const { partyId } = message;
        member
          .joinParty(partyId)
          .then((party) => {
            sendResponse(party);
            video.update(party.video);
          })
          .then(() => {
            injectCSS();
            injectSidebar(member);
          })
          .catch((err) => sendResponse(err));
      } else if (message.state === "content:create") {
        // on creating a party check if there is a video to share on
        // the page and then inject sidebar and controller code into the page
        member
          .createParty()
          .then((party) => {
            sendResponse(party);
            member.updateVideo(party.id, video);
          })
          .then(() => {
            injectCSS();
            injectSidebar(member);
          })
          .catch((err) => sendResponse(err));
      } else if (message.state === "content:get") {
        // on getting party, check if the page has injected code,
        // and check if there is a connection there
        if (member.isInParty()) {
          sendResponse(member.getParty());
        } else {
          sendResponse({ error: "Not connected to a party" });
        }
      }
    }
    return true;
  });
}
