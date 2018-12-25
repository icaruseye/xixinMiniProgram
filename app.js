
//app.js
App({
  onLaunch: function (options) {
    console.log(options)
    this.globalData.servantViewID = options.query.servantViewID
    var userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo) {
      if (userInfo.servantViewID) {
        this.globalData.userInfo = userInfo
      }
    }
  },
  onShow: function () {
    console.log(wx.getLaunchOptionsSync())
    if (wx.getLaunchOptionsSync() === 1089) {
      wx.redirectTo({
        url: '/pages/activity/activity'
      })
    }
  },
  globalData: {
    userInfo: null
  }
})