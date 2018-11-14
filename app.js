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
    devApi: 'https://lan-test.xixincloud.com',    //对应的就是192.168.2.100
    proApi: 'https://test-api.xixincloud.com',
    header: {
      token: ''
    },
    userInfo: null
  }
})