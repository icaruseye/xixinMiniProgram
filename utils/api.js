const baseUrl = 'https://lan-test.xixincloud.com/api'

const http = ({ url = '', param = {}, ...other } = {}) => {
  wx.showLoading({
    title: '请求中，请耐心等待..',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      ...other,
      complete: (res) => {
        wx.hideLoading()
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          if (res.data.Code === 100010) {
            wx.showToast({
              title: '请登录后重试',
              icon: 'none',
              duration: 1500,
              complete () {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }
            })
          } else {
            const localUrl = wx.getStorageSync('localUrl')
            // wx.showModal({
            //   title: '提示',
            //   content: '出错了请重试',
            //   showCancel: false,
            //   confirmText: '刷新',
            //   success(res) {
            //     if (res.confirm) {
            //       wx.redirectTo({
            //         url: '/'+ localUrl
            //       })
            //     }
            //   }
            // })
            wx.showToast({
              title: '出错了',
              icon: 'none',
              duration: 1500
            })
          }
          reject(res)
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
const _get = (url, param = {}) => {
  return http({
    url,
    param
  })
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