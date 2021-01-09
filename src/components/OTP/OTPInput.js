import React, { Component } from "react";
import "./OTP.css";

class OTPInput extends Component {
  static defaultProps = {
    submitButton : null,
    focus: true,
    activeInput: 0,
    numInputs: 0,
    onChange: (OTP) => {
      console.log("onChange " + OTP);
    },
    onSubmit: (OTP) => {
      console.log("onSubmit " + OTP);
    },
  };

  constructor(props) {
    super(props);

    // refs to all input boxes
    this.inputRefs = new Array(this.props.numInputs);
    // holds index of focused Input box
    this.activeInput = this.props.activeInput;

    this.state = {
      OTPvalues: new Array(this.props.numInputs).fill(""),
    };
  }

  componentDidMount() {
    if (this.props.focus) {
      this.inputRefs[this.activeInput].focus();
    }
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
        if (this.getOtpValue(this.activeInput) !== "") {
          this.setOtpValue(this.activeInput, "");
        }
        this.focusPrev();
        break;
      case "Enter":
        event.preventDefault();
        this.triggerOnSubmitHandler();
        break;
      default:
        break;
    }
  };

  getOTP = () => {
    return this.state.OTPvalues.join("");
  };

  triggerOnSubmitHandler = () => {
    this.props.onSubmit(this.getOTP());
  };

  triggerOnChangeHandler = () => {
    return this.props.onChange(this.getOTP());
  };

  getOtpValue = (idx) => {
    return this.state.OTPvalues[idx];
  };

  setOtpValue = (idx, val) => {
    this.setState((prevState) => {
      const newValues = [...prevState.OTPvalues];
      newValues[idx] = val.toUpperCase();
      return { OTPvalues: newValues };
    });
    // run callback function whenever edit is made to the OTPvalues
    this.triggerOnChangeHandler();
  };

  focusPrev = () => {
    // set activeInput to prev box
    this.activeInput = Math.max(this.activeInput - 1, 0);
    this.inputRefs[this.activeInput].focus();
  };

  focusNext = () => {
    this.activeInput = Math.max(
      Math.min(this.activeInput + 1, this.props.numInputs - 1)
    );
    this.inputRefs[this.activeInput].focus();
  };

  render() {
    return (
      <>
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
                this.activeInput = idx;
                e.target.select();
              }}
              onInput={(e) => {
                this.setOtpValue(idx, e.target.value);
                this.focusNext();
              }}
              onPaste={(e) => {
                var pasteData = e.clipboardData.getData("Text");
                for (
                  let i = 0;
                  i < Math.min(this.props.numInputs, pasteData.length);
                  i++
                ) {
                  this.setOtpValue(i, pasteData[i]);
                  this.activeInput = i;
                }
              }}
              className="Otp-input"
              maxLength="1"
              onKeyDown={this.handleKeyDown}
            />
          );
        })}
      </div>
      {React.isValidElement(this.props.submitButton) && React.cloneElement(this.props.submitButton, {onClick : this.triggerOnSubmitHandler})}
      </>
    );
  }
}

export default OTPInput;
