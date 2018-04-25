import {UPDATE_USER_INFO, CLEAN_USER_INFO} from '../actions/user';
const INIT_STATE = {
    userInfo: {},
    mate: {}
};

export default function(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_USER_INFO:
        return Object.assign({}, state, {
            userInfo: action.data.user,
            mate: action.data.mate
        });
    case CLEAN_USER_INFO:
        return {
            info: {}
        };
    default:
        return state;
    }
}