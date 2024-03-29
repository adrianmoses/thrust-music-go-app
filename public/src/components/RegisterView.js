/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';

import PropTypes from 'prop-types';

import { validateEmail } from '../utils/misc';

import Input from '../lib/Input';
import Button from '../lib/Button';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RegisterView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        console.log('clicked!');
        this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
    }

    render() {
        return (
            <div>
                <div className="unauthenticated-brand-section">
                    <div className="brand">Thrust</div>
                </div>
                <div className="section" onKeyPress={(e) => this._handleKeyPress(e)}>
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Sign Up
                            </div>
                            {
                                this.props.registerStatusText &&
                                    <div className="alert alert-info">
                                        {this.props.registerStatusText}
                                    </div>
                            }
                        </div>
                        <div className="card">
                            <form role="form">
                                <div className="register-form">
                                    <field>
                                        <label>Email</label>
                                        <Input
                                          placeholder="Email"
                                          type="email"
                                          onChange={(e) => this.changeValue(e, 'email')}
                                        />
                                    </field>
                                    <field>
                                        <label>Password</label>
                                        <Input
                                          placeholder="Password"
                                          type="password"
                                          onChange={(e) => this.changeValue(e, 'password')}
                                        />
                                    </field>

                                    <field>
                                        <label>Repeat Password</label>
                                        <Input
                                          placeholder="Password Again"
                                          type="password"
                                        />
                                    </field>

                                    <Button
                                    
                                      style={{'marginTop': '30px'}}
                                      disabled={this.state.disabled}
                                      onClick={(e) => this.login(e)}
                                      floatRight
                                      positive>
                                      Submit
                                    </Button>

                                </div>
                            </form>
                            <span 
                                style={{marginTop: '35px', 'float':'right'}}
                                >Already have an account? &nbsp;
                                <a href="/login">Log In</a>
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        );

    }
}

RegisterView.propTypes = {
    registerUser: PropTypes.func,
    registerStatusText: PropTypes.string,
};
