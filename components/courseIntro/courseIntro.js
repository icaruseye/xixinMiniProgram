// components/courseIntro/courseIntro.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Desctiption: String,
    Img: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgList: []
  },
  lifetimes: {
    ready() {
      this.setData({
        imgList: this.data.Img.split(',')
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
