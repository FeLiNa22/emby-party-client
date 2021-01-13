/*global chrome*/

import ReactDOM from "react-dom";

import App from "./views/Sidebar/App"
function injectCSS(){
  var link = document.createElement("link");
  link.href = chrome.runtime.getURL('/static/css/content.css');
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function injectSidebar() {
  const injection = document.createElement("div");
  // injects the sidebar into the page
  document.body.appendChild(injection);
  // render component
  ReactDOM.render(<App />, injection);
};

injectCSS();
injectSidebar();
