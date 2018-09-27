import * as constants from '../constants';
import { parseJSON } from '../utils/misc';
import { get_hook_data, get_all_hook_data, 
         save_hook_data, delete_hook_data } from '../utils/http_functions';
import { fetchUserData } from './user';

export function receiveHookData(data) {

    console.log(data);
    var options = {
        triggers: [
              {
                name: "youtube",
                social: "youtube-icon",
                stmt: "a video is uploaded to youtube"
              },
        ],
        actions: [
              {
                name: "twitter",
                social: "twitter-icon",
                stmt: "send a tweet"
              },
              {
                name: "facebook",
                social: "facebook-icon",
                stmt: "send a facebook post"
              },
        ]

    }

    let activeTrigger = _.find(options.triggers, function(o) {
        return o.name == data.trigger
    })

    let activeAction = _.find(options.actions, function(o) {
        return o.name == data.action
    })

    return {
        type: constants.RECEIVE_HOOK_DATA,
        payload: {
            data: {
                ID: data.ID,
                activeAction: activeAction,
                activeTrigger: activeTrigger,
                hookStatus: data.is_active,
                triggers: options.triggers,
                actions: options.actions,
                statement: data.statement,
                message: data.message
            }
        }
    };
}

export function receiveAllHookData(data) {
    return {
        type: constants.RECEIVE_ALL_HOOK_DATA,
        payload: {
            data,
        }
    }
}

export function deleteHookDataSuccess(id) {
   return {
        type: constants.HOOK_DELETE_SUCCESS,
        payload: {
            id,
        }
    };
}

export function fetchHookDataRequest() {
   return {
        type: constants.FETCH_HOOK_DATA_REQUEST,
    };
}

export function fetchHookDataFailure(error) {
    return {
        type: constants.HOOK_DATA_FAILURE,
        payload: {
            status: 500,
            statusText: error.toString(),
        },
    };
}

export function saveHookDataRequest() {
    return {
        type: constants.SAVE_HOOK_DATA_REQUEST,
    }
}

export function saveHookDataSuccess(data) {
    return {
        type: constants.HOOK_DATA_SUCCESS,
        payload: {
            data,
        }
    }
}

export function saveHookDataFailure(error) {
    return {
        type: constants.HOOK_DATA_FAILURE,
        payload: {
            status: error.status,
            statusText: error.statusText,
        }
    }
}

export function createEmptyHook() {
   return {
        type: constants.HOOK_DATA_NEW,
        payload: {
            data: {
                activeTrigger: {
                        name: "youtube",
                        social: "youtube-icon",
                        stmt: "a video is uploaded to youtube"
                },
                activeAction: {
                        name: "twitter",
                        social: "twitter-icon",
                        stmt: "send a tweet"
                },
                hookStatus: true,
                triggers: [
                      {
                        name: "youtube",
                        social: "youtube-icon",
                        stmt: "a video is uploaded to youtube"
                      },
                ],
                actions: [
                      {
                        name: "twitter",
                        social: "twitter-icon",
                        stmt: "send a tweet"
                      },
                      {
                        name: "facebook",
                        social: "facebook-icon",
                        stmt: "send a facebook post"
                      },
                ],
                statement: "Send a tweet when a video is uploaded to youtube",
                message: "{{Title}}, {{Description}} {{URL}} "
            }
        }
   } 
}

export function changeHookData(data) {
    return {
        type: constants.HOOK_DATA_SUCCESS,
        payload: {
            data
        },
    };
}

export function fetchAllHookData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchHookDataRequest());
        return get_all_hook_data(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveAllHookData(response));
            })
            .catch(error => {
                if (error) dispatch(fetchHookDataFailure(error));
            })
    }
}

export function fetchHookData(token, artist_id, hook_id) {
    return (dispatch) => {
        dispatch(fetchHookDataRequest());
        return get_hook_data(token, artist_id, hook_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveHookData(response));
            })
            .catch(error => {
                if (error) dispatch(fetchHookDataFailure(error));
            })
    }
}

export function fetchUserAndHookData(token, hook_id) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchHookData(token, artist_id, hook_id));
        })
    }
}

export function fetchUserAndAllHookData(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            return dispatch(fetchAllHookData(token, artist_id));
        })
    }
}

export function saveNewHookWithData(token, hookData) {
    return (dispatch, getState) => {
        dispatch(saveHookDataRequest());
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            hookData.artist_id = artist_id;
            save_hook_data(token, artist_id, null, hookData)
                .then(parseJSON)
                .then(response => {
                    try {
                        dispatch(saveHookDataSuccess(response));
                    } catch (e) {
                        alert(e);
                        dispatch(saveHookDataFailure({
                                status: 403,
                                statusText: 'Invalid token',
                            },
                        ));
                    }
                })
                .catch(error => {
                    dispatch(saveHookDataFailure({
                        status: 500,
                        statusText: error.toString()
                    }));
                })
        })
    }
}

export function saveHookData(token, hook_id, hookData) {
    return (dispatch, getState) => {
        dispatch(saveHookDataRequest());
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            hookData.artist_id = artist_id;
            save_hook_data(token, artist_id, hook_id, hookData)
                .then(parseJSON)
                .then(response => {
                    try {
                        dispatch(saveHookDataSuccess(response));
                    } catch (e) {
                        alert(e);
                        dispatch(saveHookDataFailure({
                            status: 403,
                            statusText: 'Invalid token',
                        }));
                    }
                })
                .catch(error => {
                    dispatch(saveHookDataFailure({
                        status: 500,
                        statusText: error.toString()
                    }));
                })
        })
    }
}


export function deleteHookData(token, hook_id) {
    return (dispatch, getState) => {
        dispatch(fetchHookDataRequest());
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().user.data.artist;
            delete_hook_data(token, artist_id, hook_id)
                .then(parseJSON)
                .then(response => {
                    dispatch(deleteHookDataSuccess(response.id));
                })
                .catch(error => {
                    if (error) dispatch(fetchHookDataFailure(error));
                })
            })
    }
}