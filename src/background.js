import { io } from "socket.io-client";
console.log("Hello Background");

const socket_url = "ws://localhost:4000";

const socket_options = {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
  withCredentials: false,
};

const socket = io(socket_url, socket_options);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   switch (message) {
     case "create":
       socket.emit("create party");
       break;
     case "join":
   }
 });

chrome.runtime.onMessage.addListener(function (message, sender, resposendResponsense) {
  switch (message) {
    case "create":
      // create party
      socket.emit("create party");
      break;
    case "join":
  }
});
