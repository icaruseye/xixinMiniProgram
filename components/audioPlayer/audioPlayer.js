Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },
    name: String
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready: function () {
    let audioItem = wx.createInnerAudioContext()
    audioItem.autoplay = true;
    audioItem.loop = false;
    audioItem.src = this.data.playUrl

    audioItem.onTimeUpdate(function () {
      let totalIndex = audioItem.duration;
      let duration = second2minute(totalIndex);
      that.setData({
        totalIndex,
        duration,
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
