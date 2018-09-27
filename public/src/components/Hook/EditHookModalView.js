import React from 'react';
import Modal from '../../lib/Modal';

import HookEditView from './HookEditView';

export default class EditHookModalView extends React.Component {
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

        setTimeout(() => {
            this.props.refreshData();
        }, 1500)
        
        this.setState((state, props) => {
            return {open: false}
        });

        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    render() {
        let open = this.props.open || this.state.open
        return (
          <Modal 
            isOpen={open}
            containerClassName={"modal"}
            className={"modal-body"}
            onClose={this.handleClose.bind(this)}>
                <div className="modal-header">Edit Hook</div>
                <div className="modal-content">
                      <HookEditView 
                        ID={this.props.ID}
                        closeModel={(e) => this.handleClose(e)} />
                </div>
          </Modal>
        );
    }
}