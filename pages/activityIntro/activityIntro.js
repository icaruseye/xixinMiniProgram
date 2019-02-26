import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import Dialog from '../../dist/vant/dialog/dialog'
import api from '../../utils/api.js'
import timer from '../../utils/wxTimer.js'
const app = getApp()
let wxTimerInterval = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    show: false,
    pageReady: false,
    activityId: '',
    referrerViewID: '',
    referrerType: '',
    currentTabIndex: 0,
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: [],
    isStart: true,
    isEnd: false
  },

  onShareAppMessage: function(res) {
    let myReferrerViewID = wx.getStorageSync('myReferrerViewID') //分享人的ViewID
    let referrerType = 1 //推荐人类型1为用户,2位服务人员,0为不推荐
    let servantViewID = app.globalData.servantViewID
    if (myReferrerViewID) { //之前已经赋初值了
    } else if (servantViewID) {
      referrerType = 2
      myReferrerViewID = servantViewID
    } else {
      referrerType = 0
    }
    return {
      title: this.data.info.ActivityName,
      path: `/pages/activityIntro/activityIntro?id=${this.data.activityId}&referrerViewID=${myReferrerViewID}&referrerType=${referrerType}&servantViewID=${servantViewID}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setStorageSync('localUrl', `${this.route}?id=${options.id}`)
    this.setData({
      activityId: options.id
    })
    wx.setStorageSync('referrerType', options.referrerType || 0)
    wx.setStorageSync('referrerViewID', options.referrerViewID || '')
    if (!app.globalData.servantViewID) { //若全局servantViewID为空,则从本页面获取下赋值
      app.globalData.servantViewID = options.servantViewID
    }
  },
  onShow() {
    console.log(new Date().getSeconds())
    console.log(new Date())
    this.getActivityDetail(this.data.activityId)
  },
  onHide () {
    wxTimerInterval.stop()
  },
  initTimer(StartTime, EndTime) {
    let _StartTime = Date.parse(new Date(StartTime))
    let _EndTime = Date.parse(new Date(EndTime))
    let _now = Date.parse(new Date())
    let times = 0
    if (_EndTime < _now) {
      this.setData({
        isEnd: true
      })
      return false
    }
    if (_StartTime > _now) {
      times = _StartTime - _now
    } else {
      times = _EndTime - _now
    }
    console.log(times)
    this.setData({
      isStart: _StartTime <= _now
    })
    wxTimerInterval = new timer({
      beginTime: times,
      name: 'timer'
    })
    wxTimerInterval.start(this)
  },
  getActivityDetail(activityId) {
    const that = this
    api._get(`/SPUser/Activity-Detail?activityId=${activityId}`)
      .then(res => {
        res.Data.ActivityIntroductionImg = res.Data.ActivityIntroductionImg.split(',')
        this.setData({
          pageReady: true,
          info: res.Data
        })
        this.initTimer(this.data.info.StartTime, this.data.info.EndTime)
      })
  },
  async topay() {
    if (!this.data.isStart) return
    const resPreOrder = await this.preOrder(this.data.activityId)
    const resOpenID = await this.getUserOpenID()
    if (resPreOrder.OrderID && resOpenID) {
      wx.navigateTo({
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}&OrderType=4`
      })
    }
  },
  async preOrder(packageID) {
    const res = await api._post(`/SPUser/PreOrder`, {
      packageID: packageID,
      OrderType: 4,
      RefereeType: wx.getStorageSync('referrerType') || 0,
      RefereeViewID: wx.getStorageSync('referrerViewID') || '',
    })
    if (res.Code === 100000) {
      return res.Data
    }
  },
  async getUserOpenID() {
    const res = await api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },
  toDetail(e) {
    this.setData({
      show: true
    })
  },
  handleTabChange ({detail}) {
    this.setData({
      currentTabIndex: detail.key
    })
  },
  toHome () {
    wx.navigateTo({
      url: '/pages/activity/activity',
    })
  }
})