import React from 'react';
import EditHookModalView from './EditHookModalView';


const styles = {}

class TriggerActionView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <i className={"smfi " + this.props.trigger + "-icon"}></i>
                &nbsp;
                <i className="bfi right-arrow"></i>
                &nbsp;
                <i className={"smfi " + this.props.action + "-icon"}></i>
            </div>
        );
    }
}


class HookItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editHookModalOpen: false
        }
    }
    openHookEditModal() {
        this.setState((state, props) => {
            return {editHookModalOpen: true}
        })
    }
    closeHookEditModal() {
        this.setState((state, props) => {
            return {editHookModalOpen: false}
        })
    }
    getToken() {
        return localStorage.getItem('token')
    }
    removeHook() {
        this.props.deleteHook(this.getToken(), this.props.ID)
    }
    render() {
        return (
            <div className="hook-item">
                <div 
                    className="trigger-action-view"
                    style={{fontSize: "20px"}}>
                    <TriggerActionView 
                        trigger={this.props.trigger}
                        action={this.props.action}
                    />
                </div>
                <div className="hook-statement">
                    {this.props.statement}
                </div>
                <div style={{
                            float: "right",
                            display: "inline-block",
                        }}>
                    <div className="hook-edit" style={{cursor: "pointer"}}>
                        <i className="bfi hook-edit-icon" onClick={(e) => this.openHookEditModal()}></i>
                    </div>
                    <div className="hook-delete" style={{cursor: "pointer"}}>
                        <i className="bfi hook-delete-icon" onClick={(e) => this.removeHook()}></i>
                    </div>
                </div>
                <EditHookModalView 
                    open={this.state.editHookModalOpen}
                    ID={this.props.ID}
                    refreshData={this.props.refreshData}
                    onClose={this.closeHookEditModal.bind(this)}
                />
            </div>
        );
    }
}

export default HookItem;