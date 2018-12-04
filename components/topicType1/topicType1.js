
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
    index: Number
  },
  data: {
    answerList: wx.getStorageSync('userAnswerList'),
    answerInner: 0,
    correctInner: 1
  },
  lifetimes: {
    attached() {
      this.setData({
        'data.Content': this.data.data.Content.split('><')
      })
      console.log(this.data.data)
    }
  },
  methods: {
    handleChange({ detail = {} }) {
      this.setData({
        answerInner: detail.value
      })
    },
    selectItem (e) {
      this.setData({
        answerInner: e.currentTarget.dataset.key
      })
    } 
  }
})