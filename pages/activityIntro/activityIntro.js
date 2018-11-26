import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import Dialog from '../../dist/vant/dialog/dialog'
import api from '../../utils/api.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    show: false,
    pageReady: false,
    activityId: 2,
    servantViewID: wx.getStorageSync('servantViewID')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
      activityId: options.id
    })
    this.getActivityDetail(this.data.activityId)
  },
  onShow () {
  },
  getActivityDetail (activityId) {
    const that = this
    api._get(`/SPUser/Activity-Detail?activityId=${activityId}`)
    .then(res => {
      res.Data.ActivityIntroductionImg = res.Data.ActivityIntroductionImg.split(',')
      that.setData({
        pageReady: true,
        info: res.Data
      })
    })
  },
  async topay () {
    const resPreOrder = await this.preOrder()
    const resOpenID = await this.getUserOpenID()
    if (resPreOrder.OrderID && resOpenID) {
      wx.navigateTo({
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}`
      })
    }
  },
  async preOrder () {
    const res = await api._post(`/SPUser/PreOrder`, {
      packageID: this.data.activityId,
      refereeType: '2',
      refereeViewID: this.data.servantViewID,
    })
    if (res.Code === 100000) {
      return res.Data
    }
  },
  async getUserOpenID() {
    const res = await api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },
  toDetail (e) {
    this.setData({
      show: true
    })
  },
  onClose () {
    this.setData({
      show: false
    })
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