import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'course',
    courseInfo: null,
    proxyCourseID: ''
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
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}`
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})