import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'course',
    hasUserInfo: false,
    pageReady: false,
    page: 1,
    list: [],
    mineList: [],
    userInfo: {},
    mobile: ''
  },
  onLoad(options) {
    wx.setStorageSync('localUrl', this.route)
    console.log(app.globalData)
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
    this.init()
  },
  // 课程列表
  getcourseList() {
    api._get(`/User/CourseList?page=${this.data.page}&servantViewID=${app.globalData.servantViewID}`, ).then(res => {
      this.setData({
        pageReady: true,
        list: res.Data.proxyCourseResponseList || []
      })
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  // 我的课程
  getMyList() {
    api._get('/User/Proxy-Course-List').then(res => {
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
      this.init()
    }
  },
  init() {
    if (this.data.current === 'course') {
      this.getcourseList()
    }
    if (this.data.current === 'courseMine') {
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
  //事件处理函数
  toDetail: function (e) {
    wx.navigateTo({
      url: `../courseDetail/courseDetail?id=${e.currentTarget.dataset.id}&shopProxyCourse=${e.currentTarget.dataset.shopproxycourse}`
    })
  },
  toExchange () {
    wx.navigateTo({
      url: `../exchange/exchange`
    })
  }
})
