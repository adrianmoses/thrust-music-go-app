import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../../actions';
import classNames from 'classnames';
import Button from '../../lib/Button';
import NewHookModalView from './NewHookModalView';
import HookItem from './HookItem';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
        data: state.hook,
        hook: state.hook,
        token: state.auth.token,
        loaded: state.hook.loaded,
        isFetching: state.hook.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.hookActions, dispatch);
}

const styles = {
  boxContainerLeft: {
    minHeight: "200px",
    width: "48%",
    float: "left"
  },
  boxContainerRight: {
    minHeight: "200px",
    width: "48%",
    float: "left",
    marginLeft: "15px"
  },
  uploadBox: {
    border: "1px #EEF2F5 solid",
    borderRadius: "5px",
    display: "inline-block",
    height: "180px",
    width: "100%",
    textAlign: "center",
    padding: "40px",
    color: "#EEF2F5",
    cursor: "pointer"
  },
  connectedUploadBox: {
    border: "5px #32cd32 solid",
    borderRadius: "5px",
    display: "inline-block",
    height: "180px",
    width: "100%",
    textAlign: "center",
    padding: "40px",
    color: "#EEF2F5",
    cursor: "pointer"
  },
}

@connect(mapStateToProps, mapDispatchToProps)
class HooksView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hookModalOpen: false
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    openHookModal(e) {
        this.setState((state, props) => {
            return {hookModalOpen: true}
        })
    }

    closeHookModal() {
        this.setState((state, props) => {
            return {hookModalOpen: false}
        });
    }
    fetchData() {
        this.props.fetchUserAndAllHookData(this.props.token);
    }
    refreshData() {
        this.fetchData();
    }
    deleteHook(token, hookID) {
        this.props.deleteHookData(token, hookID).then(() => {
            setTimeout(() => {
                this.refreshData();
            }, 1500)
        })
    }
    render() {
        let hookItems = null;
        if (this.props.hook.dataList) {
            hookItems = this.props.hook.dataList.map((hookData, index) => {
                return (
                    <HookItem 
                        key={index}
                        deleteHook={this.deleteHook.bind(this)}
                        refreshData={this.refreshData.bind(this)} 
                        {...hookData} />
                );
            })
        }
        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Hooks
                            </div>
                            <div className="section-nav__left">
                            </div>
                            <div className="section-nav__right">
                                 <Button
                                  onClick={(e) => this.openHookModal(e)}
                                  floatRight
                                  positive>
                                  New Hook
                                </Button>
                            </div>
                        </div>
                        {hookItems}
                        <NewHookModalView 
                            open={this.state.hookModalOpen}
                            onClose={this.closeHookModal.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default HooksView;