/**
 * 用户接口
 */
'use strict';
const STATUS_CODES = require('../enums/status');
const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOpt;
const pool = mysql.createPool(mysqlOptions);

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
            pool.query('insert into user (userName, passwd, nick, sex, bio, createdTime) values (?,?,?,?,?,?)', [userOpts.userName, userOpts.passwd, userOpts.nick, userOpts.sex, userOpts.bio, userOpts.time], function(err) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};

module.exports.searchMate = function(nick) {
    return new Promise(function(resolve, reject) {
        pool.query('select userId from user where nick = ?', [nick], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.setMate = function(userId, mateId) {
    return new Promise(function(resolve, reject) {
        pool.query('update user set mate = ? where userId = ?', [mateId, userId], function(err) {
            if(err) {
                return reject(err);
            }
            return resolve();
        });
    });
};
