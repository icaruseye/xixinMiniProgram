import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

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
  async onLoad(options) {
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
          wx.showLoading({
            title: '确认支付中...',
          })
          that.checkOrderState(options.orderID)
          // api._post(`/User/PagePaySuccess?orderID=${options.orderID}`)
          // that.setData({
          //   status: 1
          // })
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
  // 校验支付状态
  async checkOrderState (orderID) {
    const res = await api._get(`/SPUser/Order?orderID=${orderID}`, {}, {
      isNotShowloading: true
    })
    if (res.Code === 100000) {
      if (res.Data === 'False') {
        setTimeout(() => {
          this.checkOrderState(orderID)
        }, 1000 * 10)
      } else {
        wx.hideLoading()
        this.setData({
          status: 1
        })
      }
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
  async createOrder(orderID, openID) {
    const res = await api._post(`/SPUser/CreateOrder?orderID=${orderID}&openID=${openID}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },
  backIndex() {
    const key = this.data.OrderType
    switch (key) {
      case '2':
        wx.redirectTo({
          url: '/pages/course/course',
        })
        break;
      case '4':
        if (wx.getStorageInfoSync())
          wx.redirectTo({
            url: '/pages/activity/activity',
          })
        break;
    }
  },
  backMine() {
    const key = this.data.OrderType
    switch (key) {
      case '2':
        wx.redirectTo({
          url: '/pages/course/course?isMine=1',
        })
        break;
      case '4':
        wx.redirectTo({
          url: '/pages/activity/activity?isMine=1',
        })
        break;
    }
  }
})