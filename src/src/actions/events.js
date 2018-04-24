import fetchData from '../common/api';
import {updateFormLoading, updateTableLoading} from './modal';
import {message} from 'antd';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const UPDATE_CUR_TIME = 'UPDATE_CUR_TIME';


export function updateCurTime(data) {
    return {
        type: UPDATE_CUR_TIME,
        data
    };
}
export function updateEvents(data) {
    return {
        type: UPDATE_EVENTS,
        data
    };
}

export function editEvent(data, cb) {
    return function(dispatch) {
        dispatch(updateFormLoading(true));
        fetchData('editEvent', data, 'post')
            .then(function(res) {
                dispatch(updateFormLoading(false));
                if(!res.data.data.success) {
                    return message.error(res.data.msg);
                }
                cb();
                dispatch(fetchEvents());
                message.success(res.data.msg);
            }).catch(function(err) {
                dispatch(updateFormLoading(false));
                message.error(err.message);
            });
    };
}
export function fetchEvents() {
    return function(dispatch) {
        dispatch(updateTableLoading(true));
        fetchData('fetchEvents')
            .then(function(res) {
                dispatch(updateTableLoading(false));
                if(!res.data.data.success) {
                    return message.error(res.data.msg);
                }
                return dispatch(updateEvents(res.data.data.events));
            }).catch(function(err) {
                dispatch(updateTableLoading(false));
                return message.error(err.message);
            });
    };
}

export function addEvent(data, cb) {
    return function(dispatch) {
        dispatch(updateFormLoading(true));
        fetchData('addEvent', data, 'post')
            .then(function(res) {
                dispatch(updateFormLoading(false));
                if(!res.data.data.success) {
                    return message.error(res.data.msg);
                }
                cb();
                message.success('添加事件成功');
                return dispatch(fetchEvents());
            }).catch(function(err) {
                dispatch(updateFormLoading(false));
                return message.error(err.message);
            });
    };
}