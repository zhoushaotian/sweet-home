import fetchData from '../common/api';
import {message} from 'antd';
import {updateTableLoading, updateFormLoading} from './modal';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const CLEAN_USER_INFO = 'CLEAN_USER_INFO';

export function updateUserInfo(data) {
    return {
        type: UPDATE_USER_INFO,
        data
    };
}
export function cleanUserInfo() {
    return {
        type: CLEAN_USER_INFO
    };
}
export function userLogin(data) {
    return function(dispatch) {
        dispatch(updateFormLoading(true));
        fetchData('login', data, 'post')
            .then(function(res) {
                if(!res.data.data.success) {
                    message.error(res.data.msg);
                    return dispatch(updateFormLoading(false));
                }
                message.success('登录成功');
            }).catch(function(err) {
                message.error(err.message);
            });
    };
}
export function userSignUp(data) {
    return function(dispatch) {
        dispatch(updateFormLoading(true));
        fetchData('signUp', data, 'post')
            .then(function(res) {
                if(!res.data.data.success) {
                    message.error(res.data.msg);
                    return dispatch(updateFormLoading(false));
                }
                message.success('注册成功');
            }).catch(function(err) {
                message.error(err.message);
            });
    };
}
export function fetchUserInfo() {
    return function(dispatch) {
        dispatch(updateTableLoading(true));
        fetchData('loginInfo')
            .then(function(res) {
                dispatch(updateTableLoading(false));
                dispatch(updateUserInfo(res.data.data));
            }).catch(function(err) {
                dispatch(updateTableLoading(false));
                message.error(err.message);
            });
    };
}
