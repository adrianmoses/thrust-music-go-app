 import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../actions';
import Button from '../lib/Button';
import Flash from '../lib/Flash';
import DropdownNav from '../lib/DropdownNav';
import PropTypes from 'prop-types';

function mapStateToProps(state) {
    return {
        data: state.artist,
        token: state.auth.token,
        loaded: state.artist.loaded,
        isFetching: state.artist.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.artistActions, dispatch);
}


@connect(mapStateToProps, mapDispatchToProps)
class ProfileNav extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        this.props.fetchUserAndCurrentArtist(this.props.token);
    }
    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
    }
    show() {
        this.setState((state, props) => {
            return {visible: true};
        })
    }
    hide() {
        this.setState((state, props) => {
            return {visible: false};
        })
    }
    toggleVisible() {
        if (this.state.visible === false) {
            this.show();
        } else {
            this.hide();
        }
    }
    render() {
        let data = this.props.data;
        console.log('Artist Data', data);
        if (typeof data.data === 'undefined' || data.data === null) {
            data.data = {
                profileImageUrl: `https://api.adorable.io/avatars/250/1jlr39.png`,
                name: 'Untitled Artist',
                description: ''
            }
        }
        return (
            <div className="main-top-section">
                <div className="artist-profile-nav">
                    <img 
                        className="profile-nav-img" 
                        src={data.data.profileImageUrl} />
                    <div
                        onClick={(e) => this.toggleVisible()}
                        className="profile-nav-name">
                            {data.data.name}
                        <i 
                            className="bfi nav-down-arrow"></i>
                        <DropdownNav
                            className="dropdown-nav"
                            hide={!this.state.visible}
                            items={
                                <div className="artist-nav-items">
                                    <a 
                                        href="/profile">Profile</a>
                                    <a href="/settings">Settings</a>
                                    <a onClick={(e) => this.logout(e)}>Logout</a>
                                </div>
                            }
                            >
                        </DropdownNav>
                    </div>
                </div>
            </div>
        );
    }
}

ProfileNav.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
export default ProfileNav