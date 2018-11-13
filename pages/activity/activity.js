//index.js
const app = getApp()

Page({
  data: {
    current: 'activity',
    hasUserInfo: false,
    viewId: 'abc',
    list: [],
    pageReady: false
  },
  onLoad () {
    this.getActivityList()
  },
  getActivityList () {
    const that = this
    wx.request({
      url: `${app.globalData.devApi}/api/User/Activity-List?viewId=${this.data.viewId}`,
      success (res) {
        that.setData({
          list: res.data.Data
        })
      },
      complete () {
        that.setData({
          pageReady: true
        })
      }
    })
  },
  handleChange({ detail }) {
    if (detail.key === this.data.current) return false
    wx.navigateTo({
      url: `../${detail.key}/${detail.key}`
    })
  },
  //事件处理函数
  toDetail: function(e) {
    wx.navigateTo({
      url: `../activityIntro/activityIntro?id=${e.currentTarget.dataset.id}`
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  }
})
