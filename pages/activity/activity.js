import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'
import util from '../../utils/util.js'

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
    wx.setStorageSync('localUrl', this.route)
    if (options.isMine) {
      this.setData({
        current: 'activityMine'
      })
    }
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
    if (util.getQueryString('isMine', this.route)) {
      this.setData({
        current: 'activityMine'
      })
    }
    this.init(this.data.current)
  },
  // 活动列表
  getActivityList () {
    const servantViewID = app.globalData.servantViewID || ''
    const url = servantViewID ? `/SPUser/Activity-List?viewId=${servantViewID}` : '/SPUser/Activity/List/All'
    api._get(url).then(res => {
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
    const servantViewID = app.globalData.servantViewID || ''
    const url = servantViewID ? `/SPUser/Activity-My-List?viewId=${servantViewID}` : `/SPUser/Activity-My-List-All`
    api._get(url).then(res => {
      this.setData({
        pageReady: true,
        mineList: res.Data || []
      })
      if (this.checkMineOrder(res.Data)) {
        setTimeout(() => {
          this.getMyList()
        }, 1000 * 10)
      }
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
      this.init(detail.key)
    }
  },
  init(key) {
    if (key === 'activity') {
      this.getActivityList()
    }
    if (key === 'activityMine') {
      this.getMyList()
    }
  },
  getUserInfo: function (e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toMineDetail (e) {
    const _data = this.data.mineList[e.currentTarget.dataset.index]
    if (_data.OrderState === 1) {
      wx.showToast({
        title: '该订单付款确认中',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (_data.CommodityType === 1) {
      wx.navigateTo({
        url: '/pages/activityGuide/activityGuide',
      })
    }
    if (_data.CommodityType === 2) {
      wx.navigateTo({
        url: `../courseDetail/courseDetail?proxyCourseID=${_data.CommodityID}&activityID=${_data.ID}`,
      })
    }
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: `../activityIntro/activityIntro?id=${e.currentTarget.dataset.id}`
    })
  },
  toExchange () {
    wx.navigateTo({
      url: `../exchange/exchange`
    })
  },
  redirectToPage (option) {
    wx.navigateTo({
      url: option.currentTarget.dataset.url,
    })
  },
  checkMineOrder (list = []) {
    let flag = false
    list.map(item => {
      if(item.OrderState === 1) {
        flag = true
      }
    })
    return flag
  }
})
