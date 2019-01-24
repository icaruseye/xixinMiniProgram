import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proxyCourseID: Number,
    type: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageIndex: 1,
    shopProxyCourseEnclosureList: []
  },
  lifetimes: {
    attached () {
      this.getCourseEnclosureList()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    redirectToDetail (e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/coursewareDetail/coursewareDetail?proxyCourseID=${this.data.proxyCourseID}&id=${id}`
      })
    },
    async getCourseEnclosureList () {
      const res = await api._get(`/User/CourseEnclosure/List`, {
        page: this.data.pageIndex,
        proxyCourseID: this.data.proxyCourseID,
        Type: this.data.type
      })
      if (res.Code === 100000) {
        this.setData({
          shopProxyCourseEnclosureList: res.Data.shopProxyCourseEnclosureList
        })
      }
    }
  }
})
