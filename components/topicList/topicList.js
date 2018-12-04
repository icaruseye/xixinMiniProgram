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


    /**
     * 去做题
     */
    toTopic (e) {
      console.log(e)
    }
  }
})