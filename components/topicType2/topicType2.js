import { NumToLetter } from '../../utils/util.js'
import { watch, computed } from '../../utils/vuefy.js'

Component({
  properties: {
    data: {
      type: Object,
      value: {}
    },
    paperType: {
      type: Boolean,
      value: false
    },
    index: {
      type: Number,
      value: null,
      observer: function (newVal, oldVal) {
        this.init(newVal)
      }
    }
  },
  data: {
    answerInner: [],
    correctInner: '',
    updateVal: false
  },
  lifetimes: {
    attached() {
      watch(this, {
        updateVal: function () {
          if (!this.data.paperType) {
            this.setStorage(this.data.answerInner)
          }
        }
      })
    }
  },
  methods: {
    // 初始化
    init(index) {
      const answerList = wx.getStorageSync('userAnswerList')
      this.setAnsewer()
    },
    // 收集回答
    bindinput (e) {
      this.data.answerInner[e.currentTarget.dataset.key] = e.detail.value
      this.setData({
        answerInner: this.data.answerInner
      })
      if (!this.data.paperType) {
        this.setData({
          updateVal: !this.data.updateVal
        })
      }
    },
    // 缓存答题数据
    setStorage(newVal, correctInner) {
      const answerList = wx.getStorageSync('userAnswerList')
      if (correctInner) {
        answerList[this.data.index].correct = correctInner
      }
      answerList[this.data.index].Answer = newVal
      wx.setStorageSync('userAnswerList', answerList)
    },
    // 设置数据的结构
    setAnsewer() {
      const answerList = wx.getStorageSync('userAnswerList')
      let answerInner = []
      let correctInner = ''
      if (!answerList[this.data.index].Answer) {
        answerInner = Array(this.data.data.SelectionAmount).fill('')
      } else {
        answerInner = answerList[this.data.index].Answer
        correctInner = answerList[this.data.index].correct
      }
      this.setData({
        answerInner: answerInner,
        correctInner: correctInner
      })
    },
    // 提交答案
    submitAnswer() {
      if (this.data.answerInner.includes('')) {
        wx.showToast({
          title: '请完成回答再提交',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      if (JSON.stringify(this.data.answerInner) !== JSON.stringify(this.data.data.StrRightKey.split('><'))) {
        this.triggerEvent('setCourseWrongNums', {})
      } else {
        this.triggerEvent('setCourseRightNums', {})
      }
      this.setData({
        correctInner: this.data.data.StrRightKey.split('><')
      })
      this.setStorage(this.data.answerInner, this.data.data.StrRightKey.split('><'))
    }
  }
})