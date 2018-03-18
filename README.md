# sweet-home
一个记录恋爱心事的web app，主要功能:
- 定时任务: 在某个时间发送未来的邮件 
- 主页是日历形式，左侧展示时间，右侧展示记录的事情，日期的显示会根据当天的心情渲染不同的颜色
- 账号的注册与登录  
## 项目结构
```
├── README.md
├── config/    配置文件目录
├── controller/  路由
├── enums/  枚举目录
├── middlewares/ 中间件
├── model/  数据接口层
├── modules/ 公共方法
├── public/ 静态目录
├── src/  前端源文件
└── views/ 视图层
```
## 数据库设计
主要包括用户表、事件表、资源映射表、邮件表  
### 用户表
字段|含义|类型
-|-|-|
userName|用户名|varchar
passWd|密码(已加密)|varchar
nick|昵称|varchar
id|用户id|int
mate|mateid|int
avatar|用户头像|varchar
sex|性别|int
bio|个人签名|varchar
createdTime|注册时间|varchar
### 事件表  
字段|含义|类型
-|-|-|
id|事件id|int
time|时间|varchar
title|标题|varchar
detail|概述|varchar
createdBy|创建人|int
level|心情枚举|int
### 资源映射表
字段|含义|类型
-|-|-|
id|资源id|int
time|上传时间|varchar
eventId|所属事件id|int
type|类型枚举|int
### 邮件表  
字段|含义|类型
-|-|-|
id|邮件id|int
time|创建时间|varchar
content|内容|varchar
sendTime|发送时间|varchar
isSend|是否已发送|bool
receiver|收件人|varchar
