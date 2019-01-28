// const baseUrl = 'https://test-api.xixincloud.com/api'
const baseUrl = 'https://lan-test.xixincloud.com/api'
let logger = null
if (wx.canIUse('getLogManager')) {
  logger = wx.getLogManager({ level: 1 })
}
const http = ({ url = '', param = {}, ...other } = {}, opt = {}) => {
  if (!opt.isNotShowloading) {
    wx.showLoading({
      title: '请求中..',
      mask: true
    })
  }
  //param.shopID = 1
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
        'shopID': 1,
      },
      ...other,
      complete: (res) => {
        if (!opt.isNotShowloading) {
          wx.hideLoading()
        }
        // 请求正常
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.Code === 100000) {
            resolve(res.data)
          } else {
            if (wx.canIUse('getLogManager')) {
              logger.info({
                err: res,
                url: url,
                param: param
              }, '接口非正确返回')
            }
            const localUrl = wx.getStorageSync('localUrl')
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              duration: 1500
            })
            reject(res)
          }
        } else {
          if (wx.canIUse('getLogManager')) {
            // 请求出错：登录失效、服务器错误
            logger.warn({ err: res, url: url }, '接口请求错误日志')
          }
          if (res.data.Code === 100010) {
            wx.showModal({
              title: '提示',
              content: '登录失效，请重新登录',
              showCancel: false,
              confirmText: '去登录',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '出错了',
            })
            reject(res)
          }
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url
  }
  return url
}

// get方法
const _get = (url, param = {}, opt = {}) => {
  return http({
    url,
    param
  }, opt)
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}
module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
}