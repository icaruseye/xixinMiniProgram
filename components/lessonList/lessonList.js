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
    selectLesson (e) {
      this.setData({
        curr: e.currentTarget.dataset.id
      })
      this.triggerEvent('selectLesson', e.currentTarget.dataset.id)
    }
  }
})