import * as constants from '../constants';
import { parseJSON } from '../utils/misc';
import { get_artist_data, data_about_user } from '../utils/http_functions';
import { fetchUserData } from './user';

import { omit } from 'lodash';

export function receiveArtistData(data) {
    let profile_image_url = data.profile_image_url 
        ? data.profile_image_url 
        : `https://api.adorable.io/avatars/250/${data.id}.png`

    let newData = Object.assign({}, omit(data, 'profile_image_url'), {
        profileImageUrl: profile_image_url
    });
    return {
        type: constants.RECEIVE_ARTIST_DATA,
        payload: {
            data: newData,
        }
    };
}

export function fetchArtistDataRequest() {
    return {
        type: constants.FETCH_ARTIST_DATA_REQUEST,
    };
}

export function saveArtistDataRequest() {
    return {
        type: constants.SAVE_ARTIST_DATA_REQUEST,
    };
}

export function fetchArtistDataFailure(error) {
    return {
        type: constants.ARTIST_DATA_FAILURE,
        payload: {
            status: 500,
            statusText: error.name + ': ' + error.message + '\n' + error.toString(),
        },
    };
}

export function saveArtistDataSuccess(data) {

    let profile_image_url = data.profile_image_url 
        ? data.profile_image_url 
        : `https://api.adorable.io/avatars/250/${data.id}.png`

    let newData = Object.assign({}, omit(data, 'profile_image_url'), {
        profileImageUrl: profile_image_url
    });
    return {
        type: constants.ARTIST_DATA_SUCCESS,
        payload: {
            data: newData
        },
    };
}

export function saveArtistDataFailure(res) {
    return {
        type: constatns.ARTIST_DATA_FAILURE,
        payload: {
            status: res.status,
            statusText: res.error,
        },
    };
}

export function updateProfileImage(imageUrl) {
    return {
        type: constants.IMAGE_UPLOAD_SUCCESS,
        payload: {
            data: {
                profileImageUrl: imageUrl
            }
        }
    }
}

export function changeArtistData(data) {
    return {
        type: constants.ARTIST_DATA_SUCCESS,
        payload: {
            data
        },
    };
}

export function fetchArtistData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchArtistDataRequest());
        return get_artist_data(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveArtistData(response));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchArtistDataFailure(error))
                }
            })
    }
}

export function fetchUserAndCurrentArtist(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchArtistData(token, artist_id));
        })
    }
}

export function saveArtistData(token, artist_data) {
    return (dispatch, getState) => {
        dispatch(saveArtistDataRequest());
        return dispatch(fetchUserAndCurrentArtist(token)).then(() => {
            const artist_id = getState().user.data.artist;
            artist_data.profile_image_url = artist_data.profileImageUrl;
            return save_artist_data(token, artist_id, artist_data)
                .then(parseJSON)
                .then(response => {
                    try {
                        dispatch(saveArtistDataSuccess(response));
                    } catch (e) {
                        alert(e);
                        dispatch(saveArtistDataFailure({
                            response: {
                                status: 403,
                                statusText: 'Invalid token',
                            },
                        }));
                    }
                })
                .catch(error => {
                    dispatch(saveArtistDataFailure(error));
                })

        })
    }
}
