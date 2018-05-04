import fetchData from '../common/api';
import {updateFormLoading, updateTableLoading} from './modal';
import {message} from 'antd';

export const UPDATE_MAIL_LIST = 'UPDATE_MAIL_LIST';

export function updateMailList(data) {
    return {
        type: UPDATE_MAIL_LIST,
        data
    };
}
export function fetchMailList(cb) {
    return function(dispatch) {
        dispatch(updateTableLoading(true));
        fetchData('getMail')
            .then(function(res) {
                dispatch(updateTableLoading(false));
                dispatch(updateMailList(res.data.data.mailList));
                cb();
            }).catch(function(err) {
                dispatch(updateTableLoading(false));
                message.error(err.message);
            });
    };
}

export function addMail(data, cb) {
    return function(dispatch) {
        dispatch(updateFormLoading(true));
        fetchData('addMail', data, 'post')
            .then(function(res) {
                dispatch(updateFormLoading(false));
                if(!res.data.data.success) {
                    return message.error(res.data.msg);
                }
                cb();
                return message.success('寄信成功');
            }).catch(function(err) {
                dispatch(updateFormLoading(false));
                message.error(err.message);
            });
    };
}