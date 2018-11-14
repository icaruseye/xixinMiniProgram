// pages/loginPhone/loginPhone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    captcha: '',
    phone: '',
    sessionToken: '',
    mobileToken: '',
    viewID: '8abdf1fd447645cf80aba70c64c373f6',
    captchaText: '发送验证码',
    captchaDisabled: false
  },
  /**
   * 记录输入的手机号
   */
  getInputPhone(e) {
    this.setData({
      phone: e.detail
    })
  },

  getPhoneNumber(e) {
    const that = this
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    wx.login({
      success(res) {
        wx.request({
          url: `${app.globalData.devApi}/api/SPUser/GetMobile?servantViewID=${that.data.viewID}`,
          data: {
            mobileString: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionToken: that.data.sessionToken
          },
          success(res) {
            that.setData({
              phone: res.data.Data.Mobile,
              mobileToken: res.data.Data.Token,
            })
            console.log(res.data.SessionToken)
          },
          complete() {
            that.setData({
              pageReady: true
            })
          }
        })
      }
    })
  },
  /**
   * 记录输入的验证码
   */
  getInputCaptcha(e) {
    this.setData({
      captcha: e.detail
    })
  },
  /**
   * 验证手机号
   */
  checkPhoneNumber() {
    if (!this.data.phone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  /**
   * 获取手机验证码
   */
  getCaptcha() {
    if (this.checkPhoneNumber()) {
      this.setData({
        captchaDisabled: true
      })
      this.setCaptchaText()
      // wx.request({
      //   url: '',
      //   success (res) {
      //   }
      // })
    }
  },
  /**
   * 设置验证码按钮文字 
   */
  setCaptchaText() {
    let timer = 3
    let interval = setInterval(() => {
      if (timer > 0) {
        this.setData({
          captchaText: `重新发送(${timer--})`
        })
      } else {
        clearInterval(interval)
        this.setData({
          captchaText: `发送验证码`,
          captchaDisabled: false
        })
      }
    }, 1000)
  },
  login() {
    if (!this.data.phone.trim()) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!this.checkPhoneNumber()) {
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.login({
      success(res){
        wx.request({
          url: `${app.globalData.devApi}/api/SPUser/GetSessionKey?servantViewID=${that.data.viewID}`,
          data: {
            code: res.code,
          },
          success(res) {
            that.setData({
              sessionToken: res.data.Data,
            })
            console.log(res.data.Data)
          },
          complete() {
            that.setData({
              pageReady: true
            })
          }
        })
      }
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