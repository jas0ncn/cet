require("babel-core/register")({
    presets: ['stage-3', 'es2015']
})
require("babel-polyfill")

const Koa = require('koa')
const app = new Koa()

// router
const router = require('./router')
app.use(router.routes())

app.listen(3000)
console.log('listening on port 3000')
