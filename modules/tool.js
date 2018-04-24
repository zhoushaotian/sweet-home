'use strict';
const STATUS_CODE = require('../enums/status');

exports.buildResData = function(data, msg) {
    let res = Object.create(null);
    res.status = STATUS_CODE.SUCCESS;
    res.msg = msg;
    res.data = data;
    console.log('发送数据:', JSON.stringify(res));
    return res;
};

exports.buildUserSession = function(user, req) {
    req.session.userId = user.userId;
    req.session.nick = user.nick;
    req.session.avatar = user.avatar;
    req.session.sex = user.sex;
    req.session.bio = user.bio;
};

