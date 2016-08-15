const req = require('request')

// 判断对象是否为空
/**
 * 判断对象是否为空
 * @param  [object] obj 要判断的对象
 * @return [boolean]
 */
const isEmpty = obj => {
    for (let name in obj) return false
    return true
}

/**
 * 生成随机数
 * @param  [number] start 最小值
 * @param  [number] end   最大值
 * @return [number]
 */
const random = (start, end) => {
    return Math.floor(Math.random() * (end - start) + start)
}

/**
 * Promise 封装的 request
 * @param [string] url 请求的 url
 * @param [object] options 请求的参数 (https://github.com/request/request)
 * @return [Promise object]
 */
const request = (url, options) => {
    return new Promise((resolve, reject) => {
        req(url, options, (err, res, body) => {
            if (err) {
                reject(err)
                return
            }
            resolve(res)
        })
    })
}

module.exports = {
    isEmpty,
    random,
    request
}
