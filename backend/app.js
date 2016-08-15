require("babel-core/register")({
    presets: ['stage-3', 'es2015']
})
require("babel-polyfill")

const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static-server')

// static file middleware
app.use(serve({
    rootDir: './static',
    rootPath: '/static'
}))

// router
const router = require('./router')
app.use(router.routes())

app.listen(3000)
console.log('listening on port 3000')
