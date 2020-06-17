// pages/orderShow/orderShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = wx.getStorageSync('userId');
      wx.request({
        url: 'http://localhost:8080/orderShow',
        data:{
          id:id
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
            that.setData({
              orders:res.data.reverse()
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
    var that = this;
    var id = wx.getStorageSync('userId');
      wx.request({
        url: 'http://localhost:8080/orderShow',
        data:{
          id:id
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
            that.setData({
              orders:res.data.reverse()
            })
        }
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

  click:function(event){
    console.log(event)
    console.log(event.currentTarget.dataset.orderId)
    wx.navigateTo({
      url: '../steps/steps?orderId='+event.currentTarget.dataset.orderid+"&active="+event.currentTarget.dataset.active,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})