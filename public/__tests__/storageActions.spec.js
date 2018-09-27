import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions'
import * as constants from '../src/constants'
import nock from 'nock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);


describe('storage actions', () => {
    it('should fill the payload with storage data', () => {
        var data = {
            drive: {},
            dropbox: {}
        }
        const expectedAction = {
            type: constants.RECEIVE_STORAGE_DATA,
            payload: {
                data,
            }
        }

        expect(actions.storageActions.receiveStorageData(data)).toEqual(expectedAction)
    })

})

describe('storage async actions', () => {

    it('should dispatch FETCH_STORAGE_DATA_REQUEST and RECEIVE_STORAGE_DATA actions when fetching storage data', () => {

        const token = 'fake-token';
        const artistID = 2;
        const data = {
            drive: {},
            dropbox: {}
        }

        nock('http://test.thrust.fm')
            .get(`/api/storage/${artistID}`)
            .reply(200, data)

        const expectedActions = [
          { type: constants.FETCH_STORAGE_DATA_REQUEST },
          { type: constants.RECEIVE_STORAGE_DATA, payload: {data: data}}
        ]
        const store = mockStore({})

        return store.dispatch(actions.storageActions.fetchAllStorageData(token, artistID))
            .then(() => {
              expect(store.getActions()).toEqual(expectedActions)
            })
    })
})