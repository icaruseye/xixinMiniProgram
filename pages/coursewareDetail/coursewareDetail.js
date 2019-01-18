import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    coursewareID: '',
    proxyCourseID: '',
    imgList: [],
    showMenuDialog: false
  },
  openMenuDialog () {
    this.setData({
      showMenuDialog: true
    })
  },
  closeMenuDialog() {
    this.setData({
      showMenuDialog: false
    })
  },
  changeSwiperCurrent (e) {
    this.setData({
      showMenuDialog: false,
      currentIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      coursewareID: options.id,
      proxyCourseID: options.proxyCourseID
    })
    this.getCoursewareDetail()
  },

  /**
   * 获取课件详情
   */
  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  getCoursewareDetail () {
    api._get(`/User/CourseEnclosure/CouldWatchEnclosure`, {
      courseEnclosureID: this.data.coursewareID,
      proxyCourseID: this.data.proxyCourseID
    }).then(res => {
      this.setData({
        imgList: JSON.parse(res.Data)
      })
    }, (error) => {
      wx.navigateBack({
        delta: 1,
        complete: () => {
          wx.showToast({
            title: error.data.Msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
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