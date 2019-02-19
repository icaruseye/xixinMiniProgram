import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'
import { formatTime } from '../../utils/util.js'

Component({
  properties: {
    ID: Number,
    title: String,
    count: Number,
    createTime: {
      type: String,
      value: ''
    },
    msgType: {
      type: Number,
      value: 1
    }
  },
  data: {},
  lifetimes: {
    attached: function () {
      console.log(this.data)
      console.log('attached')
    },
    detached: function () {
      console.log('detached')
    }
  },
  methods: {
    redirectToDetail(e) {
      console.log(e)
      wx.navigateTo({
        url: `/pages/messageDetail/messageDetail?id=${e.currentTarget.dataset.id}`,
      })
    }
  }
})