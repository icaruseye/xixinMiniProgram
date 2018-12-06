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
    NumToLetter: '',
    updateVal: false
  },
  lifetimes: {
    attached() {
      console.log('attached')
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
      console.log('多选题init')
      const answerList = wx.getStorageSync('userAnswerList')
      const { answerInner, correctInner } = this.setAnswer(index)
      console.log(correctInner)
      this.setData({
        answerInner: answerList[index].Answer || answerInner,
        correctInner: this.data.paperType && answerList[index].Answer !== '' ? correctInner : '',
        NumToLetter: ''
      })
    },
    // 选择选项
    selectItem(e) {
      let answerInner = this.data.answerInner
      if (!answerInner.includes(e.currentTarget.dataset.key)) {
        answerInner[e.currentTarget.dataset.key] = e.currentTarget.dataset.key
        this.setData({
          answerInner: answerInner
        })
      } else {
        answerInner[e.currentTarget.dataset.key] = null
        this.setData({
          answerInner: answerInner
        })
      }
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
    // 设置回答、答案数据结构
    setAnswer(index) {
      const answerList = wx.getStorageSync('userAnswerList')
      let correctInner = []
      let answerInner = []
      let StrRightKey = this.data.paperType ? this.data.data.StrRightKey.split(',').map(Number) : [] 
      for (let i = 0; i < answerList[this.data.index].answerlength - 1; i++) {
        correctInner.push(null)
        answerInner.push(null)
        if (StrRightKey[i]) {
          correctInner[StrRightKey[i]] = StrRightKey[i]
        }
      }
      correctInner.length = answerList[this.data.index].answerlength
      return {
        answerInner: answerInner,
        correctInner: correctInner
      }
    },
    // 提交答案
    submitAnswer() {
      if (this.data.answerInner.length === 0 || ([...new Set(this.data.answerInner)][0] == null && [...new Set(this.data.answerInner)].length === 1)) {
        wx.showToast({
          title: '答案不能为空',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      const { correctInner } = this.setAnswer(this.data.index)
      let numToLetter = []
      if (JSON.stringify(this.data.answerInner) !== JSON.stringify(correctInner)) {
        this.triggerEvent('setCourseWrongNums', {})
      } else {
        this.triggerEvent('setCourseRightNums', {})
      }
      numToLetter = correctInner.map((item) => {
        if (item) {
          return NumToLetter(item)
        }
      })
      this.setData({
        NumToLetter: [...new Set(numToLetter)].join(' '),
        correctInner: correctInner
      })
      this.setStorage(this.data.answerInner, correctInner)
    }
  }
})