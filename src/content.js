/*global chrome*/

import { Component } from "react";
import ReactDOM from 'react-dom';

import Frame, { FrameContextConsumer }from 'react-frame-component';
import App from './views/Sidebar/App';

class Main extends Component {
  render() {
      return (
          <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}> 
             <FrameContextConsumer>
             {
                ({document, window}) => {
                  return <App document={document} window={window}/> 
                }
              }
              </FrameContextConsumer>
          </Frame>
      )
  }
}

const app = document.createElement('div');
app.id = "emby-party-wrapper";
document.body.appendChild(app);

ReactDOM.render(<Main />, app);


