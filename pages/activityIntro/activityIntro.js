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
    activityId: '',
    servantViewID: wx.getStorageSync('servantViewID') || '',
    userId: ''
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.info.ActivityName,
      path: `/pages/activityIntro/activityIntro?id=${this.data.activityId}&${this.data.userId}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.setStorageSync('localUrl', `${this.route}?id=${options.id}`)
    this.setData({
      activityId: options.id,
      userId: app.globalData.userId
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
      this.setData({
        pageReady: true,
        info: res.Data
      })
    })
  },
  async topay () {
    const resPreOrder = await this.preOrder(this.data.activityId)
    const resOpenID = await this.getUserOpenID()
    if (resPreOrder.OrderID && resOpenID) {
      wx.navigateTo({
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}`
      })
    }
  },
  async preOrder(packageID) {
    const res = await api._post(`/SPUser/PreOrder`, {
      packageID: packageID,
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
  }
})