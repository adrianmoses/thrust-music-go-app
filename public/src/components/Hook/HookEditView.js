import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import Button from '../../lib/Button';
import Dropdown from '../../lib/Dropdown';
import TextArea from '../../lib/TextArea';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
        hook: state.hook,
        token: state.auth.token,
        loaded: state.hook.loaded,
        isFetching: state.hook.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.hookActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class HookEditView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTrigger: {
                    name: "youtube",
                    social: "youtube-icon",
                    stmt: "a video is uploaded to youtube"
            },
            activeAction: {
                    name: "twitter",
                    social: "twitter-icon",
                    stmt: "send a tweet"
            },
            hookStatus: true,
            triggers: [
                  {
                    name: "youtube",
                    social: "youtube-icon",
                    stmt: "a video is uploaded to youtube"
                  },
            ],
            actions: [
                  {
                    name: "twitter",
                    social: "twitter-icon",
                    stmt: "send a tweet"
                  },
                  {
                    name: "facebook",
                    social: "facebook-icon",
                    stmt: "send a facebook post"
                  },
            ],
            statement: "Send a tweet when a video is uploaded to youtube",
            message: "{{Title}}, {{Description}} {{URL}} ",
        }
    }
    componentDidMount() {
        this.props.fetchUserAndHookData(this.props.token, this.props.ID);
    }
    updateActiveTrigger(trigger) {
        var statement = `${this.props.hook.data.activeAction.stmt} when ${trigger.stmt}`
        this.props.changeHookData({
            activeTrigger: trigger,
            statement: statement
        })
    }
    updateActiveAction(action) {
        var statement = `${action.stmt} when ${this.props.hook.data.activeTrigger.stmt}`
        this.props.changeHookData({
            activeAction: action,
            statement: statement
        })

    }
    updateHookStatus(e) {
        this.props.changeHookData({
            hookStatus: !this.props.hook.data.hookStatus
        })

    }
    changeValue(e, type) {
        const value = e.target.value;
        this.props.changeHookData({[type]: value});
    }
    saveHook(e) {
        //TODO: use redux and close modal
        e.preventDefault();
        let data = {
            id: this.props.hook.data.ID,
            message: this.props.hook.data.message,
            is_active: this.props.hook.data.hookStatus,
            statement: this.props.hook.data.statement,
            trigger: this.props.hook.data.activeTrigger.name,
            action: this.props.hook.data.activeAction.name,
        }
        console.log(this.props);
        this.props.saveHookData(this.props.token, this.props.hook.data.ID, data).then(
            () => {
                // todo show success flash
                this.props.closeModel();
            }, (err) => {
                // todo 'trigger error flash'
                console.error("Hook Didn't Save")
                console.error(err);
            }
        )
    }
    render() {
        let data = this.props.hook.data || this.state
        return (
            <div>
                <form>
                    <div>
                        <div style={{marginBottom: "15px"}}>
                            <p style={{fontWeight: "300"}}>
                                Choose Trigger
                            </p>

                            <Dropdown
                               defaultSelected={data.activeTrigger}
                               items={this.state.triggers}
                               onChange={this.updateActiveTrigger.bind(this)}
                              />
                        </div>
                        <div style={{marginBottom: "15px"}}>
                            <p style={{fontWeight: "300"}}>
                                Choose Action
                            </p>
                            <Dropdown
                               defaultSelected={data.activeAction}
                               items={this.state.actions}
                               onChange={this.updateActiveAction.bind(this)}
                              />
                        </div>
                        <div style={{marginBottom: "15px"}}>

                            <p style={{fontWeight: "300"}}>
                                Statement
                            </p>
                            {data.statement}
                        </div>
                        <div style={{marginBottom: "15px"}}>

                            <p style={{fontWeight: "300"}}>
                                Post Message
                            </p>
                            <TextArea 
                                className="message" 
                                placeholder="Message"
                                value={data.message}
                                onChange={(e) => this.changeValue(e, 'message')}
                                autoHeight
                            />
                        </div>
                        <div style={{marginBottom: "15px"}}>
                            <p style={{fontWeight: "300"}}>
                                Active Hook
                            </p>

                            <div>
                                <input 
                                    type="checkbox"
                                    onClick={this.updateHookStatus.bind(this)}
                                    defaultChecked={data.hookStatus}
                                    label="Active Hook" />
                            </div>
                        </div>
                        <div>
                            <Button 
                                style={{marginLeft: "15px"}}
                                floatRight
                                onClick={(e) => this.saveHook(e)}
                                positive> 
                                Save Hook
                            </Button>
                            <Button 
                                style={{marginLeft: "15px"}}
                                onClick={(e) => this.props.closeModel(e)}
                                floatRight
                                >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default HookEditView;