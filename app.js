
//app.js
App({
  onLaunch: function (options) {
    this.globalData.servantViewID = options.query.servantViewID
    var userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo) {
      if (userInfo.servantViewID) {
        this.globalData.userInfo = userInfo
      }
    }
  },
  onShow: function (options) {
    // if (options.scene === 1089) {
    //   wx.redirectTo({
    //     url: '/pages/activity/activity'
    //   })
    // }
  },
  globalData: {
    userInfo: null
  }
})