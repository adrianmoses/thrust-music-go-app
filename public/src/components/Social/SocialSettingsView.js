import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FacebookPages from './FacebookPages';
import Button from '../../lib/Button';
import Message from '../../lib/Message';

class SocialSettingsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            facebookPagesModalOpen: false
        }
    }
    getToken() {
      return localStorage.getItem('token');
    }
    openFacebookPagesModal() {
        this.setState((state, props) => {
          return {facebookPagesModalOpen: true}
        })
    }
    closeFacebookPagesModal() {
        this.setState((state, props) => {
          return {facebookPagesModalOpen: false}
        })
    }
    toTitleCase(str) {
        /* for each string 
        - split by blank space into substrings
        - the for each substring, uppercase the first letter
        - lowercase the rest of the letters
        - then rejoin the substrings into a string delimited by space
        */
        return str.split(' ').map(i =>
            i[0].toUpperCase() + i.substring(1).toLowerCase()
        ).join(' ');
    }
    checkIfPopup(win) {
      var done = false
      var windowCheck = setInterval(() => {
        console.log('interval called')
        console.log('win closed? ', win.closed);

        if(win.closed){
          clearInterval(windowCheck);
          var data = JSON.parse(localStorage.getItem('social_data'));
          if (data.provider && data.status === 200){
              localStorage.removeItem('social_data');
              var socialState = {};
              socialState[this.props.socialName] = true;
              this.props.updateSocialState(socialState, data.pages);
              if (data.pages) {
                this.openFacebookPagesModal();
              }
          }
        }
      }, 500);
    }
    revokeAccess(){
        const token = localStorage.getItem('token');
        fetch(`api/social/${this.props.socialName}/revoke`, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        }).then(data => {
          var socialState = {};
          socialState[this.props.socialName] = null;
          this.props.updateSocialState(
            socialState
          );
        }).catch((err) => {
          console.error(err);
        });
    }
    connectSocial(provider) {
        // this.props.connectToStorageProvider(this.props.token, provider)
        let token = this.getToken();
        fetch(`/api/social/${provider}/authorize`, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            this.openWindow(data.url, provider);
        }).catch((err) => {
            console.error(err);
        });
    }
    openWindow(url, provider) {
      // need to connect
      // then return and update state
      var title = "Connect with " + provider
      var popup = window.open(url, '_blank', 
        'width=680, height=380, modal=no, resizable=no, toolbar=no, menubar=no,'+
        'scrollbars=no, alwaysRaise=yes'
      );
      popup.resizeBy(0, 50);
      this.checkIfPopup(popup);
    }
    render() {
      return (
            <div className={this.props.isActiveView ? null : 'hide' }>
                {
                    this.props.socialConnection[this.props.socialName] === null || true ?
                        <div>
                            {/*<Message
                                header={'Connect with ' + this.props.socialName}
                                content='Connect account to read, send, and schedule posts.'
                              />*/}
                           <Button
                              target="_blank"
                              style={{
                                display: "block",
                                margin: "5 auto",
                                width: "155px"
                              }}
                              onClick={(e) => this.connectSocial(this.props.socialName)}
                              social={this.props.socialName}>
                              <i 
                                style={{"font-size": "16px"}}
                                className={"smfi "+ this.props.socialName+"-white-icon"} />
                              &nbsp;
                              {"Connect with " + this.toTitleCase(this.props.socialName)}
                           </Button>

                           <br/>
                           <br/>
                           {this.props.socialName === 'facebook' && this.props.pages !== null ?
                              (
                                <FacebookPages 
                                  open={this.state.facebookPagesModalOpen}
                                  onClose={(e) => this.closeFacebookPagesModal()}
                                  hidePageView={this.props.hidePageView}
                                  pages={this.props.pages.data}/> 
                              ) : null
                            }
                        </div>
                    : 
                      <div>
                          {/*<Message
                              header={'Connected to ' + this.props.socialName + '!'}
                              content='Check the stats page to see social analytics'
                            /> */}
                          <Button
                                target="_blank"
                                style={{
                                  display: "block",
                                  margin: "5 auto",
                                  width: "140px"
                                }}
                                onClick={this.revokeAccess.bind(this)}
                                social={this.props.socialName}>
                                <i 
                                  style={{"font-size": "16px"}}
                                  className={"smfi "+ this.props.socialName+"-white-icon"} />
                                &nbsp;
                                {"Disconnect " + this.toTitleCase(this.props.socialName)}
                           </Button>

                           <br/>
                           <br/>
                           {this.props.socialName === 'facebook' && this.props.pages !== null ?
                              (
                                <FacebookPages 
                                  open={this.state.facebookPagesModalOpen}
                                  onClose={(e) => this.closeFacebookPagesModal()}
                                  hidePageView={this.props.hidePageView}
                                  pages={this.props.pages.data}/> 
                              ) : null
                            }
                      </div>
                }
            </div>
      );
    }

}

export default SocialSettingsView;