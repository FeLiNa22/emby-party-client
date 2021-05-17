import React, { Component } from "react";
import "./OTP.css";

class OTPOutput extends Component {
  static defaultProps = {
    focus: true,
    output : "",
    numOutputs: 0,
    submitButton : null,
    onSubmit : (output) => console.log(output)
  };

  constructor(props) {
    super(props);

    this.OTPvalues =  new Array(this.props.numOutputs).fill("");
    for (
        let i = 0;
        i < Math.min(this.props.numOutputs, this.props.output.length);
        i++
      ) {
        this.OTPvalues[i] = this.props.output[i].toUpperCase();
      }
  }

  getOTP = () => {
    return this.OTPvalues.join("");
  };

  triggerOnSubmitHandler = () => {
    this.props.onSubmit(this.getOTP());
  };

  render() {
    return (
      <>
      <div style={{...this.props.style}} className="Otp-container">
        {this.OTPvalues.map((val, idx) => {
          return (
            <input
              readOnly={true}
              key={idx}
              value={val}
              className="Otp-input"
              maxLength="1"
            />
          );
        })}
      </div>
      {React.isValidElement(this.props.submitButton) && React.cloneElement(this.props.submitButton, {onClick : this.triggerOnSubmitHandler})}
      </>
    );
  }
}

export default OTPOutput;
