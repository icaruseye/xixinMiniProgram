import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'course',
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
        current: 'courseMine'
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
  },
  onShow() {
    this.getcourseList()
  },
  // 活动列表
  async getcourseList() {
    const that = this
    await api._get('/SPUser/course-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
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
    api._get('/SPUser/course-My-List', {
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
  },
  handleChange({ detail }) {
    if (detail.key !== this.data.current) {
      this.setData({
        pageReady: false,
        current: detail.key
      })
      if (detail.key === 'course') {
        this.getcourseList()
      }
      if (detail.key === 'courseMine') {
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
  //事件处理函数
  toDetail: function (e) {
    wx.navigateTo({
      url: `../courseDeatail/courseDeatail?id=${e.currentTarget.dataset.id}`
    })
  }
})
