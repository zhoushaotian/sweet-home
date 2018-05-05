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
const mail = require('../model/mail');

exports.rootPath = '/api';

/**
 * 查询昵称是否存在
 */
router.get('/nick/exit', function(req, res, next) {
    user.queryUserByNick(req.query.nick)
        .then(function(result) {
            if(result.length !== 0) {
                return res.send(tool.buildResData({
                    success: false
                }, '昵称存在'));
            }
            return res.send(tool.buildResData({
                success: true
            }));
        }).catch(next);
});
/**
 * 上传用户头像
 */
router.post('/upload/avatar', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return next(err);
        }
        res.send(tool.buildResData({
            path: `/img/${req.file.filename}`,
            success: true
        }));
    });
});
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
    user.createUser(userOpt).then(function(result) {
        req.session.userId = result.insertId;
        req.session.nick = userOpt.nick;   
        console.log('新用户注册-userId:', req.session.userId);
        res.send(tool.buildResData({
            success: true
        }));
    }).catch(next);
});
//退出登录
router.get('/exit', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            return next(err);
        }
        return res.send(tool.buildResData({
            success: true
        }, '注销成功'));
    });
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
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.queryUserById(req.session.userId)
        .then(function(result) {
            res.send(tool.buildResData({
                success: true,
                data: result
            }));
        }).catch(next);
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
    user.searchMate(req.session.userId).then(function(result) {
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

router.get('/event/delete', checkLoginMid, function(req, res, next) {
    if(!parseInt(req.query.id)) {
        let err = new Error('事件id错误');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    event.deleteEvent(parseInt(req.query.id), req.session.userId)
        .then(function(result) {
            if(result.affectedRows === 0) {
                let err = new Error('事件不存在或不是该事件的创建人');
                err.status = STATUS_CODE.API_ERROR;
                return next(err);
            }
            res.send(tool.buildResData({
                success: true
            }, '删除成功'));
        }).catch(next);
});

router.post('/mail/add', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.content) {
        let err = new Error('邮件内容不能为空');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.title) {
        let err = new Error('邮件主题不能为空');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!parseInt(req.body.sendTime)) {
        let err = new Error('邮件发送时间不正确');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.receiver) {
        let err = new Error('邮件收件人不能为空');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    mail.addMail({
        content: req.body.content,
        title: req.body.title,
        sendTime: parseInt(req.body.sendTime),
        receiver: req.body.receiver
    }, req.session.userId).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '新增成功'));
    }).catch(next);
});

router.get('/mail', checkLoginMid, function(req, res, next) {
    mail.queryMailById(req.session.userId)
        .then(function(result) {
            res.send(tool.buildResData({
                mailList: result
            }, '查询成功'));
        }).catch(next);
});
exports.router = router;

