import { isLogin } from '../../utils/util.js'
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
    orderID : null,
    openID: null,
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
    if (!isLogin()) return false
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
  topay () {
    const that = this
    api._post(`/SPUser/PreOrder`,{
      packageID: this.data.activityId,
      refereeType: '2',
      refereeViewID: this.data.servantViewID,
    })
    .then(res => {
      if (res.Code === 100000) {
        if (res.Data.RedirectState === 0) {

          api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`).then(openIDRes=>{
            api._get(`/SPUser/PayShopInfo?orderID=${res.Data.OrderID}`).then(shopInfoRes=>{
              api._post(`/SPUser/CreateOrder?orderID=${res.Data.OrderID}&openID=${openIDRes.Data}&servantViewID=${that.data.servantViewID}`)
            })             //临时改了一下
            
          })
          
          
           
          

        }
      }
    })
    .then(res => {
    })
  },
  async getPayShopInfo(OrderID) {
    const res = await api._get(`/SPUser/PayShopInfo?orderID=${OrderID}`)
    return res
  },
  async getUserOpenID() {
    const res = await api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`)
    return res
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