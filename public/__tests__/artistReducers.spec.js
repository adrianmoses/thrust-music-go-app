import artistReducer from '../src/reducers/artist'
import * as constants from '../src/constants'

describe('artist reducers', () => {
  it('should return the initial state', () => {
    expect(artistReducer(undefined, {})).toEqual({
            data: null,
            isFetching: false,
            loaded: false,
        })
    })

  it('should handle ARTIST_DATA_SUCCESS', () => {
        const data = {
            id: 2,
            name: 'Mars Moses',
            profileImageUrl: 'https://api.adorable.io/avatars/250/2.png'
        }
        const payload = {
            type: constants.ARTIST_DATA_SUCCESS,
            payload: {
                data
            }
        }

        const initialState = {
            data: null,
            isFetching: false,
            loaded: false,
        };

        expect(artistReducer(initialState, payload)).toEqual({
            data: data,
            isFetching: false,
            loaded: false,
        })
  })
})