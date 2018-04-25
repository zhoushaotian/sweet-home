'use strict';

const STATUS_CODE = require('../enums/status');

module.exports.checkLogin = function(req, res, next) {
    if(!req.session.userId) {
        let err = new Error('没有登录');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }    
    return next();
};
