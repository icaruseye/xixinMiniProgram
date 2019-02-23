import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    current: 'course',
    hasUserInfo: false,
    pageReady: false,
    page: 1,
    pageSize: 8,
    totalNumber: 0,
    list: [],
    mineList: [],
    userInfo: {},
    mobile: '',
    showPopup: false,
    mainActiveIndex: null, //当前所选一级分类
    activeClassifyId: null, //当前分类id
    activeClassifyName: '',
    typeList: [], // 默认分类
    items: [] //下拉一二级分类数据
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
  //  初始化
  async init() {
    if (this.data.current === 'course') {
      this.setData({
        list: []
      })
      await this.getCourseType()
      await this.getCourseTypeFirst()
      await this.getcourseList()
    }
    if (this.data.current === 'courseMine') {
      this.getMyList()
    }
  },
  // 获取所有一级课程分类
  async getCourseTypeFirst() {
    let _arr = []
    const res = await api._get('/User/CourseType/First')
    if (res.data) {
      res.Data.map(item => {
        _arr.push(Object.assign({}, {
          text: item.label,
          id: item.value
        }))
      })
      console.log(_arr)
      this.setData({
        items: _arr
      })
      this.getCourseTypeSecond(_arr[0].id, 0)
    }
  },
  // 获取二级菜单
  async getCourseTypeSecond(courseTypeID, index) {
    let _arr = []
    const res = await api._get(`/User/CourseType/Second?courseTypeID=${courseTypeID}`)
    res.Data.map(item => {
      _arr.push(Object.assign({}, {
        text: item.label,
        id: item.value
      }))
    })
    this.data.items[index].children = _arr
    this.setData({
      items: this.data.items
    })
  },
  // 获取顶部默认分类
  async getCourseType() {
    const res = await api._get('/User/CourseType/List')
    console.log(res)
    this.setData({
      typeList: res.Data,
      activeClassifyId: res.Data[0].value,
      activeClassifyName: res.Data[0].label
    })
  },
  // 课程列表
  async getcourseList() {
    const res = await api._get(`/User/CourseTyp/Course?page=${this.data.page}&pageSize=${this.data.pageSize}&courseTypeID=${this.data.activeClassifyId}&servantViewID=${app.globalData.servantViewID}`)
    this.setData({
      pageReady: true,
      totalNumber: res.Data.Count,
      list: res.Data.List
    })
  },
  // 课程列表分页
  async getcourseListMore() {
    const res = await api._get(`/User/CourseTyp/Course?page=${this.data.page}&pageSize=${this.data.pageSize}&courseTypeID=${this.data.activeClassifyId}&servantViewID=${app.globalData.servantViewID}`)
    this.setData({
      pageReady: true,
      list: [...this.data.list, ...res.Data.List]
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
  loadMore() {
    this.setData({
      page: this.data.page + 1
    })
    this.getcourseListMore()
  },
  handleChange({
    detail
  }) {
    if (detail.key !== this.data.current) {
      this.setData({
        pageReady: false,
        page: 1,
        current: detail.key
      })
      this.init()
    }
  },
  getUserInfo: function(e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理函数
  toDetail: function(e) {
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
  checkMineOrder(list = []) {
    let flag = false
    list.map(item => {
      if (item.OrderState === 1) {
        flag = true
      }
    })
    return flag
  },
  // 选择一级分类
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    })
    this.getCourseTypeSecond(this.data.items[detail.index].id, detail.index)
  },
  // 选择二级分类
  onClickItem({
    detail = {}
  }) {
    console.log(detail)
    this.setData({
      activeClassifyId: detail.id,
      showPopup: false,
      activeClassifyName: detail.text,
      page: 1
    })
    this.getcourseList()
  },
  // 显示分类弹层
  showPopup() {
    this.setData({
      showPopup: true
    })
  },
  // 关闭分类弹层
  onClose() {
    this.setData({
      showPopup: false
    })
  },
  // 分类栏点击事件
  changeClassify(e) {
    if (Number(e.currentTarget.dataset.id) === this.data.activeClassifyId) return false
    this.setData({
      activeClassifyId: Number(e.currentTarget.dataset.id),
      activeClassifyName: e.currentTarget.dataset.name
    })
    this.getcourseList()
  },
  binderrorImage(e) {
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