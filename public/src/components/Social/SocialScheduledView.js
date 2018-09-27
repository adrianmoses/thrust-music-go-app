import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SocialScheduledView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    getDefaultProps() {
        return {
            queuedPosts: [],
        }
    }
    componentDidMount() {
        this.props.fetchQueuedData(this.props.socialName);
    }
    render() {
        console.log("Queued Posts: ", this.props);
        let queuedPosts = this.props.queuedPosts;
        let queuedMessages = queuedPosts.map((queuedPost) => {
            return (
                <div>
                    {queuedPost.message}
                </div>
            )
        })
        return (
            <div className={this.props.isActiveView ? null : 'hide' }>
                <div>
                    Schedule View
                </div>
                <div>
                    {queuedMessages}
                </div>
            </div>
        )
    }
}

export default SocialScheduledView;