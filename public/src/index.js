import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

//import routes from './routes';
import Page from './containers/Page';
// import EmptyLayout from './containers/EmptyLayout';

import './style.scss';

ReactDOM.render(
    <Router>
        <Switch>
            <Redirect exact path="/" to="/pages"/>
            <Route path="/pages" component={Page} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
