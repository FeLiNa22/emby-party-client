import { Component } from "react";
import "./OTP.css";

class OTPInput extends Component {
  constructor(props) {
    super(props);

    const { numInputs, onChange } = props;

    this.onChange = onChange;

    this.numInputs = numInputs;
    if (this.numInputs <= 0) {
      throw new Error("number of input boxes must be greater than 0");
    }
    // refs to all input boxes
    this.inputRefs = new Array(this.numInputs);
    this.index = 0;

    this.state = {
      OTPvalues: new Array(this.numInputs).fill(""),
    };
  }

  componentDidMount(){
    this.inputRefs[this.index].focus();
  }

  handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this.focusNext();
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.focusPrev();
        break;
      case "Backspace":
        event.preventDefault();
        if (this.getOtpValue(this.index) !== "") {
          this.setOtpValue(this.index, "");
        }
        this.focusPrev();
        break;
      default:
        break;
    }
  };

  getOTP = () => {
    return this.props.onChange(this.state.OTPvalues.join(""));
  };

  getOtpValue = (idx) => {
    return this.state.OTPvalues[idx];
  }

  setOtpValue = (idx, val) => {
    this.setState((prevState) => {
      const newValues = [...prevState.OTPvalues];
      newValues[idx] = val.toUpperCase();
      return { OTPvalues: newValues };
    });
    // run callback function whenever edit is made to the OTPvalues
    this.getOTP();
  };

  focusPrev = () => {
    // set index to prev box
    this.index = Math.max(this.index - 1, 0);
    this.inputRefs[this.index].focus();
  };

  focusNext = () => {
    this.index = Math.max(Math.min(this.index + 1, this.numInputs - 1));
    this.inputRefs[this.index].focus();
  };

  render() {
    return (
      <div className="Otp-container">
        {this.state.OTPvalues.map((val, idx) => {
          return (
            <input
              key={idx}
              value={val}
              ref={(ref) => {
                this.inputRefs[idx] = ref;
              }}
              onFocus={(e) => {
                this.index = idx;
                e.target.select();
              }}
              onInput={(e) => {
                this.setOtpValue(idx, e.target.value);
                this.focusNext();
              }}
              onPaste={(e) => {
                var pasteData = e.clipboardData.getData('Text');
                for (let i = 0; i < Math.min(this.numInputs, pasteData.length); i++) {
                  this.setOtpValue(i, pasteData[i]);
                  this.index = i;
                }
              }}
              className="Otp-input"
              maxLength="1"
              onKeyDown={this.handleKeyDown}
            />
          );
        })}
      </div>
    );
  }
}

export default OTPInput;
