import * as constants from '../constants'
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    /*
        Storage Reducers
    */
    [constants.STORAGE_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            data: {
                ...state.data,
                ...payload.data,
            }
        })
    },
    [constants.RECEIVE_STORAGE_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        })
    },
    [constants.FETCH_STORAGE_DATA_REQUEST]: (state) => {
        return Object.assign({}, state, {
            isFetching: true,
        })
    }
})
