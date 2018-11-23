import Dialog from '../../dist/vant/dialog/dialog'
import { isLogin } from '../../utils/util.js'
import api from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'activityMine',
    list: [],
    pageReady: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('localUrl', this.route)
  },
  onShow() {
    console.log('onShow-mine')
    if (!isLogin()) return false
    this.getMyList()
  },
  getMyList() {
    const that = this
    api._get('/SPUser/Activity-My-List', {
      viewId: wx.getStorageSync('servantViewID')
    }).then(res => {
      that.setData({
        pageReady: true,
        list: res.Data.MyActivityResult || []
      })
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