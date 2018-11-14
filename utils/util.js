import Dialog from '../dist/vant/dialog/dialog'

export const isLogin = () => {
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