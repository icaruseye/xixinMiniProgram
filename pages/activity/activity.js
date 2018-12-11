import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'activity',
    hasUserInfo: false,
    pageReady: false,
    list: [],
    mineList: [],
    userInfo: {},
    mobile: ''
  },
  onLoad(options) {
    wx.setStorageSync('servantViewID', options.servantViewID)
    wx.setStorageSync('localUrl', this.route)
    if (options.isMine) {
      this.setData({
        current: 'activityMine'
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
  },
  onShow() {
    this.getActivityList()
    this.getMyList()
  },
  // 活动列表
  getActivityList () {
    api._get('/SPUser/Activity-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
      this.setData({
        pageReady: true,
        list: res.Data || []
      })
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  // 我的活动
  getMyList() {
    api._get('/SPUser/Activity-My-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
      this.setData({
        pageReady: true,
        mineList: res.Data || []
      })
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  handleChange({ detail }) {
    if (detail.key !== this.data.current) {
      this.setData({
        pageReady: false,
        current: detail.key
      })
      if (detail.key === 'activity') {
        this.getActivityList()
      }
      if (detail.key === 'activityMine') {
        this.getMyList()
      }
    }
  },
  getUserInfo: function (e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toGuide () {
    wx.navigateTo({
      url: '/pages/activityGuide/activityGuide',
    })
  },
  //事件处理函数
  toDetail: function(e) {
    wx.navigateTo({
      url: `../activityIntro/activityIntro?id=${e.currentTarget.dataset.id}`
    })
  }
})
