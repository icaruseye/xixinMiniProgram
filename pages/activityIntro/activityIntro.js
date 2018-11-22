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
    activityId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
      activityId: options.id || 2
    })
  },
  onShow () {
    if (!isLogin()) return false
    this.getActivityDetail(this.data.activityId)
  },
  getActivityDetail (activityId) {
    const that = this
    api._get(`/User/Activity-Detail?activityId=${activityId}`)
    .then(res => {
      res.Data.ActivityIntroductionImg = res.Data.ActivityIntroductionImg.split(',')
      that.setData({
        pageReady: true,
        info: res.Data
      })
    })
  },
  topay () {
    
  },
  toDetail (e) {
    this.setData({
      show: true
    })
    // wx.navigateTo({
    //   url: `../itemDetail/itemDetail?id=${e.currentTarget.dataset.id}`
    // })
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