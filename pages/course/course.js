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
  // 课程列表
  async getcourseList() {
    const that = this
    await api._get(`/User/CourseList?page=${this.data.page}`, ).then(res => {
      that.setData({
        pageReady: true,
        list: res.Data.proxyCourseResponseList || []
      })
    }).catch(e => {
      that.setData({
        pageReady: true
      })
    })
  },
  // 我的课程
  getMyList() {
    const that = this
    api._get('/User/Proxy-Course-List').then(res => {
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
      url: `../courseDetail/courseDetail?id=${e.currentTarget.dataset.id}`
    })
  }
})