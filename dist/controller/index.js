'use strict'
const decoder = require('ling-cet-decoder')
const _ = require('./util')
const cheerio = require('cheerio')

/**
 * 错误处理
 */
const error = (ctx, info) => {
    const returnData = {
        'status': 500,
        'info': info
    }

    ctx.status = 500
    ctx.body = returnData

    return false
}

/**
 * 解析 DOM 获得成绩
 * @param  [string] src 网页源代码
 * @return [object]
 */
const parseDomForGrade = src => {
    const $ = cheerio.load(src)
    const gradeDom = $('.cetTable td')

    if (!gradeDom.text()) {
        return false
    }

    let info = []
    let gradeArray = []
    gradeDom.each(function (i, e) {
        let text = $(this).text()
        if (i === 5) {
            gradeArray = text.match(/[\d]+/gi)
        } else {
            info[i] = text
        }
    })

    return {
        name: info[0],
        school: info[1],
        type: info[2],
        ticket: info[3],
        time: info[4],
        grade: {
            sum: gradeArray[0],
            listen: gradeArray[1],
            read: gradeArray[2],
            write: gradeArray[3]
        }
    }
}

/**
 * 查询成绩
 * @param  [string] name 姓名
 * @param  [string|number] ticket 准考证号
 * @return [Promise object]
 */
const query = (name, ticket) => {
    const params = 'zkzh=' + ticket + '&xm=' + name
    const ip = [_.random(0, 255), _.random(0, 255), _.random(0, 255), _.random(0, 255)].join('.')
    const options = {
        headers: {
          Referer: 'http://www.chsi.com.cn/cet/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
          'X-Forwarded-For': ip
        }
    }
    return _.request('http://www.chsi.com.cn/cet/query?' + encodeURI(params), options)
}

/**
 * 有准考证获取成绩
 */
async function index (ctx, next) {

    if (_.isEmpty(ctx.params)
        || !( 'name' in  ctx.params)
        || !( 'ticket' in  ctx.params)) {
        error(ctx, '参数错误')
        return false
    } else if (ctx.params.name.length > 4 || ctx.params.name.length < 2) {
        error(ctx, '错误的姓名')
        return false
    }

    try {

        const res = await query(ctx.params.name, ctx.params.ticket)

        let data = parseDomForGrade(res.body)

        if (!data) {
            ctx.status = 200
            ctx.body = {
                status: 200,
                data: 'No fetch'
            }
            return
        }

        ctx.status = 200
        ctx.body = {
            status: 200,
            data: data
        }

    } catch (e) {

        error(ctx, '服务器错误 - 100')

    }

}

/**
 * 无准考证获取成绩
 * decoder: https://github.com/wssgcg1213/ling-cet-decoder
 */
async function noTicket (ctx, next) {

    if (_.isEmpty(ctx.params)
        || !( 'name' in  ctx.params)
        || !( 'school' in  ctx.params)
        || !( 'type' in  ctx.params)) {
        error(ctx, '参数错误')
        return
    }

    const ip = [_.random(0, 255), _.random(0, 255), _.random(0, 255), _.random(0, 255)].join('.')
    const options = {
        method: 'POST',
        encoding: null,
        headers: {
            Referer: 'http://find.cet.99sushe.com',
            'X-Forwarded-For': ip
        },
        body: decoder.getEncryptReqBody(ctx.params.type, ctx.params.school, ctx.params.name)
    }

    try {

        let res = await _.request('http://find.cet.99sushe.com/search', options)
        const ticket = decoder.decryptResBody(res.body)

        if (!ticket) {
            ctx.status = 200
            ctx.body = {
                status: 200,
                data: 'No fetch'
            }
            return
        }

        res = await query(ctx.params.name, ticket)

        let data = parseDomForGrade(res.body)

        if (!data) {
            ctx.status = 200
            ctx.body = {
                status: 200,
                data: 'No fetch'
            }
            return
        }

        ctx.status = 200
        ctx.body = {
            status: 200,
            data: data
        }

    } catch (e) {

        error(ctx, '服务器错误 - 101')

    }

}

module.exports = {
    index,
    noTicket
}
