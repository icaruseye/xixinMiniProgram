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
    answerInner: -1,
    correctInner: -1,
    NumToLetter: ''
  },
  lifetimes: {
    attached() {
      watch(this, {
        answerInner: function (newVal) {
          if (!this.data.paperType) {
            this.setStorage(newVal)
          }
        }
      })
    }
  },
  methods: {
    init (index) {
      const answerList = wx.getStorageSync('userAnswerList')
      this.setData({
        answerInner: answerList[index].Answer !== -1 ? answerList[index].Answer : -1,
        correctInner: answerList[index].Answer !== -1 ? this.data.data.IntRightKey : -1,
        NumToLetter: ''
      })
    },
    handleChange({ detail = {} }) {
      this.setData({
        answerInner: detail.value
      })
    },
    selectItem (e) {
      this.setData({
        answerInner: e.currentTarget.dataset.key
      })
    },
    setStorage(newVal) {
      const answerList = wx.getStorageSync('userAnswerList')
      answerList[this.data.index].Answer = newVal
      wx.setStorageSync('userAnswerList', answerList)
    },
    submitAnswer () {
      if (this.data.answerInner === -1) {
        wx.showToast({
          title: '答案不能为空',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      if (this.data.answerInner !== this.data.data.IntRightKey) {
        this.triggerEvent('setCourseWrongNums', {})
      } else {
        this.triggerEvent('setCourseRightNums', {})
      }
      this.setData({
        NumToLetter: NumToLetter(this.data.data.IntRightKey),
        correctInner: this.data.data.IntRightKey
      })
      this.setStorage(this.data.answerInner)
    }
  }
})