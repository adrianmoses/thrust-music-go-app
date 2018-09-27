import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { choose_facebook_page } from '../../utils/http_functions';

class FacebookPageView extends React.Component {
  constructor(props) {
    super(props);
  }
  choosePage(e) {
      let token = localStorage.getItem('token');
      choose_facebook_page(
          token, 
          this.props.page.id, 
          this.props.page.access_token, 
          this.props.page.name
        ).then(res => {
          this.props.closePageView();
        });
  }
  render() {
      return (
          <div className="fb-page-name" onClick={this.choosePage.bind(this)}>
              {this.props.page.name}
          </div>
      );
  }
}

export default FacebookPageView;