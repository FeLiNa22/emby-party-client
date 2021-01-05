import { Component } from "react";

/* Emoji picker */
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { SmileIcon } from './Icons';

class EmojiPicker extends Component {
  static defaultProps = {
    onSelectEmoji: (emoji) => {
      console.log(emoji);
    },
  };

  constructor(props) {
    super(props);
    this.state = { isOpened: false };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, false);
  }

  handleClickOutside = (e) => {
    if(!this.pickerRef.contains(e.target)){
      this.setState({isOpened : false});
    }
  }

  toggle = () => {
    this.setState((prevState) => ({ isOpened: !prevState.isOpened }));
  };

  render() {
    return (
      <div ref={(ref)=>{this.pickerRef = ref}} style={{display:'inline-block', position:'relative'}}>
         {this.state.isOpened && (
          <Picker
            style={{ display:"block", position:'absolute',  top: "-350px", left: "50px" }}
            showPreview={false}
            showSkinTones={false}
            emojiTooltip={true}
            onSelect={this.props.onSelectEmoji}
          />
        )}
        <button  className="Chat-button" onClick={this.toggle}>
        <SmileIcon style={{color:"#63ce50"}}/>
        </button>
      </div>
    );
  }
}

export default EmojiPicker;
