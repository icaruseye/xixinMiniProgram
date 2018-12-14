
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var userInfo = wx.getStorageSync('userInfo') || null

    if (userInfo) {
      if (userInfo.servantViewID) {
        this.globalData.userInfo = userInfo
      }
    }
  },
  globalData: {
    header: {
      token: ''
    },
    userInfo: null
  }
})