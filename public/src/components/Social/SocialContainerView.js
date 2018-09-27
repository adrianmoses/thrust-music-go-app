import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SocialContentView from './SocialContentView';
import SocialScheduledView from './SocialScheduledView';
import SocialHistoryView from './SocialHistoryView';
import SocialSettingsView from './SocialSettingsView';

class SocialContainerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'settings'
        }
    }
    handleItemClick(e, { name }) {
        this.setState({ activeItem: name });
    }
    render() {
        return (
          <div>
            <SocialContentView
               socialName={this.props.socialName} 
               socialID={this.props.socialID}
               isActiveView={this.props.activeTab === 'post'}/>
            <SocialScheduledView
               socialName={this.props.socialName} 
               fetchQueuedData={this.props.fetchQueuedData}
               queuedPosts={this.props.queuedPosts}
               isActiveView={this.props.activeTab === 'scheduled'}/>
            <SocialHistoryView
               socialName={this.props.socialName} 
               sentPosts={this.props.sentPosts}
               fetchSentData={this.props.fetchSentData}
               isActiveView={this.props.activeTab === 'history'}/>
            <SocialSettingsView
              socialName={this.props.socialName} 
              socialConnection={this.props.socialConnection}
              pages={this.props.pages}
              hidePageView={this.props.hidePageView}
              updateSocialState={this.props.updateSocialState}
              isActiveView={this.props.activeTab === 'settings'}/>
          </div>
        );
    }
}

export default SocialContainerView;