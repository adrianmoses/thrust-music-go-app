import React, { Component } from 'react';
import { Tabs, Layout, Input, Icon } from 'antd';
import TemplateItem from './TemplateItem';
import Button from '../../lib/Button';
import AudioPlayer from '../../lib/AudioPlayer';
const { Sider } = Layout;
const TabPane = Tabs.TabPane;


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFiles: [],
      audioFiles: [],
      videoFiles: [],
      imageUploading: false,
      audioUploading: false,
      videoUploading: false
    }

  }
  tabCallback(key) { 
    console.log(key);
  }
  onImageFile(files) {
      const token = localStorage.getItem('token');
      let data = new FormData();
      data.append('type', 'file');
      data.append('file', files[0]);
      fetch('/api/content/upload_image', {
          method: 'post',
          headers: {
              'Authorization': token
          },
          body: data
      }).then(res => {
          console.log('successful image upload')
          return res.json()
      }).then(data => {
          let imageFiles = this.state.imageFiles
          let fullUrl = `https://storage.googleapis.com/thrust-media/${data.image_path}`
          imageFiles.push(fullUrl)
          this.setState({
              imageFiles: imageFiles,
              imageUploading: false
          })
      });
  }
  onAudioFile(files) {
      const token = localStorage.getItem('token');
      let data = new FormData();
      data.append('type', 'file');
      data.append('file', files[0]);
      fetch('/api/content/upload_audio', {
          method: 'post',
          headers: {
              'Authorization': token
          },
          body: data
      }).then(res => {
          console.log('successful audio upload')
          return res.json()
      }).then(data => {
          let audioFiles = this.state.audioFiles
          let fullUrl = `https://storage.googleapis.com/thrust-media/${data.audio_path}`
          audioFiles.push(fullUrl)
          this.setState((state, props) => {
            return {
              audioFiles: audioFiles,
              audioUploading: false
            }
          })
      });
  }
  onVideoFile(files) {
      const token = localStorage.getItem('token');
      let data = new FormData();
      data.append('type', 'file');
      data.append('file', files[0]);
      fetch('/api/content/upload_video', {
          method: 'post',
          headers: {
              'Authorization': token
          },
          body: data
      }).then(res => {
          console.log('successful video upload')
          return res.json()
      }).then(data => {
          let videoFiles = this.state.videoFiles
          videoFiles.push(data.video_path)
          this.setState((state, props) => {
            return {
              videoFiles: videoFiles,
              videoUploading: false
            }
          })
      });
  }
  render() {
    return (
        <Sider 
            width={400}
            className="sidebar">
            <h3 style={{color:"#FDFFFC"}}>1. Title & Artist</h3>
            <Input className="sidebar-input title" placeholder="Enter Title" />
            <Input className="sidebar-input artist-name-input" placeholder="Enter Artist Name" />
            <Tabs defaultActiveKey="artwork" onChange={this.tabCallback}>
                <TabPane className="nav-item" tab="2. Artwork" key="artwork">
                    <div className="upload-section">
                        <div className="upload-image-section">
                            Images
                            <label for="image-file" className="image-file-label">
                                 Upload Image
                                <input 
                                    type="file" 
                                    id="image-file" 
                                    onChange={(e) => this.onImageFile(e.target.files)}
                                    className="image-file" />
                            </label>
                            <ul className="image-file-list">
                              {this.state.imageFiles.map((imageFile, idx) => {
                                return (
                                  <li key={idx}>
                                    <a onClick={this.props.setBackground.bind(null, imageFile)}>
                                      <img className="pages-img-upload-thumbnail" src={imageFile}>
                                      </img>
                                    </a>
                                  </li>
                                )
                              })}
                            </ul>
                        </div>
                    </div>
                </TabPane>
                <TabPane className="nav-item" tab="3. Theme" key="theme">
                    <div className="template-list-section">
                        <ul className="template-list">
                            <TemplateItem 
                                iconElem={<Icon type="mail" />}
                                text={"Email For Download"} />
                            <TemplateItem 
                                iconElem={<Icon type="video-camera" />}
                                text={"Video Embed"} />
                            <TemplateItem 
                                iconElem={<Icon type="play-circle-o" />}
                                text={"Audio Embed"} />
                            <TemplateItem 
                                iconElem={<Icon type="phone" />}
                                text={"Phone Number For Download"} />
                        </ul>
                    </div>
                </TabPane>
                <TabPane className="nav-item" tab="4. Music" key="music">
                    <div className="upload-section">
                        <div className="upload-audio-section">
                            Audio
                            <label for="audio-file" className="audio-file-label">
                                 Upload Audio
                                <input 
                                    type="file" 
                                    id="audio-file" 
                                    onChange={(e) => this.onAudioFile(e.target.files)}
                                    className="audio-file" />
                            </label>
                            <ul className="audio-file-list">
                              {this.state.audioFiles.map((audioFile) => {
                                return (
                                  <li>
                                    <AudioPlayer
                                      src={audioFile}
                                      />
                                  </li>
                                )
                              })}
                            </ul>
                        </div>

                        <div className="upload-video-section">
                            Video
                            <label for="video-file" className="video-file-label">
                                 Upload Video
                                <input 
                                    type="file" 
                                    id="video-file" 
                                    onChange={(e) => this.onVideoFile(e.target.files)}
                                    className="video-file" />
                            </label>
                            <ul className="video-file-list">
                              {this.state.videoFiles.map((videoFile) => {
                                return (
                                  <li>
                                    <a>{videoFile}</a>
                                  </li>
                                )
                              })}
                            </ul>
                        </div>

                        <div classnam="add-link-section">
                          Links
                          <div>Spotify</div>
                          <div>Soundcloud</div>
                          <div>YouTube</div>
                        </div>
                      </div>
                </TabPane>
             </Tabs>
             <hr className="sidebar-hr"/>
             <div className="page-footer">
                Thrust
             </div>
        </Sider>
    )
  }
}

export default Sidebar;
