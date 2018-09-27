/* eslint camelcase: 0 */
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http'

if(process.env.NODE_ENV && process.env.NODE_ENV === 'test'){
    axios.defaults.baseURL = 'http://test.thrust.fm'
    axios.defaults.adapter = httpAdapter;
}

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password) {
    return axios.post('/api/create_user', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

// artist routes
export function get_artist_data(token, artist_id) {
    return axios.get(`/api/artists/${artist_id}`, tokenConfig(token));
}

export function save_artist_data(token, artist_id, data) {
    return axios.post(`/api/artists/${artist_id}`, 
        Object.assign({}, data, tokenConfig(token))
    );
}

// contact routes
export function get_contact_data(token, contact_id) {
    return axios.get(`/api/contacts/${contact_id}`, tokenConfig(token));
}

export function get_contacts_list(token, artist_id) {
    return axios.get('/api/contacts/list', 
            Object.assign({}, {
                params: {
                    artist_id: artist_id
                }
            }, tokenConfig(token))
    );
}

export function get_contacts_overview(token, artist_id) {
    return axios.get('/api/contacts/overview',
            Object.assign({}, {
                artist_id: artist_id
            }, tokenConfig(token))
    );
}

export function save_contact_data(token, contact_id, data) {
    if (contact_id === null) {
        return axios.post(`/api/contacts/new`, 
            Object.assign({}, data, tokenConfig(token))
        );

    } else {
        return axios.post(`/api/contacts/${contact_id}`, 
            Object.assign({}, data, tokenConfig(token))
        );

    }
}

export function get_social_data(token, social_id) {
    return axios.get(`/api/social/${social_id}`, tokenConfig(token));
}
export function get_all_social_data(token, artist_id) {
    return axios.get(`/api/social/all/${artist_id}`, tokenConfig(token));
}
export function get_sent_social_data(token, artist_id, provider) {
    return axios.get(`/api/social/sent/${artist_id}/${provider}`, tokenConfig(token));
}
export function get_queued_social_data(token, artist_id, provider) {
    return axios.get(`/api/social/queued/${artist_id}/${provider}`, tokenConfig(token));
}

// storage
export function get_storage_data(token, artist_id) {
    return axios.get(`/api/storage/${artist_id}`, tokenConfig(token));
}

export function connect_storage_provider(token, provider) {
    return axios.get(`/api/storage/${provider}/authorize`, tokenConfig(token)) 
}

// hook functions
export function get_hook_data(token, artist_id, hook_id) {
    return axios.get(`/api/hook/${artist_id}/${hook_id}`, tokenConfig(token));
}

export function delete_hook_data(token, artist_id, hook_id) {
    return axios.delete(`/api/hook/${artist_id}/${hook_id}`, tokenConfig(token));
}

export function get_all_hook_data(token, artist_id) {
    return axios.get(`/api/hook/${artist_id}`, tokenConfig(token));
}

export function save_hook_data(token, artist_id, hook_id, data) {
    if (hook_id === null) {
        return axios.post(`/api/hook/${artist_id}/new`, 
            Object.assign({}, data),
            tokenConfig(token)
        );

    } else {
        return axios.post(`/api/hook/${artist_id}/${hook_id}`, 
            Object.assign({}, data),
            tokenConfig(token)
        );

    }
}

export function choose_facebook_page(token, pageId, accessToken, pageName) {
    return axios.post('/api/social/facebook/choose_page', {
            id: pageId,
            access_token: accessToken, 
            name: name
        }, tokenConfig(token)
    )
}
