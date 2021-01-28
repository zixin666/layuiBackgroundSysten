// 文章控制器
let ArticleController = {}


let articleData = require("../mockData/article.json");

// 导入model,相当于模型执行sql语句，
const model = require('../model/model.js');

// 导入返回结果的信息
const {delsucc,delfail,exception,argsfail,addsucc,addfail,getsucc,getfail,updsucc,updfail} 
= require('../util/responseMessage.js');

// 获取分页的文章数据
ArticleController.allArticle = async (req,res)=>{

    let {page,limit:pagesize} = req.query;

    let offset = (page - 1)*pagesize;
    let sql = `select * from article limit ${offset},${pagesize}`;
    let sql2 = `select count(*) as count from article;`
    let promise1 =  model(sql); 
    let promise2 =  model(sql2); 
    // 并行
    let result = await Promise.all([promise1,promise2])
    let data = result[0];
    let count = result[1][0].count;
    let response = {
        code: 0,
        count: count, 
        data: data,
        msg:''
    }
    // console.log(data)
    res.json(response)

}

ArticleController.delArticle = async (req,res)=>{
    let {art_id} = req.body;
    console.log(art_id)
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
    let sql = `insert into article(title,content,author,cat_id,status,cover,publish_date)
                values('${title}','${content}','admin',${cat_id},${status},'${cover}',now())
                `;
    let result = await model(sql)
    if(result.affectedRows){
        res.json(addsucc)
    }else{
        res.json(addfail)
    }

}

//实现文件上传
ArticleController.upload = (req,res)=>{
    console.log(req.file); 
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
    let data = await model(sql); 
    res.json(data[0] || {})

}
module.exports = ArticleController;