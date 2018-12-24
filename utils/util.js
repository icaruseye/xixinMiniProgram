import Dialog from '../dist/vant/dialog/dialog'

const isLogin = () => {
  if (!wx.getStorageSync('token')) {
    Dialog.alert({
      title: '提示',
      message: '您尚未登录',
      confirmButtonText: '去登录',
      overlay: true
    }).then(() => {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    })
    return false
  }
  return true
} 

const NumToLetter = (index = 0) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (typeof index === 'number') {
    index = Math.abs(index)
    if (index >= 0 && index < 26) {
      return letters[index]
    } else {
      return `${letters[index % 26]}${Math.floor((index / 26))}`
    }
  } else {
    console.error('Parameter is not a number！')
  }
}

const getQueryString = (name, url) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = url.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null;
}

module.exports = {
  isLogin,
  NumToLetter,
  getQueryString
}