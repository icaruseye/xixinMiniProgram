import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'
import { formatTime } from '../../utils/util.js'

Component({
  properties: {
    msgType: {
      type: Number,
      value: 1
    }
  },
  data: {
    UnreadCount: 0,
    Title: '',
    CreateTime: ''
  },
  lifetimes: {
    attached: function () {
      this.getSiteNoticeCount()
      console.log('attached')
    },
    detached: function () {
      console.log('detached')
    }
  },
  methods: {
    redirectToList () {
      wx.navigateTo({
        url: `/pages/messageList/messageList?msgType=${this.data.msgType}`,
      })
    },
    async getSiteNoticeCount () {
      const res = await api._get(`/SPUser/SiteNotice/Count?type=${this.data.msgType}`)
      if (res.Data) {
        this.setData({
          UnreadCount: res.Data.UnreadCount,
          Title: res.Data.Title || '',
          CreateTime: formatTime(res.Data.CreateTime)
        })
      }
    }
  }
})