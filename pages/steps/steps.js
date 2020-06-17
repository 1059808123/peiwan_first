// pages/steps/steps.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    steps: [
      {
        text: '步骤一',
        desc: '确定订单'
      },
      {
        text: '步骤二',
        desc: '开始陪玩'
      },
      {
        text: '步骤三',
        desc: '正在陪玩'
      },
      {
        text: '步骤四',
        desc: '服务完毕'
      }
    ],
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    orderId:null,
    disabled:true,
    active:0,
    columns:[],
    comment:null,
    index:0,
    price:null,
    time:null,
    allPrice:null,
    surplusTime:null,
    rate:null,
    star:5,
    timeData:[],
    userId:null,
    coPlayerImg:null,
    coPlayerName:null,
    gameType:null,
    orderId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      active:options.active,
      userId:options.userId,
      orderId:options.orderId
    })
    
    if(options.active == 0){
      wx.request({
        url: 'http://localhost:8080/skill',
        data:{
          id:options.userId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res)
          var list = res.data;
          console.log(list);
          that.setData({
            columns:list
          })
        }
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/findOrder',
        data:{
          orderId:that.data.orderId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res);
          that.setData({
            allPrice:res.data.allPrice,
            coPlayerImg:res.data.coPlayerImg,
            coPlayerName:res.data.coPlayerName,
            price:res.data.price,
            orderId:res.data.orderId,
            gameType:res.data.gameType,
            time:res.data.time,
            surplusTime:res.data.time * 1000 * 60 * 60
          })
        }
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
  onChange(event) {
    var that = this;
    console.log(event);
    var res = event.detail;
    that.setData({

      index:res.value
    })
    
  },

  orderEnd:function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/addActive',
      data:{
        orderId:that.data.orderId,
        active:4
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      
    })
    var id = wx.getStorageSync('userId')
    var data={
      coPlayerId:that.data.userId,
      comment:that.data.comment,
      star:that.data.star,
      userId:id
    };
    
    wx.request({
      url: 'http://localhost:8080/addComment',
      data:{
        coPlayerId:that.data.userId,
        comment:that.data.comment,
        star:that.data.star,
        userId:id,
        gameName:that.data.columns[that.data.index]
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      }
    })
    wx.switchTab({
      url: '../index/index',
    })
  },

  commentChange:function(event){
    console.log(event);
    var that = this;
    that.setData({
      comment:event.detail
    })

  },

  changeTime:function(event){
    var that = this;
    that.setData({
      time:event.detail,
      surplusTime:event.detail * 1000 * 60 * 60,
      
    })
    if(that.data.price >0 && that.data.time >0){
      that.setData({
        allPrice:that.data.price * that.data.time,
        
        disabled:false
      })
    }
  },

  restTime:function(e){
    var that = this;
    var rat = (e.detail.minutes * 60 + e.detail.seconds + e.detail.hours*60*60)*100000/that.data.surplusTime;
    that.setData({
      rate:rat,
      timeData: e.detail
    })
     
  },

  starChange:function(event){
    var that = this;
    that.setData({
      star:event.detail
    })
  },

  changePrice:function(event){
    var that = this;
    that.setData({
      price:event.detail
    })
    if(that.data.price >0 && that.data.time >0){
      that.setData({
        allPrice:that.data.price * that.data.time,
        disabled:false
      })
    }
  },

  onClick:function(){
    var that = this;
    var id = wx.getStorageSync('userId');
    if(that.data.active == 0){
      console.log("执行了")
      wx.request({
        url: 'http://localhost:8080/createOrder',
        data:{
          coPlayer:that.data.userId,
          customer:id,
          price:that.data.price,
          time:that.data.time,
          allPrice:that.data.allPrice,
          gameType:that.data.columns[that.data.index]
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
            that.setData({
              orderId:res.data
            })
        }
      })
    }else{
      var newactive = parseInt(that.data.active)+1;
      console.log(newactive);
      wx.request({
        url: 'http://localhost:8080/addActive',
        data:{
          orderId:that.data.orderId,
          active:newactive
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        
      })
      
    }
    that.setData({
      active:parseInt(that.data.active)+1
    })
  }
})