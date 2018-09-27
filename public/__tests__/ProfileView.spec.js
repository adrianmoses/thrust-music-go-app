import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import ProfileView from '../src/components/ProfileView';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);

function setupWrapper() {

    const props = {
        fetchProtectedData: jest.fn(),
        fetchUserAndCurrentArtist: jest.fn(),
        loaded: true,
        userName: "username",
        token: "fake-token",
        data: {},
    }

    const state = {
        data: props,
        artist: {
            id: 2,
            name: 'Mars Moses',
            profileImageUrl: 'https://api.adorable.io/avatars/250/2.png',
        },
        auth: {
            token: null,
            userName: null,
            isAuthenticated: false,
            isAuthenticating: false,
            statusText: null,
            isRegistering: false,
            isRegistered: false,
            registerStatusText: null,
        },

    }

    const store = mockStore(state)
    const enzymeWrapper = mount(
        <Provider store={store}>
            <ProfileView {...props} />
        </Provider>
    )

    return {
        props,
        enzymeWrapper
    }
}


describe('Artist Profile View Component', () => {
    it('should render self and subcomponents', () => {
        const { enzymeWrapper } = setupWrapper();
        expect(enzymeWrapper.find('.section-nav__brand').text()).toEqual("Artist Profile")
    })
})