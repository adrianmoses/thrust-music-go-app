import { browserHistory } from 'react-router';
import * as constants from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user} from '../utils/http_functions';
import { redirectToRoute, logoutAndRedirect } from './auth';


export function receiveProtectedData(data) {
    return {
        type: constants.RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: constants.FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function fetchUserData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        return data_about_user(token).then(parseJSON)
                .then(response => {
                    dispatch(receiveProtectedData(response));
                })
                .catch(error => {
                    console.error(error);
                });
    };
}




