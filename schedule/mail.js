'use strict';
// 邮件定时任务,每小时遍历数据库的邮件表，若有邮件则发送
const mail = require('../model/mail');
const sendMail = require('../modules/mail');
const moment = require('moment');
module.exports = {
    sendMail: function() {
        setInterval(function() {
            let curTime = new moment().set({
                'millisecond': 0,
                'second': 0,
            }).valueOf();
            console.log(`${new moment(curTime).format('YYYY-MM-DD HH:mm:ss')}开始检查邮件表`);
            mail.queryMailByTime(curTime)
                .then(function(res) {
                    if(res.length === 0) {
                        return console.log('未查询到邮件需要发送');
                    }
                    let successNum = 0;
                    res.forEach(function(mailItem, index) {
                        sendMail(mailItem.receiver, mailItem.title, mailItem.content)
                            .then(function() {
                                console.log(`ID为${mailItem.mailId}的邮件发送成功`);
                                successNum++;
                                mail.sendMail(mailItem.mailId);
                                if(index === res.length - 1) {
                                    console.log(`${new moment(curTime).format('YYYY-MM-DD HH:mm:ss')}成功发出${successNum}封邮件`);
                                }
                            }).catch(function(err) {
                                console.log('发送邮件错误', err);
                                if(index === res.length - 1) {
                                    console.log(`${new moment(curTime).format('YYYY-MM-DD HH:mm:ss')}成功发出${successNum}封邮件`);
                                }
                            });
                    });
                }).catch(function(err) {
                    console.log('查询邮件错误', err);
                });
        }, 1000 * 60);
    }
};

