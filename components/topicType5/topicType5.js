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
    answerInner: '',
    correctInner: ''
  },
  lifetimes: {
    attached() {
      console.log('attached')
      watch(this, {
        answerInner: function (newVal) {
          console.log('answerInner update')
          if (!this.data.paperType) {
            this.setStorage(newVal)
          }
        }
      })
    }
  },
  methods: {
    // 初始化
    init(index) {
      const answerList = wx.getStorageSync('userAnswerList')
      this.setData({
        answerInner: answerList[this.data.index].Answer !== '' ? answerList[this.data.index].Answer : '',
        correctInner: this.data.paperType && answerList[this.data.index].Answer !== '' ? this.data.data.StrRightKey : ''
      })
    },
    // 收集回答
    bindinput(e) {
      console.log(e.detail.value)
      this.setData({
        answerInner: e.detail.value
      })
    },
    // 缓存答题数据
    setStorage(newVal) {
      const answerList = wx.getStorageSync('userAnswerList')
      answerList[this.data.index].Answer = newVal
      wx.setStorageSync('userAnswerList', answerList)
    },
    // 提交答案
    submitAnswer() {
      if (this.data.answerInner === '') {
        wx.showToast({
          title: '请完成回答再提交',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      if (this.data.answerInner !== this.data.data.StrRightKey) {
        this.triggerEvent('setCourseWrongNums', {})
      } else {
        this.triggerEvent('setCourseRightNums', {})
      }
      this.setData({
        correctInner: this.data.data.StrRightKey.split('><')
      })
      this.setStorage(this.data.answerInner)
    }
  }
})