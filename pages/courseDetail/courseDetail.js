import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'course',
    courseInfo: {},
    IsPurchased: true,
    proxyCourseID: ''
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.courseInfo.ShopProxyCourseName,
      path: `/pages/courseDetail/courseDetail?id=${this.data.proxyCourseID}&userID=${wx.getStorageSync('userID')}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
      proxyCourseID: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCourseInfo()
    this.getLicenceCheck()
  },

  /**
   * 获取课程详情
   */
  async getCourseInfo () {
    const res = await api._get('/User/ShopProxyCourseDetails', {
      proxyCourseID: this.data.proxyCourseID
    })
    this.setData({
      courseInfo: res.Data
    })
  },

  async getLicenceCheck () {
    const res = await api._get('/SPUser/Course/Licence/Check', {
      shopProxyCourseID: this.data.proxyCourseID
    })
    this.setData({IsPurchased: res.Data})
  },

  /**
   * 选择课程
   */
  async selectLesson (e) {
    const res = await api._get('/User/CouldWatchingVideo', {
      lessonID: e.detail,
      proxyCourseID: this.data.proxyCourseID
    })
    this.setData({
      'courseInfo.PreViewContent': res.Data
    })
  },

  async topay() {
    const resPreOrder = await this.preOrder(this.data.proxyCourseID)
    const resOpenID = await this.getUserOpenID()
    if (resPreOrder.OrderID && resOpenID) {
      wx.navigateTo({
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}&OrderType=2`
      })
    }
  },

  async getUserOpenID() {
    const res = await api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },

  async preOrder(packageID) {
    const res = await api._post(`/SPUser/PreOrder`, {
      packageID: packageID,
      OrderType: 2,
      refereeType: '2',
      refereeViewID: wx.getStorageSync('servantViewID'),
    })
    if (res.Code === 100000) {
      return res.Data
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.getCourseInfo()
  },

  /**
   * tabs切换
   */
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  }
})