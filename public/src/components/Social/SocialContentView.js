import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LocaleProvider, Menu, Dropdown, Icon, DatePicker } from 'antd';
import Input from '../../lib/Input';
import Button from '../../lib/Button';
import TextArea from '../../lib/TextArea';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import locales from 'antd/lib/locale-provider/en_US';

var styles = {
    float: 'left'
}


class SocialContentView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            twitterCount: 140,
            schedule: false,
            title: '',
            content: '',
            videoFile: '',
            imageFile: '',
        }
    }

    fileBaseName(filename) {
      return filename.split(/[\\/]/).pop();
    }
    toTitleCase(str) {
        return str.split(' ').map(i =>
            i[0].toUpperCase() + i.substring(1).toLowerCase()
        ).join(' ');
    }
    uploadImage(file) {
        const token = localStorage.getItem('token');
        let data = new FormData();
        data.append('type', 'file');
        data.append('file', file);
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
            this.setState({
                imageFile: data.image_path,
                imageUploading: false
            })
        });
    }
    uploadVideo(file) {
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
            this.setState((state, props) => {
              return {
                videoFile: data.video_path,
                videoUploading: false
              }
            })
        });
    }
    uploadFile(file) {
      console.log(file.type)
      if (file.type.startsWith('image/')) {
        // TODO upload image
        this.uploadImage(file);
      } else if (file.type.startsWith('video/')) {
        // TODO upload video
        this.uploadVideo(file)
      } else {
        console.error("No Support For File Type: " + file.type);
      }
    }

    onFileDrop(acceptedFiles, rejectedFiles) {
      acceptedFiles.forEach((file, idx) => {
        this.uploadFile(file);
      });
    }
    onDateSetChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    }

    onDateSetOk(value) {
      console.log('onOk: ', value);
      // set date
      // set schedule to false
      // queue message
    }
    handleMenuClick(e) {
      console.log('click', e);
      // e.nativeEvent.preventDefault();
      const selectedItem = e.item.props.children;
      if (selectedItem === 'Schedule') {
        this.setState((state, props) => {
            return {schedule: true}
        })
      } else if (selectedItem === 'Send Now') {
        this.submit();
      }
    }
    handleInputChange(e){
      let title = e.nativeEvent.target.value || "";
      this.setState((state, props) => {
        return {
          title: title,
        }
      });
    }
    handleTextAreaChange(e){
      let content = e.nativeEvent.target.value || "";
      this.setState((state, props) => {
        return {
          content: content,
        }
      });
    }
    handleKeyPress(e) {
      var newLength = 140 - e.target.value.length;
      styles.color = newLength >= 0 ? 'green' : 'red';
      this.setState((state, props) => {
        return {
          twitterCount: newLength
        }
      });
    }
    submit() {
      let data = {}
      data.social_id = this.props.socialID
      data.provider = this.props.socialName
      if (this.props.socialName === 'youtube') {
        data.title = this.state.title
        data.message = this.state.content
        data.video_url = this.state.videoFile
      } else {
        data.message = this.state.content
        if (this.state.videoFile || this.state.imageFile) {
          if (this.state.videoFile) {
            data.video_url = this.state.videoFile
          } else {
            data.image_url = this.state.imageFile
          }
        }
      }

      const token = localStorage.getItem('token')
      fetch('/api/social/send', {
          method: 'post',
          headers: {
              'Authorization': token
          },
          body: JSON.stringify(data)
      }).then(res => {
          return res.json()
      }).then(data => {
          // TODO clear data
          this.setState((state, props) => {
            return {videoFile: '', imageFile: ''}
          })
      })
    }
    openVideoModal(e) {
        e.preventDefault()
        this.setState((state, props) => {
            return {videoModalOpen: true}
        })
    }
    closeVideoModal() {
        this.setState((state, props) => {
            return {videoModalOpen: false}
        });
    }
    render() {
        const menu = (
          <Menu 
                style={{width: "120px"}}
                onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1">Send Now</Menu.Item>
            <Menu.Item key="2">
                Schedule
            </Menu.Item>
          </Menu>
        );
        return (
            <div className={this.props.isActiveView ? null : 'hide' }>
                <div>
                    <form>
                        {
                          this.props.socialName === 'youtube' && 
                          (
                              <div style={{marginBottom: "15px"}}>
                                <Input 
                                  placeholder="Title"
                                  value={this.state.title}
                                  onChange={this.handleInputChange.bind(this)}
                                  />
                              </div>
                          )
                        }
                        <div>
                          <TextArea 
                              placeholder="Message Content"
                              onKeyPress={this.handleKeyPress.bind(this)}
                              onChange={this.handleTextAreaChange.bind(this)}
                              value={this.state.content}
                          />
                        </div>
                        <br/>
                        {this.state.videoFile ? this.fileBaseName(this.state.videoFile) : null}
                        {this.state.imageFile ? this.fileBaseName(this.state.imageFile) : null}
                        {this.props.socialName === "youtube" && !this.state.videoFile && !this.state.imageFile &&
                            (
                              <Dropzone 
                                  ref="dropzone"
                                  className="dropzone"
                                  accept="video/mp4,image/*"
                                  onDrop={this.onFileDrop.bind(this)} 
                                  style={{
                                      float: 'left',
                                    }}>
                                    <div style={{
                                        display: "inline-block",
                                        cursor: 'pointer'
                                      }}>
                                        <i 
                                          className="bfi photo-icon"
                                          style={{
                                            fontSize: "20px",
                                            marginRight: "8px"
                                          }}
                                        ></i>
                                        Upload Image Or Video
                                    </div>
                              </Dropzone>
                            )
                        }
                        <Dropdown 
                            overlay={menu}>
                            <Button
                                className={"button positive " + this.props.socialName}
                                style={{
                                  float: 'right',
                                  marginLeft: '15px'
                                }}>
                                {"Send to " + this.props.socialName}
                                <i className="bfi down-arrow"></i>
                            </Button>
                        </Dropdown>
                        {
                            this.props.socialName === 'twitter' && (
                                <span style={{float: 'right', marginTop: '5px'}}>
                                    {this.state.twitterCount}
                                </span>
                            ) 
                        }
                        <br/>
                        <LocaleProvider locale={locales}>
                            <DatePicker
                              style={{float: "right", visibility: "hidden"}}
                              defaultValue={moment()}
                              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                              open={this.state.schedule}
                              format="MM-DD-YYYY HH:mm:ss"
                              placeholder="Select Time"
                              onChange={this.onDateSetChange.bind(this)}
                              onOk={this.onDateSetOk.bind(this)}
                            />
                        </LocaleProvider>

                    </form>
                </div>
            </div>
        );
    }
}

export default SocialContentView;