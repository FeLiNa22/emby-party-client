/*global chrome*/

import { Component } from "react";
import ReactDOM from 'react-dom';


class Main extends Component {
  render() {
      return (
          <iframe src={chrome.runtime.getURL("/sidebar.html")}> 
          </iframe>
      )
  }
}

const app = document.createElement('div');
app.id = "emby-party-wrapper";
document.body.appendChild(app);

ReactDOM.render(<Main />, app);


