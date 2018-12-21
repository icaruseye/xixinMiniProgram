import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeKey: '',
    pwd: '',
    captcha: '',
    codeImage: `${api.baseUrl}/SPUser/VerificationCode?codeType=1&width=100&height=40&token=${wx.getStorageSync('token')}`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  activationCode () {
    api._post(`/SPUser/ActivationCode/Activate`, {
      codeKey: this.data.codeKey,
      pwd: this.data.pwd,
      vCode: this.data.captcha
    }).then(res => {
      this.setData({
        codeKey: '',
        pwd: '',
        captcha: '',
      })
      wx.showModal({
        title: '提示',
        content: '兑换成功',
        confirmText: '去查看',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/course/course?isMine=1',
            })
          }
        }
      })
    }).catch(e => {
      if (e.data.Code !== 100000) {
        this.getNewCodeIamge()
        wx.showToast({
          title: e.data.Msg,
          icon: 'none'
        })
        this.setData({
          captcha: ''
        })
      }
    })
  },
  submit () {
    if (!this.data.codeKey.trim()) {
      wx.showToast({
        title: '卡号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!this.data.pwd.trim()) {
      wx.showToast({
        title: '卡密不能为空',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!this.data.captcha.trim()) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    this.activationCode()
  },
  /**
    * 记录输入的卡号
    */
  getInputCodeKey(e) {
    this.setData({
      codeKey: e.detail.value
    })
  },
  /**
   * 记录输入的卡密
   */
  getInputPwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  /**
   * 记录输入的卡密
   */
  getInputCaptcha(e) {
    this.setData({
      captcha: e.detail.value
    })
  },
  getNewCodeIamge () {
    this.setData({
      codeImage: this.data.codeImage + new Date().getTime()
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