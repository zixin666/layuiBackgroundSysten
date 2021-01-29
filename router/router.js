let express = require('express');

// 得到一个路由器
let router = express.Router();

const multer = require('multer');
// 定义上传的目录
let upload = multer({ dest: 'uploads/' })


// 导入相应的控制器
const CateController = require('../controller/CateController.js');
const ArtController = require('../controller/ArtController.js');
const UserController = require('../controller/UserController.js');

// 统计出分类的文章总数
router.get('/cateCount',async (req,res)=>{
    let sql = `select count(*) total ,t2.name,t1.cat_id from article t1 
                left join category t2 
                on t1.cat_id = t2.cat_id 
                group by  t1.cat_id`;
    let data = await model(sql); // [{},{},{},{}]
    res.json(data)
})
// 匹配 / 或 /admin
router.get(/^\/$|^\/admin$/,(req,res)=>{
    res.render('index.html')
})

// 文章列表
router.get('/artindex',(req,res)=>{
    res.render('article-index.html')
})

// 渲染后台分类列表页面
router.get('/catindex',CateController.catindex)

// 渲染出添加分类的页面
router.get('/catadd',CateController.catadd)

// 渲染出编辑分类的页面
router.get('/catedit',CateController.catedit)

// 提交分类的数据
router.post('/postCat',CateController.postCat)


router.get('/artadd',(req,res)=>{
    let data = {name:'西红柿炒蛋'}
    res.render('article-add.html',data)
})

// 获取所有分类数据的接口
router.get('/getCate',CateController.getCate)


// 获取所有分类数据的接口
router.get('/getOneCate',CateController.getOneCate)

// 删除分类的接口
router.post('/delCat',CateController.delCat)

// 编辑分类的接口
router.post('/updCate',CateController.updCate)

// 获取文章数据接口
router.get('/allarticle',ArtController.allArticle)


// 删除文章
router.post('/delArticle',ArtController.delArticle)

// 渲染出添加文章的页面
router.get('/addart',ArtController.artAdd)

// 渲染出编辑文章的页面
router.get('/artedit',ArtController.artEdit)


// 提交文章的数据入库
router.post('/postArt',ArtController.postArt)

// 上传文件
router.post('/upload',upload.single('file'),ArtController.upload)


// 获取单条文章数据的接口
router.get('/getOneArt',ArtController.getOneArt)


// 匹配失败的路由
router.all('*',(req,res)=>{
    res.json({errcode:10004,message:"请求错误"})
})

// 暴露出去
module.exports = router;

