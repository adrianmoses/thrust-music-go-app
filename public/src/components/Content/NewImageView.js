import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../../actions';

import Button from '../../lib/Button';
import Input from '../../lib/Input';
import TextArea from '../../lib/TextArea';

const styles = {
  icon: {
    color: "#EEF2F5"
  },
  toolbar: {
    paddingRight: 30,
    paddingLeft: 30,
  },
  uploadBox: {
    border: "1px #EEF2F5 solid",
    borderRadius: "5px",
    display: "inline-block",
    height: "150px",
    width: "100%",
    textAlign: "center",
    padding: "70px",
    marginTop: "30px",
    color: "#EEF2F5",
    cursor: "pointer"
  },
  dropzone: {
    border: "none",
    height: "150px",
    width: "100%",
  },
};

class NewImageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            releaseTitle: "Untitled",
            imageFile: null,
            audioFile: null,
            renderVideo: false,
            trackTitle: "Untitled Track",
            description: "",
            imageUploading: null,
            audioUploading: null,
        }
    }
    onImageDrop(acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      acceptedFiles.forEach((file, idx) => {
        this.uploadImage(file);
        if (idx === 0) 
          this.setState({ imageUploading: acceptedFiles[0] });
      });
    }
    onAudioDrop(acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      acceptedFiles.forEach((file, idx) => {
        this.uploadAudio(file);
        if (idx === 0)
            this.setState({ audioUploading: acceptedFiles[0] });
      });
    }
    uploadImage(file) {
        const token = localStorage.getItem('token');
        var data = new FormData();
        data.append('type', 'file');
        data.append('file', file);
        fetch('api/upload_image', {
            method: 'post',
            headers: {
                'Authorization': token
            },
            body: data
        }).then(res => {
            console.log('successful image upload')
            return res.json()
        }).then(data => {
            this.setState({
                imageFile: data.image_path,
                imageUploading: false
            })
        });
    }
    uploadAudio(file) {
        const token = localStorage.getItem('token');
        var data = new FormData();
        data.append('type', 'file');
        data.append('file', file);
        fetch('api/upload_audio', {
            method: 'post',
            headers: {
                'Authorization': token
            },
            body: data
        }).then(res => {
            console.log('successful image upload')
            // will need the env/unstaged/file
            return res.json();
        }).then(data => {
            this.setState({
                audioFile: data.audio_path,
                audioUploading: false
            })
        });
    }
    updateRenderVideo(e){
        this.setState({
            renderVideo: !this.state.renderVideo
        })
    }
    saveTrack(e) {
        // send request to save data
        // then close modal
        e.preventDefault();

        const token  = this.getToken();
        const currentState = this.state;
        const trackTitle = this.trackTitle.value;
        const description = this.description.value;

        fetch('api/save_track', {
            method: 'post',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                release_title: currentState.releaseTitle,
                track_title: trackTitle,
                description: description,
                image_path: currentState.imageFile,
                audio_path: currentState.audioFile,
                render_video: currentState.renderVideo
            })
        }).then(res => {
            if (res.status === 200) {
                console.log('successful save');
            }
            this.props.closeModel();
        });
    }
    getToken() {
        return localStorage.getItem('token');
    }
    render() {
        const token  = this.getToken();
        const uploadUrl = `/api/upload`
        return (
            <div>
                <div>
                    <form>
                        <div style={{height: "200px"}} 
                            >
                            <Dropzone 
                                ref="imageDropzone"
                                accept="image/*"
                                style={styles.dropzone}
                                onDrop={this.onImageDrop.bind(this)} >
                                <div 
                                    style={styles.uploadBox}
                                    className="upload-image floatLeft"
                                >
                                    <i 
                                        name="image">
                                    </i>
                                    <br/>
                                    Choose Image
                                    {this.state.imageUploading ? 
                                        <div>
                                           Uploading Image... 
                                           <img src={this.state.imageUploading.preview} />
                                        </div>
                                    : null}
                                </div>
                            </Dropzone>
                        </div>
                    </form>
                    {/*<div style={{"marginTop": 30, "marginBottom": 30}}>
                        <input 
                            type="checkbox"
                            style={{
                                float: "left",
                            }}
                            onClick={this.updateRenderVideo.bind(this)}
                            defaultChecked={this.state.renderVideo}
                            label="Create Static Video" />
                    </div>*/}
                    <div>
                        <Button 
                            style={{marginLeft: "15px"}}
                            floatRight
                            onClick={(e) => this.saveTrack(e)}
                            positive> 
                            Save
                        </Button>
                        <Button 
                            style={{marginLeft: "15px"}}
                            onClick={(e) => this.props.closeModal(e)}
                            floatRight
                            >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    } 
}

export default NewImageView;