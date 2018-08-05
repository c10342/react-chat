var express= require('express');

var mysql=require('../mysql/api/mysqlOperation.js');

var util=require('../util/util.js');

var router=express.Router();

router.get('/list',function(req,res){
    var {type}=req.query;
    mysql.Query('user',['id', 'username', 'type','avatar','company','desc1','money','title'],`type="${type}"`).then(result=>{
        res.json({code:0,data:result});
        return;
    }).catch(err=>{
        if(err){
            res.json({code:1,msg:'服务器出错'});
            return;
        }
    })
});


// 查询用户信息
router.get('/info', function (res, req) {
    // 获取请求过来的用户id
    var id = res.cookies.userId;
    // 根据id查找用户
    mysql.Query('user', ['id', 'username', 'type','avatar','company','desc1','money','title'], `id=${id}`).then(result => {
        if (result.length == 0) { //找不到该用户
            // code:1表示失败,没有找到
            req.json({code: 1});
            return;
        }
        // 找到用户信息，并且返回用户信息
        req.json({code: 0, data: result[0]});
        return;
    }).catch(err => {
        if (err) {
            req.json({code: 1, msg: '服务器出错'});
            return;
        }
    })
});

// 更新用户信息
router.post('/update',function(res,req){
    var userId=res.cookies.userId;
    // 用户同时打开2个浏览器，一个注销了，另一个没有注销
    if(!userId){
        req.json({code:1,msg:'用户还没有登陆'});
        return;
    }
    var obj=res.body;
    mysql.Update('user',obj,`id=${userId}`).then(()=>{
        mysql.Query('user',['id','username','type','avatar','company','desc1','money','title'],`id=${userId}`).then(result=>{
            req.json({code:0,data:result[0]});
            return;
        }).catch(err=>{
            if(err){
                req.json({code:1,msg:'服务器出错'});
                return;
            }
        })
    }).catch(err=>{
        console.log(err);
        if(err){
            req.json({code:1,msg:'服务器出错'});
            return;
        }
    })
})

// 用户登录
router.post('/login', function (res, req) {
    // 获取post请求里面的参数
    var {username, password} = res.body;
    // 根据用户名和密码，判断该用户是否已经存在数据库中，util.md5(password)对密码进行加密
    mysql.Query('user', ['id','username','type','avatar','company','desc1','money','title'], `username="${username}" and password="${util.md5(password)}"`).then(result => {
        if (result.length == 0) { //用户不存在数据库中
            req.json({code: 1, msg: '用户名或者密码错误'})
            return;
        }
        // 用户存在于数据库中
        // 设置cookie
        req.cookie('userId', result[0].id);
        // 登陆成功，并且返回用户信息
        req.json({code: 0, data: result[0]});
        return;
    }).catch(err => {
        if (err) {
            req.json({code: 1, msg: '服务器出错'});
            return;
        }
    })
});

// 用户注册
router.post('/register',function(res,req){
    // 获取post请求的参数
    var {username,password,type} = res.body;
    // 根据用户名查找用户
    mysql.Query('user',['username'],`username="${username}"`).then(result=>{
        if(result.length!=0){ //该用户名已经存在于数据库中
            req.json({code:1,msg:'用户名重复'});
            return;
        }
        // 用户名不存在于数据库中
        // 把用户注册的信息写入到数据库中
        mysql.Insert('user',{username,password:util.md5(password),type}).then(()=>{
            // 这里进行查找用户信息主要是为了获取id，方便设置cookie
            mysql.Query('user',['id','username','type','avatar','company','desc1','money','title'],`username="${username}"`).then(result=>{
                req.cookie('userId',result[0].id);
                req.json({code:0,data:result[0]});
                return;
            }).catch(err=>{
                if(err){
                    req.json({code:1,msg:'服务器出错'});
                    return;
                }
            });
        })
    }).catch(err=>{
        if(err){
            req.json({code:1,msg:'服务器出错'});
            return;
        }
    })
});

// 获取聊天信息
router.get('/getMsgList',function(req,res){
    var userid=req.cookies.userId;
    mysql.Query('chat',[],`fromid=${userid} or toid=${userid}`).then(result=>{
        mysql.Query('user',['id','username','avatar'],null).then(data=>{
            res.json({code:0,msgs:result,users:data});
        })
    }).catch(err=>{
        if(err){
            res.json({code:1})
        }
    })
});

router.post('/msgread',function (req,res) {
    var {from:fromid}=req.body;
    var userid=req.cookies.userId;
    // 把消息标记为以读
    mysql.Update('chat',{isread:0},`fromid=${fromid} and toid=${userid}`)
        .then(result=>{
            // result.changedRows更新的行数
            res.json({code:0,num:result.changedRows});
        }).catch(err=>{
        console.log(err);
    })
})



module.exports=router;