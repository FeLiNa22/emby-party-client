import {Component} from 'react';

import './VideoPlayer.css'

class VideoPlayer extends Component{
    state = {
        src : null
    }

    componentDidMount(){
        this.registerChromeEventListeners();
    }

    registerChromeEventListeners = () => {
        const self = this; // to deal with scoping issues
        // register chrome event listener to deal with messages from the popup
        chrome.runtime.onMessage.addListener(function (
          message,
          sender,
          sendResponse
        ) {
          console.log(message);
          if (message && message.content) {
            switch (message.content) {
              
              case "join-party":
                // try and join the party
                self.setState({src : message.data.url});
                break;
              default:
                break;
            }
          }
        });
      };

    render(){
        return (
        <div className="VideoWrapper">
            <video controls={true} className="htmlvideoplayer" src={this.state.src}>
            </video>
        </div>
        );
    }
}

export default VideoPlayer;