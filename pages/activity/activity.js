//index.js
import { isLogin } from '../../utils/util.js'
import Dialog from '../../dist/vant/dialog/dialog'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'activity',
    hasUserInfo: false,
    viewId: 'abc',
    list: [],
    pageReady: false
  },
  onLoad(options) {
    wx.setStorageSync('servantViewID', options.servantViewID)
  },
  onShow() {
    console.log(isLogin())
    if (!isLogin()) return false
    this.getActivityList()
  },
  getActivityList () {
    const that = this
    api._get('/api/User/Activity-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
      that.setData({
        list: res.data.Data,
        pageReady: true
      })
    }).catch(e => {
      that.setData({
        pageReady: true
      })
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
