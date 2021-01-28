// 封装执行sql语句的promise函数

// 引用mysql
var mysql = require('mysql');
// 连接数据库参数配置
// 导入数据库
let dbConfig = require("../config/db.json");//获取到的是一个对象

var connection = mysql.createConnection({
    // 展开对象中的参数
    // 对象可以解构赋值也可以展开
    ...dbConfig
});
connection.connect(function(err){
    if(err){
        throw err;
    }
    console.log('connect mysql success');
});


// 封装一个函数，用于查询执行sql语句
function dbquery(sql){
    return new  Promise((resolve,reject)=>{
        connection.query(sql,(err,data)=>{
            if(err){ reject(err); }
            // select(查) => data是一个数组[{},{},..]  data.length > 说明有数据
            // insert delete update（增删改） => data是一个对象 data.affectedRows > 0说明成功
            resolve(data)
        })
    })
}

module.exports = dbquery;