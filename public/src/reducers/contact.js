import * as constants from '../constants'
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    /*
        Artist Reducers
    */
    /*
        Contact Reducers
    */

    [constants.CONTACT_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            data: {
                ...state.data,
                ...payload.data,
            }
        })
    },
    [constants.RECEIVE_CONTACT_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [constants.FETCH_CONTACT_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),

});