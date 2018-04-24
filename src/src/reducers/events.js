import {UPDATE_EVENTS, UPDATE_CUR_TIME} from '../actions/events';
import moment from 'moment';

const INIT_STATE = {
    events: [],
    curEvents: [],
    curTime: new moment()
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_CUR_TIME:
        return Object.assign({}, state, {
            curTime: action.data
        });
    case UPDATE_EVENTS:
        return Object.assign({}, state, {
            events: action.data
        });
    default:
        return state;
    }
}