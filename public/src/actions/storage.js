import * as constants from '../constants';
import { parseJSON } from '../utils/misc';
import { get_storage_data, connect_storage_provider } from '../utils/http_functions';
import { fetchUserData } from './user';

export function receiveStorageData(data) {
    return {
        type: constants.RECEIVE_STORAGE_DATA,
        payload: {
            data,
        }
    };
}

export function fetchStorageDataRequest() {
   return {
        type: constants.FETCH_STORAGE_DATA_REQUEST,
    };
}

export function fetchProviderAuthorizeURL() {
   return {
        type: constants.FETCH_STORAGE_DATA_REQUEST,
    };
}

export function receiveProviderAuthorizeURL(data) {
    return {
        type: constants.RECEIVE_STORAGE_AUTH_URL,
        payload: {
            data,
        }
    };

}

export function fetchStorageDataFailure(error) {
    return {
        type: constants.STORAGE_DATA_FAILURE,
        payload: {
            status: 500,
            statusText: error.toString(),
        },
    };
}

export function fetchAllStorageData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchStorageDataRequest());
        return get_storage_data(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveStorageData(response));
            })
            .catch(error => {
                if (error) dispatch(fetchStorageDataFailure(error));
            })
    }
}

export function fetchUserAndAllStorageData(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchAllStorageData(token, artist_id));
        })
    }
}


export function connectToStorageProvider(token, provider) {
    return (dispatch) => {
        dispatch(fetchProviderAuthorizeURL());
        return connect_storage_provider(token, provider)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProviderAuthorizeURL(response));
            })
            .catch(error => {
                if (error) dispatch(fetchStorageDataFailure(error));
            })
    }
}