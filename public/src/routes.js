/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';

import DashboardView from './components/DashboardView';
import EventsView from './components/EventsView';
import ProfileView from './components/ProfileView';
import ContentView from './components/Content/ContentView';
import ReportsView from './components/ReportsView';

import ContactView from './components/ContactView';
import ContactNewView from './components/ContactNewView';
import ContactEditView from './components/ContactEditView';
import ContactAllView from './components/ContactAllView';

import SocialView from './components/Social/SocialView';
import StorageView from './components/StorageView';
import HooksView from './components/Hook/HooksView';
import PagesView from './components/PagesView';
import NotFound from './components/NotFound';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="dashboard" component={requireAuthentication(DashboardView)} />
        <Route path="events" component={requireAuthentication(EventsView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="reports" component={requireAuthentication(ReportsView)} />
        {/* contacts routes */}
        <Route path="contacts" component={requireAuthentication(ContactView)} />
        <Route path="contacts/all" component={requireAuthentication(ContactAllView)} />
        <Route path="contacts/new" component={requireAuthentication(ContactNewView)} />
        <Route path="contacts/:id" component={requireAuthentication(ContactEditView)} />
        {/* social routes */}
        <Route path="social(/:tab)" component={requireAuthentication(SocialView)} />
        {/* content routes */}
        <Route path="content(/:tab)" component={requireAuthentication(ContentView)} />
        <Route path="storage" component={requireAuthentication(StorageView)} />
        <Route path="hooks" component={requireAuthentication(HooksView)} />
        <Route path="pages" component={requireAuthentication(PagesView)} />
        <Route path="profile" component={requireAuthentication(ProfileView)} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
