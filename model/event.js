/**
 * 事件接口
 */
'use strict';
const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);

module.exports.getEvent = function (id) {
    return new Promise(function (resolve, reject) {
        pool.query('select * from event where userId = ?', [id], function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}
/**
 * 为一个事件添加资源
 * 
 */
module.exports.addSource = function (type, url, eventId, time) {
    return new Promise(function(resolve, reject) {
        pool.query('insert into source_map (type, url, eventId, time) values(?,?,?,?,?)', [type, url, eventId, time], function(err) {
            if(err) {
                return reject(err);
            }
            return resolve();
        })
    })
}

module.exports.addEvent = function (userId, event) {
    return new Promise(function (resolve, reject) {
        pool.query('insert into event (time, title, detail, createdBy, level) values (?,?,?,?,?)', [event.time, event.title, event.detail, event.createdBy, event.level], function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        })
    })
}

