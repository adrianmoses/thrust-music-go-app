import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions'
import * as constants from '../src/constants'
import nock from 'nock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);


describe('artist actions', () => {
    it('should fill the payload with artist data and default image url', () => {
        var originalArtistData = {
            id: 2,
            name: 'Mars Moses',
            profileImageUrl: 'https://api.adorable.io/avatars/250/2.png'
        }
        var updatedArtistData = Object.assign(originalArtistData, {
            profileImageUrl: 'https://api.adorable.io/avatars/250/2.png'
        })
        const expectedAction = {
            type: constants.RECEIVE_ARTIST_DATA,
            payload: {
                data: updatedArtistData,
            }
        }

        expect(actions.artistActions.receiveArtistData(originalArtistData)).toEqual(expectedAction)
    })

    it('should return fetch artist action type', () => {
        const expectedAction = {
            type: constants.FETCH_ARTIST_DATA_REQUEST,
        }
        expect(actions.artistActions.fetchArtistDataRequest()).toEqual(expectedAction)
    })

    it('should return save artist action type', () => {
        const expectedAction = {
            type: constants.SAVE_ARTIST_DATA_REQUEST,
        }
        expect(actions.artistActions.saveArtistDataRequest()).toEqual(expectedAction)
    })


})

describe('async artist actions', () => {
    it('should dispatch FETCH_ARTIST_DATA_REQUEST and RECEIVE_ARTIST_DATA actions when fetching artist data', () => {

        const token = 'fake-token';
        const artistData = {
            id: 2,
            name: 'Mars Moses',
            profileImageUrl: 'https://api.adorable.io/avatars/250/2.png',
        }

        nock('http://test.thrust.fm')
            .get('/api/artists/2')
            .reply(200, artistData)

        const expectedActions = [
          { type: constants.FETCH_ARTIST_DATA_REQUEST },
          { type: constants.RECEIVE_ARTIST_DATA, payload: {data: artistData}}
        ]
        const store = mockStore({})

        return store.dispatch(actions.artistActions.fetchArtistData(token, artistData.id))
            .then(() => {
              expect(store.getActions()).toEqual(expectedActions)
            })
    })
})
