import * as constants from '../constants';
import { parseJSON } from '../utils/misc';
import { get_all_social_data, get_sent_social_data, get_queued_social_data } from '../utils/http_functions';
import { fetchUserData } from './user';

export function receiveSocialData(data) {
    return {
        type: constants.RECEIVE_SOCIAL_DATA,
        payload: {
            data,
        }
    };
}

export function fetchSocialDataRequest() {
    return {
        type: constants.FETCH_SOCIAL_DATA_REQUEST,
    };
}

export function fetchSocialDataFailure(error) {
    return {
        type: constants.SOCIAL_DATA_FAILURE,
        payload: {
            status: error.status,
            statusText: error.statusText,
        },
    };
}


export function createEmptySocialData() {
    return {
        type: constants.SOCIAL_DATA_NEW,
        payload: {
            data: {
                activeItem: {
                    name: "twitter",
                    social: "twitter-icon" 
                },
                items: [
                  {
                    name: "facebook",
                    social: "facebook-icon"
                  },
                  {
                    name: "youtube",
                    social: "youtube-icon"
                  },
                  {
                    name: "twitter",
                    social: "twitter-icon",
                  },
                ],
                data: {
                    event: {
                        message: "",
                        sendAt: ""
                    },
                    account: {
                        name: "",
                        connection: "",
                        page_id: "",
                        page_access_token: "",
                        page_name: ""
                    }
                }
            }
        },
    };
}

export function changeSocialData(activeItem) {
    let items = [
        {
            name: "facebook",
            social: "facebook-icon"
        },
        {
            name: "youtube",
            social: "youtube-icon"
        },
        {
            name: "twitter",
            social: "twitter-icon",
        },
    ]
    return {
        type: constants.SOCIAL_DATA_SUCCESS,
        payload: {
            data: {
                activeItem,
                items
            }
        },
    };
}

export function fetchAllSocialData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchSocialDataRequest());
        get_all_social_data(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveSocialData({accounts: response}));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchSocialDataFailure(error));
                }
            })
    }
}

export function fetchQueuedSocialData(token, artist_id, provider) {
    return (dispatch) => {
        dispatch(fetchSocialDataRequest());
        get_queued_social_data(token, artist_id, provider)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveSocialData({queued: response}));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchSocialDataFailure(error));
                }
            })
    }
}

export function fetchSentSocialData(token, artist_id, provider) {
    return (dispatch) => {
        dispatch(fetchSocialDataRequest());
        get_sent_social_data(token, artist_id, provider)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveSocialData({sent: response}));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchSocialDataFailure(error));
                }
            })
    }
}

export function fetchUserAndAllSocialData(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchAllSocialData(token, artist_id));
        })
    }
}

export function fetchUserAndQueuedSocialData(token, provider) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchQueuedSocialData(token, artist_id, provider));
        })
    }
}

export function fetchUserAndSentSocialData(token, provider) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchSentSocialData(token, artist_id, provider));
        })
    }
}