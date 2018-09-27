import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import * as actionCreators from '../../actions/auth';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const styles = {
  header: {
  },
}

@connect(mapStateToProps, mapDispatchToProps)
export class HeaderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };

    }

    componentDidMount(){
       this.fetchData(); 
    }
    fetchData() {
        if(this.props.isAuthenticated) {
            //TODO fetch artist by user
        }
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            visible: false,
        });

    }


    handleClickOutside() {
        this.setState({
            visible: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            visible: false,
        });
    }

    toggleNav() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        return (
            <header className="sidebar">
                <div>
                    <div className="brand" onClick={() => this.dispatchNewRoute('/')} header>Thrust</div>
                        {
                            !this.props.isAuthenticated ?
                                <div className="sidebar__nav" position="right">
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/login'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/login')}>
                                        <h5>login</h5>
                                    </div>
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/register'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/register')}>
                                        <h5>signup</h5>
                                    </div>
                                </div>
                                :
                                <div className="sidebar__nav" position="right">
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/dashboard'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/dashboard')}>
                                        <i className="navfi dashboard"></i>
                                        <h5>dashboard</h5>
                                    </div>
                                    {/*<div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/content'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/content')}>
                                        <i className="navfi music"></i>
                                        <h5>content</h5>
                                    </div>*/}
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/social'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/social')}>
                                        <i className="navfi network"></i>
                                        <h5>social</h5>
                                    </div>
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/hooks'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/hooks')}>
                                        <i className="navfi hook-icon"></i>
                                        <h5>hooks</h5>
                                    </div>
                                    {/*<div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/events'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/events')}>
                                        <i className="navfi calendar-icon"></i>
                                        <h5>events</h5>
                                    </div>*/}
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/contacts'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/contacts')}>
                                        <i className="navfi contact-icon"></i>
                                        <h5>contacts</h5>
                                    </div>
                                    <div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/pages'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/pages')}>
                                        <i className="bfi paper-icon"></i>
                                        <h5>pages</h5>
                                    </div>
                                    {/*<div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/reports'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/reports')}>
                                        <i className="navfi analytics-icon"></i>
                                        <h5>reports</h5>
                                    </div>*/}
                                    {/*<hr className="sidebar__nav--hr"/>*/}

                                    {/*<div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/storage'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/storage')}>
                                        <h5>storage</h5>
                                    </div>*/}
                                    {/*<div 
                                        className={classNames("sidebar--nav-item", {
                                            'active': this.props.location.pathname === '/profile'
                                        })}
                                        onClick={() => this.dispatchNewRoute('/profile')}>
                                        <h5>profile</h5>
                                    </div>
                                    <div 
                                        className="sidebar--nav-item"
                                        onClick={(e) => this.logout(e)}>
                                        <h5>logout</h5>
                                    </div>*/}
                                </div>
                        }

                </div>
            </header>

        );
    }
}

HeaderView.propTypes = {
    logoutAndRedirect: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};
