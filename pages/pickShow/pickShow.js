// pages/pickShow/pickShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore:true,
    netError:false,
    isLoading:false,
    pageIndex:0,
    page:4,
    coPlayer:null,
    pageIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = wx.getStorageSync('userId')
    wx.request({
      url: 'http://localhost:8080/pickShow',
      data: {
        page: 4,
        start: 0,
        id:id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.length < that.data.page){
          that.setData({
            hasMore:false,
            isLoading:false
          })
        }
        
        that.setData({
          coPlayer: res.data,
          pageIndex:that.data.pageIndex+1,
        })
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  click:function(event){
      wx.navigateTo({
        url: '../coPlayerIndex/coPlayerIndex?id=' + event.currentTarget.dataset.userid,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
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
  onReachBottom:function(){

    var that = this;
    that.setData({
      isLoading:true
    })
    setTimeout(function(){
    wx.request({
      url: 'http://localhost:8080/index',
      data: {
        page: that.data.page,
        start: that.data.pageIndex * that.data.page
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        var list = that.data.coPlayer;
        for(var index in res.data){
          
          list.push(res.data[index])
        }

        
        if(res.data.length < that.data.page ){
          that.setData({
            isLoading:false,
            hasMore:false
          })
        }
      

        list.concat(res.data);

        that.setData({
            pageIndex:that.data.pageIndex+1,
            isLoading:false,
            coPlayer:list
        })
      },
      fail(){
        that.setData({
          isLoading:false,
          netError:true
        })
      }
    })},2000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})