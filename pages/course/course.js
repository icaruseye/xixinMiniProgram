import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'course',
    hasUserInfo: false,
    pageReady: false,
    page: 1,
    totalNumber: 0,
    list: [],
    mineList: [],
    userInfo: {},
    mobile: '',
    showPopup: false,
    classifyBarIndex: 0, // 分类栏选中索引
    mainActiveIndex: null, //当前所选一级分类
    activeClassifyId: null, //当前分类id
    activeClassifyName: '精品课程',
    items: [
      {
        // 导航名称
        text: '所有城市',
        // 禁用选项
        disabled: false,
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: '大师课程',
            // id，作为匹配选中状态的标识
            id: 11,
          },
          {
            text: 'IT培训',
            id: 22
          }
        ]
      }
    ]
  },
  onLoad(options) {
    wx.setStorageSync('localUrl', this.route)
    if (options.isMine) {
      this.setData({
        current: 'courseMine'
      })
    }
    this.init()
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      mobile: wx.getStorageSync('mobile')
    })
    if (this.data.current === 'courseMine') {
      this.getMyList()
    }
  },
  loadMore () {
    this.setData({
      page: this.data.page + 1
    })
    this.getcourseList()
  },
  // 课程列表
  getcourseList() {
    api._get(`/User/ServantCourseList?page=${this.data.page}&servantViewID=${app.globalData.servantViewID}`, ).then(res => {
      this.setData({
        pageReady: true,
        totalNumber: res.Data.Total,
        list: [...this.data.list, ...res.Data.CourseInfoResponseList]
      })
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  // 我的课程
  getMyList() {
    api._get('/User/MyCourseList').then(res => {
      this.setData({
        pageReady: true,
        mineList: res.Data || []
      })
      if (this.checkMineOrder(res.Data)) {
        setTimeout(() => {
          this.getMyList()
        }, 1000 * 10)
      }
    }).catch(e => {
      this.setData({
        pageReady: true
      })
    })
  },
  handleChange({ detail }) {
    if (detail.key !== this.data.current) {
      this.setData({
        pageReady: false,
        page: 1,
        current: detail.key
      })
      this.init()
    }
  },
  init() {
    if (this.data.current === 'course') {
      this.setData({
        list: []
      })
      this.getcourseList()
    }
    if (this.data.current === 'courseMine') {
      this.getMyList()
    }
  },
  getUserInfo: function (e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理函数
  toDetail: function (e) {
    const ismine = e.currentTarget.dataset.ismine
    const index = e.currentTarget.dataset.index
    const item = ismine === '1' ? this.data.mineList[index] : this.data.list[index]
    const proxyCourseID = app.globalData.servantViewID ? item.ServantShopProxyCourseID : item.ShopProxyCourseID
    wx.navigateTo({
      url: `../courseDetail/courseDetail?proxyCourseID=${proxyCourseID}`
    })
  },
  toExchange() {
    wx.navigateTo({
      url: `../exchange/exchange`
    })
  },
  toMessage() {
    wx.navigateTo({
      url: `../message/message`
    })
  },
  checkMineOrder (list = []) {
    let flag = false
    list.map(item => {
      if(item.OrderState === 1) {
        flag = true
      }
    })
    return flag
  },
  // 选择一级分类
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  // 选择二级分类
  onClickItem({ detail = {} }) {
    console.log(detail)
    this.setData({
      activeClassifyId: detail.id,
      classifyBarIndex: 0,
      showPopup: false,
      activeClassifyName: detail.text
    });
  },
  // 显示分类弹层
  showPopup () {
    this.setData({
      showPopup: true
    })
  },
  // 关闭分类弹层
  onClose () {
    this.setData({
      showPopup: false
    })
  },
  // 分类栏点击事件
  changeClassify (e) {
    this.setData({
      activeClassifyId: Number(e.currentTarget.dataset.id),
      classifyBarIndex: Number(e.currentTarget.dataset.index)
    })
  },
  binderrorImage (e) {
    const index = e.currentTarget.dataset.index
    if (this.data.current === 'course') {
      this.data.list[index].Img = ''
      this.setData({
        list: this.data.list
      })
    } else {
      this.data.mineList[index].Img = ''
      this.setData({
        mineList: this.data.mineList
      })
    }
  }
})
