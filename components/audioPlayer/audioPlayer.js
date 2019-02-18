
const bgMusic = wx.createInnerAudioContext()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          playUrl: newVal
        })
        this.listenerButtonPlay()
      }
    },
    poster: String,
    name: String
  },
  data: {
    isOpen: false,
    starttime: '00:00',
    duration: '00:00',
    offset: 0,
    changePlay: false,
    max: 0
  },
  ready: function () {
    this.listenerButtonPlay()
  },
  lifetimes: {
    detached() {
      // 在组件实例被从页面节点树移除时执行
      bgMusic.stop()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 播放
    listenerButtonPlay: function () {
      var that = this
      bgMusic.title = this.data.name
      bgMusic.epname = this.data.name
      bgMusic.src = that.data.src
      bgMusic.onTimeUpdate(() => {
        // bgMusic.duration 总时长
        // bgMusic.currentTime 当前进度
        var duration = bgMusic.duration
        var offset = Math.floor(bgMusic.currentTime)
        var currentTime = offset
        var min = "0" + parseInt(currentTime / 60)
        var max = parseInt(bgMusic.duration)
        var sec = currentTime % 60
        if (sec < 10) {
          sec = "0" + sec;
        };
        var starttime = min + ':' + sec;   /*  00:00  */
        that.setData({
          offset: currentTime,
          starttime: starttime,
          max: max,
          changePlay: true,
          duration: this.second2minute(duration)
        })
      })
      //播放结束
      bgMusic.onEnded(() => {
        that.setData({
          isOpen: false,
          offset: this.data.max
        })
      })
      bgMusic.play()
      that.setData({
        isOpen: true,
      })
    },
    //暂停播放
    listenerButtonPause() {
      var that = this
      bgMusic.pause()
      that.setData({
        isOpen: false,
      })
    },
    listenerButtonStop() {
      var that = this
      bgMusic.stop()
    },
    // 进度条拖拽
    sliderChange(e) {
      var that = this
      var offset = parseInt(e.detail.value)
      bgMusic.play()
      bgMusic.seek(offset)
      that.setData({
        isOpen: true
      })
    },
    // 页面卸载时停止播放
    onUnload() {
      var that = this
      that.listenerButtonStop()
    },
    second2minute (sec) {
      let _mins = Math.floor(sec / 60)
      let _sec = Math.floor(sec % 60)
      _mins = _mins < 10 ? `0${_mins}` : _mins
      _sec = _sec < 10 ? `0${_sec}` : _sec
      return `${_mins}:${_sec}`
    }
  }
})

