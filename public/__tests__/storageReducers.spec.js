import storageReducer from '../src/reducers/storage'
import * as constants from '../src/constants'

describe('storage reducers', () => {
  it('should return the initial state', () => {
    expect(storageReducer(undefined, {})).toEqual({
            data: null,
            isFetching: false,
            loaded: false,
        })
    })
})