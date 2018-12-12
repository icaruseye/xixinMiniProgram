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
  },
  onShow() {
    this.getActivityList()
    this.getMyList()
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
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
  toGuide (e) {
    const _data = this.data.mineList[e.currentTarget.dataset.index]
    if (_data.CommodityType === 1) {
      wx.navigateTo({
        url: '/pages/activityGuide/activityGuide',
      })
    }
    if (_data.CommodityType === 2) {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${_data.CommodityID}`,
      })
    }
  },
  //事件处理函数
  toDetail: function(e) {
    wx.navigateTo({
      url: `../activityIntro/activityIntro?id=${e.currentTarget.dataset.id}`
    })
  }
})
