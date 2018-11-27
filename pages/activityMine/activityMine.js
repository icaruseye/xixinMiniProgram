import Dialog from '../../dist/vant/dialog/dialog'
import api from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'activityMine',
    pageReady: false,
    list: [],
    hasUserInfo: false,
    userInfo: {},
    mobile: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
  },
  onShow() {
    this.getMyList()
  },
  getMyList() {
    const that = this
    api._get('/SPUser/Activity-My-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
      that.setData({
        pageReady: true,
        list: res.Data || []
      })
    })
  },
  handleChange({ detail }) {
    if (detail.key === this.data.current) return false
    wx.navigateTo({
      url: `../${detail.key}/${detail.key}`
    })
  },
  getUserInfo: function (e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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