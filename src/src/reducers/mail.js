import {UPDATE_MAIL_LIST} from '../actions/mail';

const INIT_STATE = {
    mailList: []
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_MAIL_LIST:
        return Object.assign({}, state, {
            mailList: action.data
        });
    default:
        return state;
    }
}