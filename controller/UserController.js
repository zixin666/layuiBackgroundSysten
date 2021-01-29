
// 用户控制器
let UserController = {};
// 导入model,相当于模型执行sql语句，
const model = require('../model/model.js');
let md5 = require('md5')
let {secret:passSecret} = require('../config/app.json')
UserController.signin = async (req,res)=>{
   
// 接收参数
    let {username,password} = req.body;
// 数据库查询
    password = md5(`${password}${passSecret}`);
    let sql = `select * from users where username='${username}' and password = '${password}'`
    let data = await model(sql);
    if(data.length){
// 把用户信息存入到会话session中，
        let userInfo = data[0];
        req.session.userInfo = userInfo; 
        res.json({errcode:0,message:'登录成功'})
    }else{
        res.json({errcode:10008,message:'用户名或密码错误'})
    }

}


module.exports = UserController;