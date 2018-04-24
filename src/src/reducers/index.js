import {combineReducers } from 'redux';

import modal from './modal';
import user from './user';
import events from './events';

const appReducer = combineReducers({
    modal,
    user,
    events
});

export default appReducer;