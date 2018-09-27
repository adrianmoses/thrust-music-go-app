import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import StorageView from '../src/components/StorageView';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);

function setupWrapper() {

    const props = {
        fetchProtectedData: jest.fn(),
        fetchUserAndAllStorageData: jest.fn(),
        loaded: true,
        userName: "username",
        token: "fake-token",
        data: {},
    }

    const state = {
        data: props,
        storage: {
            drive: {
                isConnected: true
            },
            dropbox: {
                isConnected: true
            }
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
            <StorageView {...props} />
        </Provider>
    )

    return {
        props,
        enzymeWrapper
    }
}

describe('Storage View Component', () => {
    it('should render self and subcomponents', () => {
        const { enzymeWrapper } = setupWrapper();
        expect(enzymeWrapper.find('.section-nav__brand').text()).toEqual("Storage")
    })
})