'use strict';
const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOpt;
const pool = mysql.createPool(mysqlOptions);


module.exports.queryMailById = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from mail where createBy = ? ', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.addMail = function(mailOpt, userId) {
    return new Promise(function(resolve, reject) {
        pool.query('insert into mail (sendTime, title, content, receiver, createBy, isSend) values (?,?,?,?,?,0)', [mailOpt.sendTime, mailOpt.title, mailOpt.content, mailOpt.receiver, userId], function(err) {
            if(err) {
                return reject(err);
            }
            resolve();
        });
    });
};

/**
 * 
 * @param {Number} time 时间字符串
 */
module.exports.queryMailByTime = function(time) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from mail where sendTime = ? and isSend = 0', [time], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
/**
 * 邮件发送成功之后将邮件标记为已发送
 * @param {number} mailId 邮件id
 */
module.exports.sendMail = function (mailId) {
    return new Promise(function(resolve, reject) {
        pool.query('update mail set isSend = 1 where mailId = ?', [mailId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};