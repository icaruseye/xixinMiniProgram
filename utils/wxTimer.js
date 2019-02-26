var wxTimer = function (initObj) {
  initObj = initObj || {}
  this.beginTime = initObj.beginTime || 0	//剩余秒数
  this.interval = initObj.interval || 0				//间隔时间
  this.complete = initObj.complete					//结束任务
  this.intervalFn = initObj.intervalFn				//间隔任务
  this.name = initObj.name							//当前计时器在计时器数组对象中的名字

  this.intervarID									//计时ID
  this.endTime										//结束时间
  this.endSystemTime									//结束的系统时间
}

wxTimer.prototype = {
  start: function (self) {
    var that = this
    this.endTime = Math.floor(this.beginTime / 1000) 
    this.endSystemTime = new Date(Date.now() + this.endTime)
    var count = 0
    function begin() {
      var tmpTime = new Date(that.endTime - count++)
      var days = Math.floor(tmpTime / 86400)
      var hours = Math.floor(tmpTime % 86400 / 3600)
      var mins = Math.floor(tmpTime % 86400 % 3600 / 60);
      var secs = Math.floor(tmpTime % 86400 % 3600 % 60);
      var wxTimerList = self.data.wxTimerList
      var res = {
        days: days,
        hours: hours,
        mins: mins,
        secs: secs
      }

      //更新计时器数组
      wxTimerList[that.name] = {
        wxTimer: res
      }

      self.setData({
        wxTimer: res,
        wxTimerList: wxTimerList
      })
      //时间间隔执行函数
      if (0 == (count - 1) % that.interval && that.intervalFn) {
        that.intervalFn()
      }
      //结束执行函数
      if (tmpTime <= 0) {
        if (that.complete) {
          that.complete()
        }
        that.stop()
      }
    }
    begin()
    this.intervarID = setInterval(begin, 1000)
  },
  //结束
  stop: function () {
    clearInterval(this.intervarID)
  },
  //校准
  calibration: function () {
    this.endTime = this.endSystemTime - Date.now()
  }
}

module.exports = wxTimer