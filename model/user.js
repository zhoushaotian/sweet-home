/**
 * 用户接口
 */
'use strict';
const STATUS_CODES = require('../enums/status');
const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOpt;
const pool = mysql.createPool(mysqlOptions);

module.exports.queryUserByUserName = function(name) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where userName=?', [name], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.queryUserByNick = function(nick) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where nick=?', [nick], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.queryUserById = function(id) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where userId=?', [id], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    }).then(function(result) {
        if(result.length === 0) {
            return Promise.resolve({
                user: {},
                mate: null
            });
        }
        delete result[0].userName;
        delete result[0].passwd;
        delete result[0].userId;
        if(!result[0].mate) {
            return Promise.resolve({
                user: result[0],
                mate: null
            });
        }
        // 查询mate信息
        return new Promise(function(resolve, reject) {
            pool.query('select * from user where userId = ?', [result[0].mate], function(err, mateResult) {
                if(err) {
                    return reject(err);
                }
                delete mateResult.userName;
                delete mateResult.passwd;
                return resolve({
                    user: result[0],
                    mate: mateResult[0]
                });
            });
        });
    });
};
module.exports.queryUserByName = function(userName, passwd) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where userName = ? and passwd = ?', [userName, passwd], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
module.exports.createUser = function(userOpts) {
    return new Promise(function(resolve, reject) {
        let userName = userOpts.userName;
        pool.query('select count(*) from user where userName = ?', [userName], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result[0]['count(*)']);
        });
    }).then(function(count) {
        if(count !== 0) {
            let err = new Error('用户名已存在');
            err.status = STATUS_CODES.API_ERROR;
            return Promise.reject(err);
        }
        return new Promise(function(resolve, reject) {
            pool.query('insert into user (userName, passwd, nick, sex, bio, createdTime, vertifyCode, avatar) values (?,?,?,?,?,?,?,?)', [userOpts.userName, userOpts.passwd, userOpts.nick, userOpts.sex, userOpts.bio, userOpts.time, userOpts.code, userOpts.avatar], function(err, result) {
                if(err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
};

module.exports.searchMate = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select nick, userId from user where userId != ? and mate = 0', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.setMate = function(userId, mateId, code) {
    return new Promise(function(resolve, reject) {
        pool.query('select vertifyCode from user where userId = ?', [mateId], function(err, result) {
            if(err) {
                return reject(err);
            }
            if(code !== result[0].vertifyCode) {
                let err = new Error('验证码错误');
                err.status = STATUS_CODES.API_ERROR;
                return reject(err);
            }
            return resolve();
        });
    }).then(function() {
        return new Promise(function(resolve, reject) {
            pool.query('update user set mate = ? where userId = ?', [mateId, userId], function(err) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }).then(function() {
        return new Promise(function (resolve, reject) {
            pool.query('update user set mate = ? where userId = ?', [userId, mateId], function(err) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};

module.exports.queryCode = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select vertifyCode from user where userId = ?', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
