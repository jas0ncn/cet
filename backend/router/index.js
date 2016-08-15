'use strict'
const router = require('koa-router')({
	prefix: '/api'
})
const Controller = require('../controller')

router
    .get('/cetGrade/:name/:ticket', Controller.index)

router
    .get('/cetGradeNoTicket/:name/:school/:type', Controller.noTicket)

module.exports = router
