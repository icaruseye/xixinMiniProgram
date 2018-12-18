
//app.js
App({
  onLaunch: function (options) {
    var userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo) {
      if (userInfo.servantViewID) {
        this.globalData.userInfo = userInfo
      }
    }
  },
  onShow: function () {
    if (wx.getLaunchOptionsSync() === 1089) {
      wx.redirectTo({
        url: '/pages/activityCom/activityCom'
      })
    }
  },
  globalData: {
    userInfo: null
  }
})