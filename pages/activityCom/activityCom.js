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
    mobile: '',
    shopID: ''
  },
  onLoad(options) {
    wx.setStorageSync('servantViewID', options.servantViewID)
    wx.setStorageSync('localUrl', this.route)
    // this.setData({
    //   shopID: options.shopID
    // })
    if (options.isMine) {
      this.setData({
        current: 'activityMine',
        // shopID: options.id
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
  },
  onShow() {
    this.getActivityList()
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // 活动列表
  async getActivityList() {
    const that = this
    await api._get(`/SPUser/Activity/List/All`).then(res => {
      that.setData({
        pageReady: true,
        list: res.Data || []
      })
    }).catch(e => {
      that.setData({
        pageReady: true
      })
    })
  },
  // 我的活动
  getMyList() {
    const that = this
    if (wx.getStorageSync('servantViewID') !== "") {              //是不是有更优雅的写法???
      api._get('/SPUser/Activity-My-List', {
        viewId: wx.getStorageSync('servantViewID')
      }).then(res => {
        that.setData({
          pageReady: true,
          mineList: res.Data || []
        })
      }).catch(e => {
        that.setData({
          pageReady: true
        })
      })
    }
    else{
      api._get('/SPUser/Activity-My-List-All', {
      }).then(res => {
        that.setData({
          pageReady: true,
          mineList: res.Data || []
        })
      }).catch(e => {
        that.setData({
          pageReady: true
        })
      })
    }
  },
  handleChange({
    detail
  }) {
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
  getUserInfo: function(e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toGuide() {
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