import * as constants from '../constants'
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    /*
        Hook Reducers
    */
    [constants.HOOK_DATA_NEW]: (state, payload) => {
        return Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        })
    },
    [constants.HOOK_DELETE_SUCCESS]: (state, payload) => {
        return state.data.filter(hook => hook.id != payload.data.id)
    },
    [constants.HOOK_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            data: {
                ...state.data,
                ...payload.data,
            }
        })
    },
    [constants.RECEIVE_HOOK_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        })
    },
    [constants.RECEIVE_ALL_HOOK_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            dataList: payload.data,
            isFetching: false,
            loaded: true,
        })
    },
    [constants.FETCH_HOOK_DATA_REQUEST]: (state) => {
        return Object.assign({}, state, {
            isFetching: true,
        })
    }
})