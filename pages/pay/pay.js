import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const that = this
    const res = await this.getPayShopInfo(options.orderID)
    this.setData({
      info: res
    })
    const orderInfo = await this.createOrder(options.orderID, options.openID, wx.getStorageSync('servantViewID'))
    // 发起支付
    wx.requestPayment({
      timeStamp: orderInfo.timeStamp,
      nonceStr: orderInfo.nonceStr,
      package: orderInfo.package,
      signType: 'MD5',
      paySign: orderInfo.paySign,
      success(res) {
        that.setData({
          status: 1
        })
      },
      fail(res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  onShow() {
  },
  // 获取订单信息接口
  async getPayShopInfo(orderID) {
    const res = await api._get(`/SPUser/PayShopInfo?orderID=${orderID}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },
  // 创建订单
  async createOrder (orderID, openID, servantViewID) {
    const res = await api._post(`/SPUser/CreateOrder?orderID=${orderID}&openID=${openID}&servantViewID=${servantViewID}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },
  backIndex () {
    wx.redirectTo({
      url: '/pages/activity/activity',
    })
  },
  backMine () {
    wx.redirectTo({
      url: '/pages/activityMine/activityMine',
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