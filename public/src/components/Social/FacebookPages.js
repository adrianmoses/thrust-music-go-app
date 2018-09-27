import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FacebookPageView from './FacebookPageView';
import Modal from '../../lib/Modal';

class FacebookPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false
    }
  }
  handleOpen(e){
      this.setState((state, props) => {
          return {open: true}
      });
  }
  handleClose(e) {
      if (e)
          e.preventDefault();

      this.setState((state, props) => {
          return {open: false}
      });

      if (this.props.onClose) {
          this.props.onClose();
      }
      this.props.hidePageView();
  }
  render() {
    var pages = this.props.pages.map(page => {
      return (
          <FacebookPageView 
                closePageView={(e) => this.handleClose()}
                page={page}/>
        );
    });
    let open = this.props.open || this.state.open
    return (
      <Modal 
        isOpen={open}
        containerClassName={"modal"}
        className={"modal-body"}
        onClose={(e) => this.handleClose()}>
            <div className="modal-header">Choose a facebook page to link</div>
            <div className="modal-content">
              <div>
                {pages}
              </div>
            </div>
      </Modal>
    );
  }

}

export default FacebookPages;