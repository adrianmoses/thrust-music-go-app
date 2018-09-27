import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, Redirect, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import routes from './routes';
import Page from './containers/Page';
import EmptyLayout from './containers/EmptyLayout';

import './style.scss';


injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="dashboard" />
            <Route component={EmptyLayout}>
              <Route path="/pages/edit(/:id)" component={Page} />
            </Route>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('root')
);
