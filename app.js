
//app.js
App({
  onLaunch: function (options) {
    wx.setStorageSync('servantViewID', options.query.servantViewID)
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo.servantViewID) {
      this.globalData.userInfo = userInfo
    }
  },
  onShow: function (options) {
    this.globalData.servantViewID = options.query.servantViewID || wx.getStorageSync('servantViewID')
  },
  globalData: {
    userInfo: null,
    servantViewID: null
  }
})