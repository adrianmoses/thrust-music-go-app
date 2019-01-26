import React, { Component } from 'react';

import Tabs from './components/Tabs';
import './styles/index.css';

// // components
// import Sidebar from '../../components/pages/Sidebar';
// import Header from '../../components/pages/Header';
// import Content from '../../components/pages/Content';

// // templates
// import NoTemplate from '../../components/pages/templates/NoTemplate';
// import EmailForDownload from '../../components/pages/templates/EmailForDownload';
// import PhoneForDownload from '../../components/pages/templates/PhoneForDownload';
// import AudioEmbed from '../../components/pages/templates/AudioEmbed';
// import VideoEmbed from '../../components/pages/templates/VideoEmbed';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoSavedTime: '',
      backgroundImage: null,
      // templateComponent: EmailForDownload 
    }
  }
  componentDidMount() {
    let hash_id;
    if (this.props.location.pathname === '/edit') {
      hash_id = localStorage.getItem('pageHashId');
      if (!hash_id) {
        hash_id = this.alphanumericUnique();
        localStorage.setItem('pageHashId', hash_id);
      }
      this.props.history.push(`/edit/${hash_id}`)
    }
  }
  componentDidUpdate() {

  }
  alphanumericUnique() {
    return Math.random().toString(36).split('').filter( function(value, index, self) { 
        return self.indexOf(value) === index;
    }).join('').substr(2,8);
  }
  setBackground(imageFile){
    console.log("image file", imageFile);
    //TODO: set background image ??? 
    if (imageFile && this.state.backgroundImage !== imageFile) {
      this.setState((state, props) => {
        return {backgroundImage: imageFile}
      })
    }
  }
  render() {
    return (
      <div className="page-container">
        <div className="sidebar">
          <Tabs>
            <div label="Info">
              <input name="artist-name" className="info-input" placeholder="Artist Name" />
              <br/>
              <input name="release-title" className="info-input" placeholder="Release Title" />
            </div>
            <div label="Cover Art">
              <div className="upload-btn-container">
                <div className="upload-btn-wrapper">
                  <button className="upload-btn">Add Your Cover Art</button>
                  <input type="file" id="cover-art"/>
                </div>
              </div>
            </div>
            <div label="Music Links">
              <label for="store-select" className="store-select-label">Choose Store:</label>
              <select className="store-select" id="store-select">
                <option value="spotify">Spotify</option>
                <option value="apple-music">Apple Music</option>
                <option value="itunes">iTunes</option>
                <option value="deezer">Deezer</option>
                <option value="tidal">Tidal</option>
                <option value="soundcloud">Soundcloud</option>
                <option value="bandcamp">Bandcamp</option>
              </select>
              <input name="add-link" className="add-music-link" placeholder="Add Music Link" />
              <button className="add-btn">Add Link</button>
            </div>
          </Tabs>
        </div>
        <div className="main">
          <div className="promo-box">
            <div className="cover-art">
              cover art
            </div>
            <div className="metadata-section">
              <div className="metadata-info">
                Move On By Mars Moses
              </div>
              <div className="metadata-links">
                Play On Spotify
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
