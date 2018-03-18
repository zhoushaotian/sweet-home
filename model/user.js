/**
 * 用户接口
 */
'use strict';

const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);

module.exports.queryUserByName = function(userName) {
    return new Promise(function(resolve, reject) {
        pool.query('select count(*) from user where userName = ?', [userName], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result[0]['count(*)'])
        })
    })
}
module.exports.createUser = function(userOpts) {
    return new Promise(function(resolve, reject) {
        let userName = userOpts.userName;
        pool.query('select count(*) from user where userName = ?', [userName], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result[0]['count(*)'])
        })
    }).then(function(count) {
        if(count !== 0) {
            return Promise.reject(count);
        }
        return new Promise(function(resolve, reject) {
            pool.query('insert into user (userName, passwd, nick, sex, bio) values (?,?,?,?,?)', [userOpts.userName, userOpts.passwd, userOpts.nick, userOpts.sex,userOpts.bio], function(err, result) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            })
        })
    })
}

module.exports.searchMate = function(nick) {
    return new Promise(function(resolve, reject) {
        pool.query('select userId from user where nick = ?', [nick], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result)
        })
    })
}

module.exports.setMate = function(userId, mateId) {
    return new Promise(function(resolve, reject) {
        pool.query('update user set mate = ? where userId = ?',[mateId, userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve();
        })
    })
}
