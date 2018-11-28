var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017';   // 后台数据库地址

// 中间件 允许跨域访问
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

// 静态文件托管中间件
app.use(express.static(path.join(__dirname, 'public')));

// 获取请求体中数据中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 下面将是后台提供给前端的一些接口
app.post('/user/login', function (req, res, next) {
    // 接受前端传递过来的用户名和密码
    var user = req.body.user;
    var password = req.body.password;
    var result = {};   // 返回给前端的数据

    MongoClient.connect(url, { useNewUrlParser: true }, function (error, client) {
        if (error) { // 如果数据库连接发生错误
            console.log('数据库连接失败');
            result.code = -1;
            result.msg = '服务器内部错误';
            res.json(result);  // 如果数据库连接失败，此时不再往下进行，将错误信息返回给前端
            return;
        }
        var db = client.db('project');

        // 查找用户是否已经注册
        db.collection('users').find({
            name: user,
            password: password
        }).toArray(function (error, data) {
            if (error) {
                console.log('查找用户信息失败');
                result.code = -1;
                result.msg = '查找用户信息失败'
            } else if (data.length <= 0) {  // 如果在数据库中没有找到数据    
                console.log('用户名或密码错误');
                result.code = -1;
                result.msg = '用户名或密码错误';
            } else {  // 找到了数据
                console.log('登录成功');
                result.code = 0;
                result.msg = '登录成功';
                result.data = {
                    nickname: data[0].nickname,
                    isAdmin: data[0].isAdmin
                }
            }
            client.close();
            res.json(result);
        });
    });
});


app.use(function (req, res, next) {
    res.send('404');
});

app.get('/user/userManage', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (error, data) { })
});

app.listen(3000);
console.log('服务启动成功');