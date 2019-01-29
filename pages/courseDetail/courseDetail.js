import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'intro',
    courseInfo: null,
    IsPurchased: true,
    proxyCourseID: '',
    activityID:'',
    referrerViewID: '',
    referrerType: '',
    type: app.globalData.servantViewID ? 1 : 2, // 接口标识是否有servantViewID
    lessonList: [],
    audioSrc: '',
    lessonname: '',
    chaptername: '',
    currentIndex: null
  },

  onShareAppMessage: function (res) {
    let myReferrerViewID = wx.getStorageSync('myReferrerViewID')
    let referrerType = 1 //推荐人类型1为用户,2位服务人员,0为不推荐
    let servantViewID = app.globalData.servantViewID || ''
    if (myReferrerViewID) { //之前已经赋初值了
    } else if (servantViewID) {
      referrerType = 2
      myReferrerViewID = servantViewID
    } else {
      referrerType = 0
    }
    return {
      title: this.data.courseInfo.ShopProxyCourseName,
      path: `/pages/courseDetail/courseDetail?proxyCourseID=${this.data.proxyCourseID}&referrerViewID=${myReferrerViewID}&referrerType=${referrerType}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('localUrl', this.route)
    this.setData({
      proxyCourseID: options.proxyCourseID,
      activityID: options.activityID || '',
      referrerType: options.referrerType || 0,
      referrerViewID: options.referrerViewID || ''
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCourseInfo()
    this.getLicenceCheck()
    this.getLessonList()
  },

  /**
   * 获取课程详情
   */
  async getCourseInfo () {
    const res = await api._get('/User/ShopProxyCourseDetails', {
      proxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    if (res.Data.Img) {
      res.Data.Img = res.Data.Img.split(',')
    }
    this.setData({
      courseInfo: res.Data
    })
  },

  /**
   * 获取课程列表
   */
  async getLessonList() {
    const res = await api._get(`/User/ShopProxyCourseLessonList`, {
      page: 0,
      proxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    this.setData({
      lessonList: res.Data
    })
  },

  // 播放第一个章节
  playFirstLesson () {
    if (this.data.lessonList.length > 0) {
      if (this.data.lessonList[0].lessonResponse.length >0) {
        const detail = this.data.lessonList[0].lessonResponse[0]
        if (detail.ContentType === 1) {
          this.selectLesson({
            detail: {
              contentType: 1,
              id: detail.LessonID
            },
            proxyCourseID: this.data.proxyCourseID,
            Type: this.data.type
          })
        }
        if (detail.ContentType === 2) {
          wx.navigateTo({
            url: `/pages/coursewareDetail/coursewareDetail?proxyCourseID=${this.data.proxyCourseID}&id=${detail.Content}`
          })
        }
        if (detail.ContentType === 3) {
          this.selectLesson({
            detail: {
              contentType: 3,
              id: detail.LessonID
            },
            proxyCourseID: this.data.proxyCourseID,
            Type: 3
          })
        }
        this.setData({
          current: 'course',
          currentIndex: detail.LessonID
        })
      }
    } else {
      wx.showToast({
        title: '章节暂无内容',
        icon: 'none',
        duration: 1500
      })
    }
  },
  async getLicenceCheck () {
    const res = await api._get('/User/Course/Licence/Check', {
      shopProxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    this.setData({IsPurchased: res.Data})
  },

  /**
   * 选择课程
   */
  async selectLesson (e) {
    const res = await api._get('/User/CouldWatchingVideo', {
      lessonID: e.detail.id,
      proxyCourseID: this.data.proxyCourseID,
      Type: this.data.type
    })
    if (e.detail.contentType === 1) {
      this.setData({
        'courseInfo.PreViewContent': res.Data,
        'courseInfo.PreViewType': 1
      })
    }
    if (e.detail.contentType === 3) {
      this.setData({
        audioSrc: res.Data,
        lessonname: e.detail.lessonname,
        chaptername: e.detail.chaptername,
        'courseInfo.PreViewType': 3
      })
    }
  },

  async topay() {
    const resPreOrder = await this.preOrder(this.data.proxyCourseID)
    const resOpenID = await this.getUserOpenID()
    if (resPreOrder.OrderID && resOpenID) {
      wx.navigateTo({
        url: `/pages/pay/pay?orderID=${resPreOrder.OrderID}&openID=${resOpenID}&OrderType=2`
      })
    }
  },

  async getUserOpenID() {
    const res = await api._get(`/SPUser/UserOpenID?sessionToken=${wx.getStorageSync('sessionToken')}`)
    if (res.Code === 100000) {
      return res.Data
    }
  },

  async preOrder(packageID) {
    const res = await api._post(`/SPUser/PreOrder`, {
      packageID: packageID,
      OrderType: 6,
      RefereeType: this.data.referrerType,
      RefereeViewID: this.data.referrerViewID,
    })
    if (res.Code === 100000) {
      return res.Data
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.getCourseInfo()
  },

  /**
   * tabs切换
   */
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  binderrorImage () {
    this.setData({
      'courseInfo.Img': ''
    })
  }
})