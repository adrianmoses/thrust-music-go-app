import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SocialHistoryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    getDefaultProps() {
        return {
            sentPosts: [],
        }
    }
    componentDidMount() {
        this.props.fetchSentData(this.props.socialName);
    }
    render() {
        console.log("Sent Posts: ", this.props);
        let sentPosts = this.props.sentPosts;
        let sentMessages = sentPosts.map((sentPost) => {
            return (
                <div>
                    {sentPost.message}
                </div>
            )
        })
        return (
            <div className={this.props.isActiveView ? null : 'hide' }>
                <div>
                   History View 
                </div>
                <div>
                    {sentMessages}
                </div>
            </div>
        )
    }
}

export default SocialHistoryView;