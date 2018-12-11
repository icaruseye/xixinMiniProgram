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
      info: res,
      OrderType: options.OrderType
    })
    const orderInfo = await this.createOrder(options.orderID, options.openID)
    // 发起支付
    if (orderInfo.Price !== 0) {
      wx.requestPayment({
        timeStamp: orderInfo.timeStamp,
        nonceStr: orderInfo.nonceStr,
        package: orderInfo.package,
        signType: 'MD5',
        paySign: orderInfo.paySign,
        success(res) {
          api._post(`/User/PagePaySuccess?orderID=${options.orderID}`)
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
    } else {
      api._post(`/User/PagePaySuccess?orderID=${options.orderID}`)
      that.setData({
        status: 1
      })
    }
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
    if (this.data.OrderType === '2') {
      wx.redirectTo({
        url: '/pages/course/course',
      })
    }
    if (this.data.OrderType === '4' && wx.getStorageSync('servantViewID')) {
      wx.redirectTo({
        url: '/pages/activity/activity',
      })
    }
    if (this.data.OrderType === '4' && !wx.getStorageSync('servantViewID')) {
      wx.redirectTo({
        url: '/pages/activityCom/activityCom',
      })
    }
  },
  backMine () {
    if (this.data.OrderType === '2') {
      wx.redirectTo({
        url: '/pages/course/course?isMine=1',
      })
    }
    if (this.data.OrderType === '4' && wx.getStorageSync('servantViewID')) {
      wx.redirectTo({
        url: '/pages/activity/activity?isMine=1',
      })
    }
    if (this.data.OrderType === '4' && !wx.getStorageSync('servantViewID')) {
      wx.redirectTo({
        url: '/pages/activityCom/activityCom?isMine=1',
      })
    }
  }
})