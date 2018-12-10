import api from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageReady: false,
    showForm: false,
    phone: '',
    captcha: '',
    captchaText: '发送验证码',
    captchaDisabled: false,
    sessionToken: '',
    mobileToken: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.login({
      success(res) {
        api._get(`/SPUser/GetSessionKey`, {
          servantViewID: wx.getStorageSync('servantViewID'),
          code: res.code,
        }).then(res => {   //将ViewID缓存
          wx.setStorageSync('sessionToken', res.Data)     //存下来等获取OpenID时使用
          that.setData({
            sessionToken: res.Data,
            pageReady: true
          })
        })
      }
    })
  },
  /**
   * 通过微信获取手机号 
   */
  getPhoneNumber(e) {
    const that = this
    if (!this.data.pageReady) return false
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.login({
        success(res) {
          api._get(`/SPUser/GetMobile?servantViewID=${that.data.viewID}`, {
            mobileString: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionToken: that.data.sessionToken,
          }).then(res => {
            that.setData({
              phone: res.Data.Mobile,
              mobileToken: res.Data.Token,
            })
            wx.showModal({
              title: '提示',
              content: `是否用${ res.Data.Mobile.substr(0, 3)}****${ res.Data.Mobile.substr(7, 4) }作为登录账号`,
              confirmText: '是',
              cancelText: '其他号码',
              success(res) {
                if (res.confirm) {
                  api._get('/SPUser/LoginMobile', {
                    mobile: that.data.phone,
                    vCode: '',
                    mobileToken: that.data.mobileToken,
                    sessionToken: wx.getStorageSync('sessionToken'),
                    servantViewID: wx.getStorageSync('servantViewID')
                  }).then(res => {
                    if (res.Code === 100000) {
                      wx.setStorageSync('token', res.Data)
                      wx.setStorageSync('mobile', that.data.phone)
                      wx.showToast({
                        title: '登录成功',
                        duration: 1500,
                        complete() {
                          wx.navigateBack({
                            delta: 1
                          })
                        }
                      })
                    }
                  })
                } else if (res.cancel) {
                  that.setData({
                    phone: '',
                    showForm: true
                  })
                }
              }
            })
          })
        }
      })
    }
  },
  /**
   * 其他手机号登录 
   */
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
    api._get('/SPUser/LoginMobile', {
      mobile: this.data.phone,
      vCode: this.data.captcha,
      mobileToken: '',
      sessionToken: wx.getStorageSync('sessionToken'),
      servantViewID: wx.getStorageSync('servantViewID')
    }).then(res => {
      if (res.Code === 100000) {
        wx.setStorageSync('token', res.Data)
        wx.setStorageSync('mobile', this.data.phone)
        wx.showToast({
          title: '登录成功',
          duration: 1500,
          complete() {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  /**
    * 记录输入的手机号
    */
  getInputPhone(e) {
    this.setData({
      phone: e.detail
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
      api._get('/SPUser/SendVCode', {
        mobile: this.data.phone
      }).then(res => {
        wx.showToast({
          title: '已发送',
        })
        this.setCaptchaText()
      })
    }
  },
  /**
   * 设置验证码按钮文字 
   */
  setCaptchaText() {
    let timer = 60
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
  toggleLoginWay () {
    this.setData({
      showForm: false
    })
  }
})