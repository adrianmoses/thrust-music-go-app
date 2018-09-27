import * as constants from '../constants'
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    /*
        Social Reducers
    */
    [constants.SOCIAL_DATA_NEW]: (state, payload) => {
        return Object.assign({}, state, {
            activeItem: payload.activeItem,
            items: payload.items,
            data: {
                ...state.data,
                ...payload.data,
            }
        })
    },
    [constants.SOCIAL_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            data: {
                ...state.data,
                ...payload.data,
            }
        });
    },
    [constants.RECEIVE_SOCIAL_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: {
                ...state.data,
                ...payload.data,
            },
            isFetching: false,
            loaded: true,
        }),
    [constants.FETCH_SOCIAL_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),

});