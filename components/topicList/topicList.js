import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Component({
  properties: {
    proxyCourseID: Number
  },
  data: {
    topicList: [],
    pageIndex: 1,
    curr: null
  },
  lifetimes: {
    attached() {
      this.getTopicList()
    }
  },
  methods: {

    /**
     * 获取课程列表
     */
    async getTopicList() {
      const res = await api._get(`/User/ShopProxyCourseTestPaperList`, {
        page: this.data.pageIndex,
        proxyCourseID: this.data.proxyCourseID
      })
      this.setData({
        topicList: res.Data.shopProxyCourseTestPaper
      })
    },

    async getCouldExam(id) {
      const res = await api._get(`/User/CouldExam?testPaperID=${id}`)
      if (res.Data) {
        wx.navigateTo({
          url: `/pages/topic/topic?id=${id}&recordID=${res.Data}`,
        })
      }
    },

    /**
     * 去做题
     */
    async toTopic (e) {
      console.log(e)
      const recordID = await this.getCouldExam(e.currentTarget.dataset.id)
      if (recordID) {
        wx.navigateTo({
          url: `/pages/topic/topic?recordID=${recordID}`,
        })
      }
    }
  }
})