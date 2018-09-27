import React from 'react';
import { Howl } from 'howler';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    this.initPlayer()
  }
  componentDidUpdate() {
    this.initPlayer()
  }
  componentWillUnmount() {
    this.unbindPlayer();
  }
  initPlayer() {
    this.sound = new Howl({
      src: [this.props.src]
    })
  }
  unbindPlayer() {
    if (this.sound) {
      this.sound.off()
      this.sound.stop()
      this.sound.unload()
      this.sound = null
    }
  }
  playAudio() {
    this.sound.play()
  }
  pauseAudio() {
    this.sound.pause()
  }
  stopAudio() {
    this.sound.stop()
  }
  render() {
    return (
      <div className="audio-player">
        <div 
            className="audio-controls pause"
            onClick={(e) => this.pauseAudio()}>
          Pause
        </div>
        <div 
            className="audio-controls play"
            onClick={(e) => this.playAudio()}>
          Play
        </div>
      </div>
    )
  }
}

export default AudioPlayer;