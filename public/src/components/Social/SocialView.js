import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import { Link } from 'react-router';
import SocialContainerView from './SocialContainerView';
import SocialNav from './SocialNav';
import SocialConnectView from './SocialConnectView';
import Flash from '../../lib/Flash';
import Dropdown from '../../lib/Dropdown';
import { find } from 'lodash'

function mapStateToProps(state) {
    return {
        data: state.social,
        social: state.social,
        token: state.auth.token,
        loaded: state.social.loaded,
        isFetching: state.social.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.socialActions, dispatch);
}

const styles = {
  paper: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  title: {
    textAlign: "center"
  },
  tabs: {
    paddingRight: 16,
    paddingLeft: 16,
  },
};

@connect(mapStateToProps, mapDispatchToProps)
class SocialView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            pages: null,
            connectViewHidden: true,
            selectedProvider: null,
            selectedProviderID: null,
            providers: [
                "twitter",
                "facebook",
                "youtube"
            ]
        };
    }
    getDefaultProps() {
        return {
            social: {
              data: {
                  accounts: [],
                  sent: [],
                  queued: [],
              }
            }
        }
    }
    handleItemClick(e, { name }) {
        this.setState({
            activeItem: name
        })
    }
    componentDidMount(){
      this.props.fetchUserAndAllSocialData(this.props.token);
    }
    fetchQueuedData(provider) {
      this.props.fetchUserAndQueuedSocialData(this.props.token, provider);
    }
    fetchSentData(provider) {
      this.props.fetchUserAndSentSocialData(this.props.token, provider);
    }
    updateSocialState(social, pageData) {
        // check if social is connected
        var conn = Object.assign({},
            this.state.connection,
            social
        );
        // assert connection is actually valid
        if(pageData) {
          this.setState({
            connection: conn,
            pages: pageData
          });

        } else {
          this.setState({
            connection: conn
          });
        }
    }
    showConnectView() {
      this.setState(() => {
        return {connectViewHidden: false}
      })
    }
    hideConnectView() {
      this.setState(() => {
        return {connectViewHidden: true}
      })
    }
    hidePageView() {
      this.setState({ pages: null });
    }

    openPage(route) {
        this.props.redirectToRoute(route);
    }
    updateActiveItem(e, selectedProvider) {
        e.preventDefault();
        let selectedAccount = find(this.props.social.data.accounts, function(obj) {
          return obj.provider === selectedProvider
        })
        console.log("selected account #1 ", selectedAccount)
        this.setState((state, props) => {
          return {
            selectedProvider: selectedProvider,
            selectedProviderID: selectedAccount.ID
          }
        })
    }
    render() {
        let { social } = this.props;
        if (!social.data) {
            social.data = {
                accounts: [],
                sent: [],
                queued: []
            }
        }
        console.log("Social Props: ", social);
        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Social
                            </div>
                            <div className="section-nav__left">
                                <SocialNav 
                                    accounts={social.data.accounts}
                                    selectedProvider={this.state.selectedProvider}
                                    hidden={this.state.connectViewHidden}
                                    updateActiveItem={this.updateActiveItem.bind(this)}
                                    hideConnectView={this.hideConnectView.bind(this)}
                                    showConnectView={this.showConnectView.bind(this)} />
                                <SocialConnectView 
                                    hidden={this.state.connectViewHidden}
                                    updateSocialState={this.updateSocialState.bind(this)}
                                    hidePageView={this.hidePageView.bind(this)}
                                    pages={this.state.pages}
                                    providers={this.state.providers} />
                                {this.state.selectedProvider && 
                                    (
                                      <ul>
                                        <li>
                                            <a onClick={(e) => this.openPage('/social/post') }>Post</a>
                                        </li>
                                        <li>
                                            <a onClick={(e) => this.openPage('/social/scheduled') }>Scheduled</a>
                                        </li>
                                        <li>
                                            <a onClick={(e) => this.openPage('/social/history') }>History</a>
                                        </li>
                                      </ul>
                                    )
                                }
                            </div>
                            <div className="section-nav__right">
                            </div>
                        </div>
                        {this.state.selectedProvider ? 
                          (
                            <div className="card">
                                <SocialContainerView
                                  socialName={this.state.selectedProvider} 
                                  socialID={this.state.selectedProviderID} 
                                  activeTab={this.props.params.tab || 'post'}
                                  socialConnection={this.state.selectedProvider}
                                  pages={this.state.pages}
                                  sentPosts={social.data.sent}
                                  queuedPosts={social.data.queued}
                                  hidePageView={this.hidePageView.bind(this)}
                                  fetchSentData={this.fetchSentData.bind(this)}
                                  fetchQueuedData={this.fetchQueuedData.bind(this)}
                                  updateSocialState={this.updateSocialState.bind(this)}/> 
                             </div>
                          ) :
                          (
                              <div className="empty-social-container">
                                  Select or Connect a Social Provider
                              </div>
                          )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default SocialView;