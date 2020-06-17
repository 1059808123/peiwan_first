// pages/orderResponse/orderResponse.js
const app = getApp()
var webSocketTask = null
var socketOpen = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    responseList:[],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    webSocketTask = app.globalData.webSocketTask;

    var that = this;


    webSocketTask.onMessage(function (res) {

       var message = JSON.parse(res.data);
      
      if (message.type == "getOrderResponse") {


        var list = that.data.responseList;
        list.push(message);

        that.setData({
          responseList: list
        })
        
      }
    })
    
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

  },
  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },

  click:function(event){ 
    console.log(event.currentTarget.dataset.userid);
    wx.navigateTo({
      url: '../coPlayerIndex/coPlayerIndex?id=' + event.currentTarget.dataset.userid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})