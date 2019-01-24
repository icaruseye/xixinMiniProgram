
//app.js
App({
  onLaunch: function (options) {
    wx.setStorageSync('servantViewID', options.query.servantViewID)
  },
  onShow: function (options) {
    let servantViewID = options.query.servantViewID
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo.servantViewID) {
      this.globalData.userInfo = userInfo
    }
    if (options.scene === 1089 && !servantViewID) {
      this.globalData.servantViewID = wx.getStorageSync('servantViewID')
    } else {
      this.globalData.servantViewID = servantViewID
    }
    
  },
  globalData: {
    userInfo: null,
    servantViewID: null
  }
})