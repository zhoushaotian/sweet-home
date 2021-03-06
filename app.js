'use strict';
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./controller/routes');
const handleErrorMid = require('./middlewares/handleError');
const preLogMid = require('./middlewares/log').preLog;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const schedule = require('./schedule/mail');

const serverConfig = require('./config/server');

// 开启定时任务
Object.keys(schedule).forEach(function(jobName) {
    console.log(`开启定时任务${jobName}`);
    schedule[jobName]();
});
// 设置模板目录  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 静态文件
app.use(express.static(path.join(__dirname, '/public')));

// redis 
app.use(session({
    store: new RedisStore(serverConfig.redisOption),
    name: 'musiclogin',
    secret: 'test',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 500000000
    }
}));
//访问记录
app.use(preLogMid);

routes(app);
// 错误处理
app.use(handleErrorMid);

app.listen('3001', function() {
    console.log('server is running at 3001');
});


