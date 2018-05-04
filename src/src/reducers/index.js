import {combineReducers } from 'redux';

import modal from './modal';
import user from './user';
import events from './events';
import mail from './mail';
const appReducer = combineReducers({
    modal,
    user,
    events,
    mail
});

export default appReducer;