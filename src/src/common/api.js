import axios from 'axios';

const urlMap = {
    signUp: '/api/signup',
    login: '/api/login',
    loginInfo: '/api/login-info',
    fetchEvents: '/api/events',
    addEvent: '/api/event/add',
    editEvent: '/api/event/edit'
};

export default function(url, data, method) {
    switch(method) {
    case 'get':
        return axios.get(urlMap[url], {
            params: data
        });
    case 'post':
        return axios.post(urlMap[url], data);
    default:
        return axios.get(urlMap[url], {
            params: data
        });
    }
}