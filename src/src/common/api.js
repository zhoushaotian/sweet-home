import axios from 'axios';

const urlMap = {
    signUp: '/api/signup',
    login: '/api/login',
    loginInfo: '/api/login-info',
    fetchEvents: '/api/events',
    addEvent: '/api/event/add',
    deleteEvent: '/api/event/delete',
    editEvent: '/api/event/edit',
    searchMate: '/api/mate/search',
    nickExit: '/api/nick/exit',
    setMate: '/api/mate/set'
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