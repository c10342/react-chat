import express from 'express';

import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';

import path from 'path';

const app=express();

var mysql=require('./mysql/api/mysqlOperation.js');


// socket.io与express配合使用
const http=require('http').Server(app);
const io=require('socket.io')(http);

// 监听用户连接进来,io是全局的,socket是单个用户的
io.on('connection', function (socket) {
    // socket是当前连接的socket
    console.log('user login');
    // 监听客户端发送过来的sendmsg事件,回调函数的data是传递过来的参数
    socket.on('sendmsg',function (data) {
        var {fromid,toid}=data;
        var content=data.msg;
        // 聊天信息的id是由发送方和接收方两者的id拼接的，方便我们后面查询
        var chatid=[fromid,toid].join('_');
        // 消息创建的时间
        var createTime=parseInt(new Date().getTime()/10000);
        mysql.Insert("chat",{chatid,content,fromid,toid,createTime}).then(res=>{
            mysql.Query('chat',[],`createTime=${createTime}`).then(result=>{
                io.emit('recvmsg',{code:0,msg:result[0]})
            })
        }).catch(err=>{
            console.log(err);
        })
        // 向所有用户广播
        // io.emit('recvmsg',data);
    });
});

// 下面的写法只适合html，css，js文件在同级目录下
// app.use(express.static('./build'))


app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var userRouter=require('./router/user.js');

app.use('/user',userRouter);

import React from 'react';
// 把react组件渲染成浏览器可以识别的div，这样可以加快渲染速度，因为返回react组件给前端，前端又调用react去识别他，然后在进行渲染，这样速度会变慢
import {renderToString} from 'react-dom/server';
// function App(){
//     return (
//         <h1>server render</h1>
//     )
// }
// console.log(renderToString(<App></App>));


// 下面2个是钩子函数，必须在App前
// 处理请求css文件
import csshook from 'css-modules-require-hook/preset.js';
// 处理图片等其他资源
import assethook from 'asset-require-hook';
// 配置参数
assethook({
    extensions: ['jpg','png']
});

// 利用服务器渲染首屏，有利于解决SEO
import App from '../src/app.js';
import {Provider} from 'react-redux';
// 服务端用StaticRouter代替BrowserRouter
import {StaticRouter} from 'react-router-dom';
import {applyMiddleware, compose, createStore} from "redux";
import reducers from "../src/reducer.js";
import thunk from "redux-thunk";
// 引入打包生成的asset-manifest文件，里面有打包后的文件路径
import staticPath from '../build/asset-manifest.json';

app.use((req,res,next)=>{
    // 设置白名单，以/user/开头的说明是发送网络请求，以/static/开头的说明是请求静态资源文件，这里不可能是请求网络资源，因为请求网络资源在上面
    if(req.url.startsWith('/user/')||req.url.startsWith('/static/')){
        return next()
    }
    // 前端路由没有处理其他的路由情况，所以要在这里处理
    // 返回主页
    // return res.sendFile(path.resolve('build/index.html'));

    // 创建store
    const store = createStore(reducers,compose(
        // 处理异步，需要用到thunk中间件
        applyMiddleware(thunk),
    ));

    // react-router4官方推荐写法
    var context={}
    var markup=renderToString((
        <Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context} //路由跳转相关
            >
                <App></App>
            </StaticRouter>
        </Provider>
    ));

    var obj={
        '/msg':'消息列表',
        '/boss':'boss列表'
    }
    var pagehtml=`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <meta name="keywords" content="react16 redux react-router4">
    <!--动态SEO-->
    <meta name="description" content="${obj[req.url]}">
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
    <link rel="stylesheet" href="/${staticPath['main.css']}">
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root">${markup}</div>
    <script src="${staticPath['main.js']}"></script>
  </body>
</html>`


    res.send(pagehtml);
})

// 项目的根目录是mushroom
// console.log(path.resolve('build'));
// E:\Users\Adminator\Desktop\mushroom\server\build
app.use('/',express.static(path.resolve('build')))

// 使用socket.io后，这里使用http监听端口而不是app
http.listen(9093,function(){
    console.log('服务器已经启动,地址是http://localhost:9093');
})