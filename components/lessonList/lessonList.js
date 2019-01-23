import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Component({
  properties: {
    proxyCourseID: Number,
    type: Number
  },
  data: {
    lessonList: [],
    pageIndex: 0
  },
  lifetimes: {
    ready () {
      this.getLessonList()
    }
  },
  methods: {

    /**
     * 获取课程列表
     */
    async getLessonList() {
      const res = await api._get(`/User/ShopProxyCourseLessonList`, {
        page: this.data.pageIndex,
        proxyCourseID: this.data.proxyCourseID,
        Type: this.data.type
      })
      this.setData({
        lessonList: res.Data
      })
    },

    /**
     * 选择章节
     */
    async selectLesson (e) {
      let type = e.currentTarget.dataset.type
      let id = e.currentTarget.dataset.id
      let contentID = e.currentTarget.dataset.contentid
      if (type === 1) {
        this.setData({
          curr: id
        })
        this.triggerEvent('selectLesson', id)
      }
      if (type === 2) {
        let lessonID = e.currentTarget.dataset.Content
        wx.navigateTo({
          url: `/pages/coursewareDetail/coursewareDetail?proxyCourseID=${this.data.proxyCourseID}&id=${contentID}`
        })
      }
      if (type === 4) {
        const res = await api._get(`/User/CouldExam`, {
          testPaperID: contentID,
          proxyCourseID: this.data.proxyCourseID,
          Type: this.data.type
        })

        if (res.Data) {
          wx.navigateTo({
            url: `/pages/topic/topic?id=${contentID}&recordID=${res.Data}`,
          })
        }
      }
    }
  }
})