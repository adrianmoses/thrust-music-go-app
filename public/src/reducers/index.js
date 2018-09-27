import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import user from './user';
import artist from './artist';
import social from './social';
import contact from './contact';
import storage from './storage';
import page from './page';
import hook from './hook'

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    user,
    artist,
    social,
    contact,
    storage,
    hook,
    page
});

export default rootReducer;
