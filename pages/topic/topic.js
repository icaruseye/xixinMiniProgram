import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js'
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testPaperID: '',
    recordID: '',
    isOver: false, // 完成所有题目
    isShowCard: false, // 显示答题卡
    answerIndex: 0, // 当前显示题目索引,
    IsNeedAnswer: false,
    TestPaperName: '',
    questionList: [],
    rightNums: 0,
    wrongNums: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      testPaperID: options.id,
      recordID: options.recordID
    })
    this.getTestPaperQuestionList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 获取习题列表
   */
  async getTestPaperQuestionList () {
    const res = await api._get(`/User/TestPaperQuestionList?testPaperID=${this.data.testPaperID}`)
    const TestPaperQuestionDetailsList = res.Data.TestPaperQuestionDetailsList.map((item) => {
      if ([1, 3, 4].includes(item.QuestionType)) {
        item.Content = item.Content.split('><')
        item.answerlength = item.Content.length
        return item
      } else {
        return item
      }
    })
    this.setData({
      questionList: TestPaperQuestionDetailsList,
      IsNeedAnswer: res.Data.IsNeedAnswer,
      TestPaperName: res.Data.TestPaperName,
    })
    this.setAnswerList()
  },

  /**
   * 提交试卷请求
   */
  async postPaper () {
    const userAnswerList = wx.getStorageSync('userAnswerList')
    let _userAnswerList = this.setUserAnswerList(userAnswerList)
    const res = await api._post(`/User/SubmitTestPaper?recordID=${this.data.recordID}`, _userAnswerList)
    wx.showModal({
      title: '提示',
      content: '提交成功',
      confirmText: '返回试卷列表',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  
  /**
   * 提交试卷
   */
  submitPaper () {
    if (this.data.IsNeedAnswer) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.postPaper()
    }
  },

  /**
   * 提交试卷准备
   */
  checkPaper () {
    if (this.isFinishedAllQuestions()) {
      this.setData({
        isOver: true
      })
    } else {
      wx.showToast({
        title: '还有未完成题目',
        icon: 'none'
      })
    }
  },

  /**
   * 设置数据准备提交
   */
  setUserAnswerList(userAnswerList) {
    return userAnswerList.map((item) => {
      if (item.type === 4) {
        let _answer = [...new Set(item.Answer)]
        if (_answer[0] == null) {
          _answer.shift()
        }
        item.Answer = _answer.join()
      }
      if (item.type === 2) {
        item.Answer = item.Answer.join()
      }
      return item
    })
  },

  /**
   * 检查试卷是否完成
   */
  isFinishedAllQuestions () {
    let answerList = wx.getStorageSync('userAnswerList')
    let flag = true
    for (let item of answerList) {
      if (item.Answer === '' && [2, 4, 5].includes(item.type)) {
        flag = false
        return false
      }
      if (item.Answer === -1 && ![2, 4, 5].includes(item.type)) {
        flag = false
        return false
      }
    }
    return flag
  },

  /**
   * 设置答题卡数组
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
        type: questionList[index].QuestionType,
        answerlength: questionList[index].answerlength
      }))
    }
    wx.setStorageSync('userAnswerList', arr)
    wx.setStorageSync('testPaperID', this.data.testPaperID)
  },

  /**
   * 更新对题数目
   */
  addRightNums (e) {
    this.setData({
      rightNums: this.data.rightNums + 1
    })
  },

  /**
   * 更新错题数目
   */
  addWrongNums (e) {
    this.setData({
      wrongNums: this.data.wrongNums + 1
    })
  },

  /**
   * 上一题
   */
  prevQuestion(e) {
    if (this.data.answerIndex === 0) {
      wx.showToast({
        title: '没有上一题了',
        icon: 'none'
      })
      return false
    }
    this.setData({
      answerIndex: this.data.answerIndex - 1
    })
  },

  /**
   * 下一题
   */
  nextQuestion(e) {
    if (this.data.questionList.length === this.data.answerIndex + 1) {
      wx.showToast({
        title: '已经是最后一题了',
        icon: 'none'
      })
      return false
    }
    this.setData({
      answerIndex: this.data.answerIndex + 1
    })
  },

  /**
   * 题目跳转
   */
  cardClick ({ detail }) {
    if (this.data.answerIndex !== detail) {
      this.setData({
        answerIndex: detail,
        isShowCard: false
      })
    } else {
      this.setData({
        isShowCard: false
      })
    }
  },

  /**
   * 显示答题卡
   */
  showCard () {
    this.setData({
      isShowCard: true,
      answerList: wx.getStorageSync('userAnswerList')
    })
  },

  /**
   * 收起答题卡
   */
  closeCard () {
    this.setData({
      isShowCard: false
    })
  },

  /**
   * 收起答题完成卡
   */
  closeFinish () {
    this.setData({
      isOver: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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