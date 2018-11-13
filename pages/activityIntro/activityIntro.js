// pages/activityIntro/activityIntro.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    show: false,
    pageReady: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getActivityDetail(options.id)
  },
  getActivityDetail (activityId) {
    const that = this
    wx.request({
      url: `${app.globalData.devApi}/api/User/Activity-Detail?activityId=${activityId}`,
      success (res) {
        res.data.Data.ActivityIntroductionImg = res.data.Data.ActivityIntroductionImg.split(',')
        that.setData({
          info: res.data.Data
        })
      },
      complete() {
        that.setData({
          pageReady: true
        })
      }
    })
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