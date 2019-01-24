
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
  // 监听错误
  onError: function (err) {
    const logger = wx.getLogManager({level: 1})
    // logger.warn({ err: err }, '全局错误日志')
  },
  globalData: {
    userInfo: null,
    servantViewID: null
  }
})