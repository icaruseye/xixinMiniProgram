import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'course',
    hasUserInfo: false,
    pageReady: false,
    page: 1,
    totalNumber: 0,
    list: [],
    mineList: [],
    userInfo: {},
    mobile: ''
  },
  onLoad(options) {
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
    this.init()
  },
  loadMore () {
    this.setData({
      page: this.data.page + 1
    })
    this.getcourseList()
  },
  // 课程列表
  getcourseList() {
    api._get(`/User/ServantCourseList?page=${this.data.page}&servantViewID=${app.globalData.servantViewID}`, ).then(res => {
      this.setData({
        pageReady: true,
        totalNumber: res.Data.Total,
        list: [...this.data.list, ...res.Data.CourseInfoResponseList]
      })
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  // 我的课程
  getMyList() {
    api._get('/User/MyCourseList').then(res => {
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
    const ismine = e.currentTarget.dataset.ismine
    const index = e.currentTarget.dataset.index
    const item = ismine === '1' ? this.data.mineList[index] : this.data.list[index]
    const proxyCourseID = app.globalData.servantViewID ? item.ServantShopProxyCourseID : item.ShopProxyCourseID
    wx.navigateTo({
      url: `../courseDetail/courseDetail?proxyCourseID=${proxyCourseID}`
    })
  },
  toExchange () {
    wx.navigateTo({
      url: `../exchange/exchange`
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
  },
  binderrorImage (e) {
    const index = e.currentTarget.dataset.index
    if (this.data.current === 'course') {
      this.data.list[index].Img = ''
      this.setData({
        list: this.data.list
      })
    } else {
      this.data.mineList[index].Img = ''
      this.setData({
        mineList: this.data.mineList
      })
    }
  }
})
