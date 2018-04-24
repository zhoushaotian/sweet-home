'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const uuidv1 = require('uuid/v1');
const multer = require('multer');
const tool = require('../modules/tool');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('public', 'img'));
    },
    filename: function (req, file, cb) {
        cb(null, uuidv1() + '.' + 'jpg');
    }
});
const upload = multer({ storage }).single('img');
const path = require('path');
const STATUS_CODE = require('../enums/status');
const checkLoginMid = require('../middlewares/check').checkLogin;

const user = require('../model/user');
const event = require('../model/event');

exports.rootPath = '/api';

/**
 * 注册用户
 */
router.post('/signup', bodyParser.json(), function (req, res, next) {
    if (!req.body.userName) {
        let err = new Error('缺少用户名');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (!req.body.passwd) {
        let err = new Error('缺少密码');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (!req.body.nick) {
        let err = new Error('缺少昵称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(Number.isNaN(parseInt(req.body.sex))) {
        let err = new Error('缺少性别');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let userOpt = {
        userName: req.body.userName,
        passwd: sha1(req.body.passwd),
        nick: req.body.nick,
        sex: req.body.sex,
        time: new Date().getTime()
    };
    user.createUser(userOpt).then(function() {
        res.send(tool.buildResData({
            success: true
        }));
    }).catch(next);
});
// 用户登录
router.post('/login', bodyParser.json(), function(req, res, next) {
    function login() {
        if(!req.body.userName) {
            let err = new Error('缺少用户名');
            err.status = STATUS_CODE.API_ERROR;
            return next(err);
        }
        if(!req.body.passwd) {
            let err = new Error('缺少密码');
            err.status = STATUS_CODE.API_ERROR;
            return next(err);
        }
        user.queryUserByName(req.body.userName, sha1(req.body.passwd)).then(function(result) {
            if(result.length === 0) {
                return res.send(tool.buildResData({
                    success: false
                }, '用户名不存在或密码错误'));
            }
            let user = result[0];
            // 写session
            tool.buildUserSession(user, req);
            res.send(tool. buildResData({
                success: true
            }, '登录成功'));
        }).catch(next);
    }
    // 先清空之前的session
    if(req.session.userId) {
        req.session.regenerate(function(err) {
            if(err) {
                return res.send(tool.buildResData({
                    success: false
                }, '登录失败'));
            }
            login();
        });
    }else {
        login();
    }
});
// 查询登录状态
router.get('/login-info', function(req, res, next) {
    if(!req.session.userId) {
        let err = new Error('未登录');
        err.status = STATUS_CODE.NO_PERMISSION;
        return next(err);
    }
    res.send(tool.buildResData({
        nick: req.session.nick,
        avatar: req.session.avatar,
        sex: req.session.sex,
        bio: req.session.bio
    }, '获取登录状态成功'));
});
/**
 * 用户注销
 */
router.get('/cancel', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.send(tool.buildResData({
                succcess: false
            }, '注销失败'));
        }
        return res.send(tool.buildResData({
            success: true
        }, '注销成功'));
    });
});
/**
 * 搜索mate
 */
router.get('/mate/search', checkLoginMid, function(req, res, next) {
    if(!req.query.nickName) {
        let err = new Error('缺少搜索关键词');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.searchMate(req.query.nickName).then(function(result) {
        res.send(tool.buildResData(result, '获取mate数据成功'));
    }).catch(next);
});

/**
 * 设置mate
 */
router.get('/mate/set', checkLoginMid, function(req, res, next) {
    if(!parseInt(req.query.mateId)) {
        let err = new Error('缺少mateid');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.setMate(req.session.userId, parseInt(req.query.mateId)).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '设置mate成功'));
    }).catch(next);
});

router.get('/events', checkLoginMid, function(req, res, next) {
    event.getEvents(req.session.userId)
        .then(function(result) {
            res.send(tool.buildResData({
                success: true,
                events: result
            }));
        }).catch(next);
});
/**
 * 添加一个事件
 */
router.post('/event/add', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.title) {
        let err = new Error('缺少事件名称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.detail) {
        let err = new Error('缺少事件描述');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.level) {
        let err = new Error('缺少事件级别');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.time) {
        let err = new Error('缺少事件时间');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    event.addEvent(req.session.userId, {
        title: req.body.title,
        detail: req.body.detail,
        level: req.body.level,
        time: req.body.time
    }).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '添加事件成功'));
    }).catch(next);
});
/**
 * 修改事件
 */
router.post('/event/edit', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!parseInt(req.body.id)) {
        let err = new Error('事件id不正确');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.title) {
        let err = new Error('缺少事件名称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.detail) {
        let err = new Error('缺少事件描述');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.level) {
        let err = new Error('缺少事件级别');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    event.editEvent(req.session.userId, {
        id: parseInt(req.body.id),
        title: req.body.title,
        detail: req.body.detail,
        level: req.body.level
    }).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '修改成功'));
    }).catch(next);
});

exports.router = router;

