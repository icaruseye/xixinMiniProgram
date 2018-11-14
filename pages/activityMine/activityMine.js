import { isLogin } from '../../utils/util.js'
import Dialog from '../../dist/vant/dialog/dialog'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'activityMine',
    viewId: 'abc',
    list: [],
    pageReady: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow() {
    if (!isLogin(options)) return false
    this.getMyList()
  },
  getMyList() {
    const that = this
    wx.request({
      url: `${app.globalData.devApi}/api/User/Activity-My-List?viewId=${this.data.viewId}`,
      success(res) {
        that.setData({
          list: res.data.Data.MyActivityResult || []
        })
      },
      complete() {
        that.setData({
          pageReady: true
        })
      }
    })
  },
  handleChange({ detail }) {
    if (detail.key === this.data.current) return false
    wx.navigateTo({
      url: `../${detail.key}/${detail.key}`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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