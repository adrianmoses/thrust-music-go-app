import * as constants from '../constants';
import { parseJSON } from '../utils/misc';
import { get_contact_data, get_contacts_list, get_contacts_overview, save_contact_data } from '../utils/http_functions';

export function saveContactDataRequest() {
    return {
        type: SAVE_CONTACT_DATA_REQUEST,
    };
}

export function saveContactDataSuccess(data) {
    return {
        type: CONTACT_DATA_SUCCESS,
        payload: {
            data
        },
    };
}

export function saveContactDataFailure(res) {
    return {
        type: CONTACT_DATA_FAILURE,
        payload: {
            status: res.status,
            statusText: res.error,
        },
    };
}

export function receiveContactData(data) {
    return {
        type: RECEIVE_CONTACT_DATA,
        payload: {
            data,
        }
    };
}

export function fetchContactDataRequest() {
    return {
        type: FETCH_CONTACT_DATA_REQUEST,
    };
}

export function fetchContactDataFailure(error) {
    return {
        type: CONTACT_DATA_FAILURE,
        payload: {
            status: error.status,
            statusText: error.statusText,
        },
    };
}

export function createEmptyContact() {
    return {
        type: CONTACT_DATA_NEW,
        payload: {
            data: {
                name: '',
                email: '',
                links: '',
                source: '',
                notes: '',
            }
        },
    };
}

export function changeContactData(data) {
    return {
        type: CONTACT_DATA_SUCCESS,
        payload: {
            data
        },
    };
}

export function fetchContactData(token, contact_id) {
    return (dispatch) => {
        dispatch(fetchContactDataRequest());
        get_contact_data(token, contact_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveContactData(response));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchContactDataFailure(error))
                }
            })
    }
}

export function fetchAllContactData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchContactDataRequest());
        get_contacts_list(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveContactData(response));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchContactDataFailure(error))
                }
            })
    }
}

export function fetchOverviewContactData(token, artist_id) {
    return (dispatch) => {
        dispatch(fetchContactDataRequest());
        get_contacts_overview(token, artist_id)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveContactData(response));
            })
            .catch(error => {
                if (error) {
                    dispatch(fetchContactDataFailure(error))
                }
            })
    }
}

export function saveNewContactWithData(token, contactData) {
    return (dispatch, getState) => {
        dispatch(saveContactDataRequest());
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().data.data.artist;
            contactData.artist_id = artist_id;
            save_contact_data(token, null, contactData)
                .then(parseJSON)
                .then(response => {
                    try {
                        dispatch(saveContactDataSuccess(response));
                        console.log("[/api/contacts/new]response", response);
                        // redirectToRoute(`/contacts/${response.id}`);
                        browserHistory.push('/contacts/'+response.id);

                    } catch (e) {
                        alert(e);
                        dispatch(saveContactDataFailure({
                            response: {
                                status: 403,
                                statusText: 'Invalid token',
                            },
                        }));
                    }
                })
                .catch(error => {
                    dispatch(saveContactDataFailure(error));
                })
        })
    }
}

export function saveContactData(token, contactId, contactData) {
    return (dispatch, getState) => {
        dispatch(saveContactDataRequest());
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().data.data.artist;
            contactData.artist_id = artist_id;
            save_contact_data(token, contactId, contactData)
                .then(parseJSON)
                .then(response => {
                    try {
                        dispatch(saveContactDataSuccess(response));
                    } catch (e) {
                        alert(e);
                        dispatch(saveContactDataFailure({
                            response: {
                                status: 403,
                                statusText: 'Invalid token',
                            },
                        }));
                    }
                })
                .catch(error => {
                    dispatch(saveContactDataFailure(error));
                })
        })
    }
}

export function fetchUserAndAllContactData(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().data.data.artist;
            return dispatch(fetchAllContactData(token, artist_id));
        })
    }
}

export function fetchUserAndOverviewContactData(token) {
    return (dispatch, getState) => {
        return dispatch(fetchUserData(token)).then(() => {
            const artist_id = getState().data.data.artist;
            return dispatch(fetchOverviewContactData(token, artist_id));
        })
    }
}