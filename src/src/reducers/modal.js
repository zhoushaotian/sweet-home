import {UPDATE_FORM_LOADING, UPDATE_TABLE_LOADING} from '../actions/modal';
const INIT_STATE = {
    tableLoading: false,
    formLoading: false
};

export default function(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_FORM_LOADING:
        return Object.assign({}, state, {
            formLoading: action.data
        });
    case UPDATE_TABLE_LOADING:
        return Object.assign({}, state, {
            tableLoading: action.data
        });
    default:
        return state;
    }
}