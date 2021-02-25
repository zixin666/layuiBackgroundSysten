const express = require('express');
const path = require('path');
const app = express();


let session = require('express-session');
let cors = require('cors');

// 设置跨域
app.use(cors())

// 导入路由模块
const router = require('./router/router.js')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 定义中间件，托管静态资源
app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const artTemplate = require('art-template'); 
const express_template = require('express-art-template');

app.set('views', __dirname + '/views/');

//设置express_template模板引擎的静态文件扩展名为.html
app.engine('html', express_template);

//使用模板引擎扩展名为html
app.set('view engine', 'html');
let options = {
    name:"SESSIONID", // 待会写入到cookie中标识
    secret: "fuhsfgw3453", // 用来加密会话
    cookie: {
        httpOnly: true,
        secure: false, // false-http(默认)
        maxAge:60000*24, // session在cookies存活24分钟，
        
    }
};
app.use( session(options) )

// 前台路由
app.use('/api',apiRouter);
// 在进入到路由匹配函数之前，要进行验证权限
app.use(function(req,res,next){
    let path = req.path.toLowerCase();
    let noCheckAuth = ['/login','/signin','/logout']
    if(noCheckAuth.includes(path)){
        next();
    }else{
// 需要验证权限（session）
        if(req.session.userInfo){
            next()
        }else{
            res.redirect('/login')
        }
    }
});
// 使用路由中间件 req.body
app.use(router)

app.listen(4000,_=>console.log('4000'))