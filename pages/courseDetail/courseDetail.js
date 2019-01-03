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
    proxyCourseID: '',
    activityID:'',
    referrerViewID: '',
    referrerType: '',
    type: app.globalData.servantViewID ? 1 : 2, // 接口标识是否有servantViewID
  },

  onShareAppMessage: function (res) {
    let myReferrerViewID = wx.getStorageSync('myReferrerViewID')
    let referrerType = 1 //推荐人类型1为用户,2位服务人员,0为不推荐
    let servantViewID = app.globalData.servantViewID || ''
    if (myReferrerViewID) { //之前已经赋初值了
    } else if (servantViewID) {
      referrerType = 2
      myReferrerViewID = servantViewID
    } else {
      referrerType = 0
    }
    return {
      title: this.data.courseInfo.ShopProxyCourseName,
      path: `/pages/courseDetail/courseDetail?id=${this.data.proxyCourseID}&referrerViewID=${myReferrerViewID}&referrerType=${referrerType}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
<<<<<<< HEAD
      proxyCourseID: options.proxyCourseID,
      activityID: options.activityID || ''
=======
      proxyCourseID: options.proxyCourseID
>>>>>>> 06baff610953f4a66b0b312373cd268b6d95931d
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
      proxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    if (res.Data.Img) {
      res.Data.Img = res.Data.Img.split(',')
    }
    this.setData({
      courseInfo: res.Data
    })
  },

  async getLicenceCheck () {
    const res = await api._get('/User/Course/Licence/Check', {
      shopProxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    this.setData({IsPurchased: res.Data})
  },

  /**
   * 选择课程
   */
  async selectLesson (e) {
    const res = await api._get('/User/CouldWatchingVideo', {
      lessonID: e.detail,
      proxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    this.setData({
      'courseInfo.PreViewContent': res.Data,
      'courseInfo.PreViewType': 1
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
      OrderType: 6,
      RefereeType: this.data.referrerType,
      RefereeViewID: this.data.referrerViewID,
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
  },
  binderrorImage () {
    this.setData({
      'courseInfo.Img': ''
    })
  }
})