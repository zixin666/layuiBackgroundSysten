// 文章控制器
const fs = require('fs');
let ArticleController = {}

// 导入模拟的假数据
let articleData = require("../mockData/article.json");

// 导入model
const model = require('../model/model.js');

// 导入返回结果
const {delsucc,delfail,exception,argsfail,addsucc,addfail,getsucc,getfail,updsucc,updfail} 
= require('../util/responseMessage.js');

// 获取分页的文章数据
ArticleController.allArticle = async (req,res)=>{
// 接收查询字符串,给limit取别名
    let {page,limit:pagesize} = req.query;
    let offset = (page - 1)*pagesize;
    let sql = `select t1.*,t2.name from article t1 left join category t2 on t1.cat_id = t2.cat_id
    
                order by t1.art_id desc limit ${offset},${pagesize} `;
    let sql2 = `select count(*) as count from article;`
    let promise1 =  model(sql); 
    let promise2 =  model(sql2);
    let result = await Promise.all([promise1,promise2])
    let data = result[0];
    let count = result[1][0].count;
    let response = {
        code: 0,
        count: count, // 1000是数据的总记录数
        data: data,
        msg:''
    }
    res.json(response)
}


//删除文章
ArticleController.delArticle = async (req,res)=>{
    let {art_id} = req.body;
    let sql = `delete from article where art_id = ${art_id}`;
    let result = await model(sql);
    if(result.affectedRows){
        res.json(delsucc)
    }else{
        res.json(delfail)
    }
}

// 渲染出文章编辑的页面
ArticleController.artEdit = (req,res)=>{
    res.render('article-edit.html')
}

// 渲染出文章添加的页面
ArticleController.artAdd = (req,res)=>{
    res.render('article-add.html')
}

// 提交数据入库
ArticleController.postArt = async (req,res)=>{
    let {title,cat_id,status,content,cover} = req.body;
    let username = req.session.userInfo.username
    let sql = `insert into article(title,content,author,cat_id,status,cover,publish_date)
                values('${title}','${content}','${username}',${cat_id},${status},'${cover}',now())
                `;
    let result = await model(sql)
    if(result.affectedRows){
        res.json(addsucc)
    }else{
        res.json(addfail)
    }

}

ArticleController.upload = (req,res)=>{
    if(req.file){
        let {originalname,destination,filename} = req.file;
        let dotIndex = originalname.lastIndexOf('.');
        let ext = originalname.substring(dotIndex);
        let oldPath = `${destination}${filename}`;
        let newPath = `${destination}${filename}${ext}`;
        fs.rename(oldPath,newPath,err=>{
            if(err){ throw err; }
            res.json({message:'上传成功',code: 0,src:newPath})
        })
    }else{
        res.json({message:'上传失败',code: 1,src:''})
    }
}

// 获取单条文章
ArticleController.getOneArt = async (req,res)=>{
    let {art_id} = req.query;
    let sql = `select * from article where art_id = ${art_id}`;
    let data = await model(sql); // [{}]
    res.json(data[0] || {})

}


// 编辑文章数据入库
ArticleController.updArt = async (req,res)=>{
    //1.接收post数据(校验)
    let {cover,title,cat_id,art_id,content,status,oldCover} = req.body
    //2.执行sql语句
    let sql;
    if(cover){
        sql = `update article set title='${title}',content='${content}',cover='${cover}'
                ,cat_id=${cat_id},status = ${status} where art_id = ${art_id};`
    }else{
        sql = `update article set title='${title}',content='${content}'
                ,cat_id=${cat_id},status = ${status} where art_id = ${art_id};`
    }
    let result = await model(sql);
    
    //3.响应结果
    if(result.affectedRows){
        cover && fs.unlinkSync(oldCover)
        res.json(updsucc)
    }else{
        res.json(updfail)
    }

}


// 暴露模块
module.exports = ArticleController;