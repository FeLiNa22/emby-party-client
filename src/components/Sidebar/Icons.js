import { Component } from "react";

export class EmbyIcon extends Component {
  render() {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="mdi-emby"
          width="70"
          height="70"
          viewBox="0 0 24 24"
        >
            <circle r="12" cx="50%" cy="50%" fill="#2d2926"/>
          <path fill="#62c559" d="M11,2L6,7L7,8L2,13L7,18L8,17L13,22L18,17L17,16L22,11L17,6L16,7L11,2M10,8.5L16,12L10,15.5V8.5Z" />
        </svg>
      </>
    );
  }
}
