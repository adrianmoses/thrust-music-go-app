import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../actions';
import classNames from 'classnames';
import Button from '../lib/Button';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
        data: state.storage,
        storage: state.storage,
        token: state.auth.token,
        loaded: state.storage.loaded,
        isFetching: state.storage.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.storageActions, dispatch);
}

const styles = {
  boxContainerLeft: {
    minHeight: "200px",
    width: "48%",
    float: "left"
  },
  boxContainerRight: {
    minHeight: "200px",
    width: "48%",
    float: "left",
    marginLeft: "15px"
  },
  uploadBox: {
    border: "1px #EEF2F5 solid",
    borderRadius: "5px",
    display: "inline-block",
    height: "180px",
    width: "100%",
    textAlign: "center",
    padding: "40px",
    color: "#EEF2F5",
    cursor: "pointer"
  },
  connectedUploadBox: {
    border: "5px #32cd32 solid",
    borderRadius: "5px",
    display: "inline-block",
    height: "180px",
    width: "100%",
    textAlign: "center",
    padding: "40px",
    color: "#EEF2F5",
    cursor: "pointer"
  },
}

@connect(mapStateToProps, mapDispatchToProps)
class StorageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        this.props.fetchUserAndAllStorageData(this.props.token);
    }
    connectStorage(provider) {
        // this.props.connectToStorageProvider(this.props.token, provider)
        fetch(`/api/storage/${provider}/authorize`, {
            headers: {
                'Authorization': this.props.token
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            this.openWindow(data.url, provider);
        }).catch((err) => {
            console.error(err);
        });
    }
    disonnectStorage(e) {

    }
    checkIfPopup(window) {
      var done = false
      var windowCheck = setInterval(() => {
        if(window.closed){
          clearInterval(windowCheck);
          var data = JSON.parse(localStorage.getItem('storage_data'));
          if (data.provider && data.status === 'ok'){
              localStorage.removeItem('storage_data');
          }
        }
      }, 500);
    }
    openWindow(url, provider) {
      // need to connect
      // then return and update state
      console.log(url);
      console.log(provider);
      var title = "Connect with " + provider
      var popup = window.open(url, '_blank', 
        'width=680, height=380, modal=no, resizable=no, toolbar=no, menubar=no,'+
        'scrollbars=no, alwaysRaise=yes'
      );
      popup.resizeBy(0, 50);
      window.setTimeout(() => {
          this.checkIfPopup(popup);
      }, 1000)
    }

    render() {
        let data = this.props.storage;
        if (data === {} || data === null) {
            data = {
                drive: {
                    isConnected: false,
                    dirPath: ""
                },
                dropbox: {
                    isConnected: false,
                    dirPath: ""
                }
            }
        }
        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Storage
                            </div>
                        </div>
                        <div className="card">
                            <div style={{margin: "0 auto", width: "80%"}}>
                                <div style={styles.boxContainerLeft}>
                                    <div 
                                        style={styles.uploadBox}
                                        className="upload-box floatLeft"
                                    >
                                        <img src="/src/images/drive_icon.png"/>
                                        <br/>
                                         Google Drive
                                        <br/>
                                        {!data.drive || !data.drive.isConnected ? 

                                            <Button 
                                                onClick={() => this.connectStorage('drive')}>
                                                Click To Connect
                                            </Button>
                                        : 
                                            <span onClick={() => this.disonnectStorage('drive')}>
                                                Click To Disconnect
                                            </span>
                                        }
                                    </div>
                                </div>

                                <div style={styles.boxContainerRight}>
                                    <div 
                                        style={styles.connectedUploadBox}
                                        className="upload-box"
                                    >
                                        <img 
                                            width="50"
                                            height="50"
                                            src="/src/images/dropbox.png"/>
                                        <br/>
                                        Dropbox
                                        <br/>
                                        {!data.dropbox || !data.dropbox.isConnected ? 

                                            <Button 
                                                onClick={() => this.connectStorage('dropbox')}>
                                                Click To Connect
                                            </Button>
                                        : 
                                            <span 
                                                onClick={() => this.disonnectStorage('dropbox')}>
                                                Click To Disconnect
                                            </span>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StorageView;