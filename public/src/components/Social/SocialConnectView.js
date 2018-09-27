import React from 'react';
import FacebookPages from './FacebookPages';
import Button from '../../lib/Button'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

const styles = {
  connectStyles: {
    background: "#DEE2E5",
    border: "2px solid #DEE2E5",
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "15px"
  },
  connectButton: {
    display: "inline-block",
    marginRight: "25px"
  }
}

class SocialConnectView extends React.Component {
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
        return str.split(' ').map(i =>
            i[0].toUpperCase() + i.substring(1).toLowerCase()
        ).join(' ');
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
    checkIfPopup(win) {
      var done = false
      var windowCheck = setInterval(() => {
        if(win.closed){
          clearInterval(windowCheck);
          var data = JSON.parse(localStorage.getItem('social_data'));
          localStorage.removeItem('social_data');
          if (data.provider && data.status === 200){
              var socialState = {};
              socialState[data.provider] = true;
              this.props.updateSocialState(socialState, data.pages);
              if (data.pages) {
                this.openFacebookPagesModal();
              }
          }
        }
      }, 500);
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
    render() {
        var accounts = this.props.providers.map((provider) => {
            return (
              <div style={styles.connectButton}>
                 <Button
                    target="_blank"
                    style={{
                      display: "block",
                      margin: "5 auto",
                      width: "170px"
                    }}
                    onClick={(e) => this.connectSocial(provider)}
                    social={provider}>
                    <i 
                      style={{"font-size": "16px"}}
                      className={"smfi "+ provider+"-white-icon"} />
                    &nbsp;
                    {"Connect with " + this.toTitleCase(provider)}
                 </Button>
              </div>
            )
        })
        return (
          <CSSTransitionGroup
            transitionName="slide-connect"
            >
            <div 
              style={styles.connectStyles}
              className={this.props.hidden ? 'hide' : null }>
              {accounts}
              {this.props.pages !== null &&
                (
                  <FacebookPages 
                    open={this.state.facebookPagesModalOpen}
                    onClose={(e) => this.closeFacebookPagesModal()}
                    hidePageView={this.props.hidePageView}
                    pages={this.props.pages.data}/> 
                )
              }
            </div>
          </CSSTransitionGroup>
        )
    }
}

export default SocialConnectView;