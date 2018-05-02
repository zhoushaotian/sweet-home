/**
 * 事件接口
 */
'use strict';
const mysql = require('mysql');
const mysqlOptions = require('../config/server').mysqlOpt;
const pool = mysql.createPool(mysqlOptions);
const STATUS_CODE = require('../enums/status');

module.exports.getEvents = function (id) {
    return new Promise(function (resolve, reject) {
        pool.query('select * from event where createdBy = ? or mate = ?', [id, id], function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
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
        });
    });
};

module.exports.addEvent = function (userId, event) {
    return new Promise(function (resolve, reject) {
        // 先查一个user的mate
        pool.query('select mate from user where userId = ?', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            if(result[0].mate) {
                return resolve(result[0].mate);
            }
            return resolve();
        });
    }).then(function(mateId) {
        let mate = mateId ? mateId : 0;
        return new Promise(function(resolve, reject) {
            pool.query('insert into event (time, title, detail, createdBy, level, mate) values (?,?,?,?,?,?)', [event.time, event.title, event.detail, userId, event.level, mate], function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};

module.exports.editEvent = function (userId, event) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from event where eventId = ?', [event.id], function(err, result) {
            if(err) {
                return reject(err);
            }
            if(result.length === 0) {
                let err = new Error('事件不存在');
                err.status = STATUS_CODE.API_ERROR;
                return reject(err);
            }
            if(result[0].createdBy !== userId && result[0].mate !== userId) {
                let err = new Error('没有权限');
                err.status = STATUS_CODE.NO_PERMISSION;
                return reject(err);
            }
            resolve();
        });
    }).then(function() {
        return new Promise(function(resolve, reject) {
            pool.query('update event set title=?,detail=?,level=? where eventId=?', [event.title, event.detail, event.level, event.id], function(err) {
                if(err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
};

module.exports.deleteEvent = function(id, userId) {
    return new Promise(function(resolve, reject) {
        pool.query('delete from event where createdBy = ? and eventId = ? or mate = ? and eventId = ?', [userId, id, userId, id], function(err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};




