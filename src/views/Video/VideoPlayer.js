import {Component} from 'react';

import './VideoPlayer.css'

class VideoPlayer extends Component{
    render(){
        return (
        <div className="VideoWrapper">
            <video controls={true} className="htmlvideoplayer">
            </video>
        </div>
        );
    }
}

export default VideoPlayer;