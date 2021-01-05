
import {Component} from 'react';
import ChatApp from "../../components/Chat/ChatApp";

import './App.css';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = { isVisible: true, messages : [] };
    }

    onRecieveMessage = (text) => {
        // recieve a message through the chat (through backend)
        console.log("message recieved " + text);
    }

    onSendMessage = (text) => {
        // sends a message through the chat (through backend)
        console.log("message sent " + text);
    };

    toggleCollapse = () => {
        this.setState((prevState) => ({ isVisible: !prevState.isVisible }));
    };

    render() {
        return (
            <div className="App">
                <button className="Sidebar-toggle" onClick={this.toggleCollapse}>
                    {this.state.isVisible ? "Hide" : "Show"}
                </button>
                <div className="Sidebar">
                    <ChatApp messages={this.state.messages} onSendMessage={this.onSendMessage}/>
                    {/* <Avatar /> */}
                    {/* <Playback /> */}
                </div>
            </div>
        );
    }
}


export default App;
