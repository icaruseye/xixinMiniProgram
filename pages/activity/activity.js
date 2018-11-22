import Dialog from '../../dist/vant/dialog/dialog'
import { isLogin } from '../../utils/util.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'activity',
    hasUserInfo: false,
    list: [],
    pageReady: true
  },
  onLoad(options) {
    wx.setStorageSync('servantViewID', options.servantViewID)
    wx.setStorageSync('localUrl', this.route)
  },
  onShow() {
    console.log('onShow')
    if (!isLogin()) return false
    this.getActivityList()
  },
  getActivityList () {
    const that = this
    api._get('/User/Activity-List', {
      viewId: wx.getStorageSync('servantViewID') || 'fa5ae362fb654419b0a856ef5d0fc87f'
    }).then(res => {
      that.setData({
        pageReady: true,
        list: res.Data || []
      })
      console.log(this.data.list)
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
