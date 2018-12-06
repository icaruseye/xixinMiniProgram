import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Component({
  properties: {
    paperType: {
      type: Boolean,
      value: false
    },
    TestPaperName: String,
    wrongNums: Number,
    rightNums: Number
  },
  data: {
    answerList: []
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('attached')
      this.setData({
        answerList: this.setAnswerList(wx.getStorageSync('userAnswerList'))
      })
      console.log(this.data.answerList)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log('detached')
    }
  },
  methods: {
    clickItem(e) {
      this.triggerEvent('onClick', e.currentTarget.dataset.key)
    },
    setAnswerList (arr) {
      return arr.map((item) => {
        if (item.type === 4 || item.type === 2) {
          item.Answer = item.Answer.toString()
          if (item.correct) {
            item.correct = item.correct.toString()
          }
        }
        return item
      })
    }
  }
})