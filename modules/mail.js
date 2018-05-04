'use strict';

const nodeMailer = require('nodemailer');
const mailOpt = require('../config/server').mail;
const transport = nodeMailer.createTransport(mailOpt);

module.exports = function (receive, sub, content) {
    return new Promise(function(resolve, reject) {
        transport.sendMail({
            from: mailOpt.auth.user,
            to: receive,
            subject: sub,
            html: content 
        }, function(err, info) {
            if(err) {
                return reject(err);
            }
            return resolve(info);
        });
    });
};