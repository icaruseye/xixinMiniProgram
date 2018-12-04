import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testPaperID: '',
    isOver: false, // 完成所有题目
    showCard: false, // 显示答题卡
    answerIndex: 0, // 当前显示题目索引,
    IsNeedAnswer: false,
    questionList: [],
    wrongNums: 0,
    rightNums: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      testPaperID: options.id || 6
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTestPaperQuestionList()
  },

  /**
   * 获取习题列表
   */
  async getTestPaperQuestionList () {
    const res = await api._get(`/User/TestPaperQuestionList?testPaperID=${this.data.testPaperID}`)
    this.setData({
      questionList: res.Data.TestPaperQuestionDetailsList,
      IsNeedAnswer: res.Data.IsNeedAnswer
    })
    this.setAnswerList()
  },

  /**
   * 设置答题卡
   */
  setAnswerList() {
    const questionList = this.data.questionList
    let arr = []
    for (let index = 0; index < questionList.length; index++) {
      arr.push(Object.assign({
        Answer: [2, 4, 5].indexOf(questionList[index].QuestionType) === -1 ? -1 : '',
        correct: [2, 4, 5].indexOf(questionList[index].QuestionType) === -1 ? questionList[index].IntRightKey : questionList[index].StrRightKey,
        UserTestPaperAnswerParam: questionList[index].TestPaperSubtitleQuestionID,
        index: index,
        type: questionList[index].QuestionType
      }))
    }
    wx.setStorageSync('userAnswerList', arr)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})