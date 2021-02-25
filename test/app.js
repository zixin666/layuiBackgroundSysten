let express = require('express');

let app = express();
let apiRouter = require('./apiRouter.js')

app.use('/api',apiRouter)

app.listen(5000,()=>{
    console.log('开始 5000')
})
