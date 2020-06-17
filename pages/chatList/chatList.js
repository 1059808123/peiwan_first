// pages/chatList/chatList.js
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    friends:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var webSocketTask = app.globalData.webSocketTask;
    var webSocketOpen = app.globalData.socketOpen;

    var file = wx.getStorageSync('chat');

    that.setData({
      friends:file
    })
    if(webSocketOpen){

      webSocketTask.onMessage(function(res){
        var message = JSON.parse(res.data)

        setTimeout(function(){
          var list = app.globalData.message;
        if(message.type == "chat"){
          that.setData({
            friends:list
          })
        }
        },2000)
        
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var file = wx.getStorageSync('chat');
    var that = this;
    console.log("onshow")
    that.setData({
      friends:file
    })
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

  gotoChat:function(e){
    wx.navigateTo({
      url: '../chat/chat?index=' + e.currentTarget.dataset.index,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
})