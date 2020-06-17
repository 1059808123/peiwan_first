// pages/chat/chat.js
const app = getApp()

var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     newslist: [],
     userInfo: {},
     myUserId:null,
     scrollTop: 0,
     increase:false,//图片添加区域隐藏
     aniStyle: true,//动画效果
     message:null,
     index:null,
     toUserName:null,
     toUserId:null,
     toUserPhoto:null,
     previewImgList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = wx.getStorageSync('userId')
    if (app.globalData.userInfo) {
      var list = wx.getStorageSync('chat');
      var newlist = list[options.index].chatMessage;
      list[options.index].tag = 0;
      wx.setStorageSync('chat', list)
      var end = newlist.reverse();
      
      that.setData({
        index:options.index,
        myUserId:id,
        toUserId:app.globalData.message[options.index].userId,
        toUserName:app.globalData.message[options.index].NickName,
        toUserPhoto:app.globalData.message[options.index].Photo,
        newslist:end,
        userInfo: app.globalData.userInfo
      })
      wx.pageScrollTo({
        scrollTop:99999,
        complete: (res) => {},
      })
    }
    
    var webSocketTask = app.globalData.webSocketTask;
    var webSocketOpen = app.globalData.socketOpen;


    if(webSocketOpen){

      webSocketTask.onMessage(function(res){
        var message = JSON.parse(res.data)
        setTimeout(function(){
          var list = wx.getStorageSync('chat');
          list[that.data.index].tag  = 0;
          var newlist = list[options.index].chatMessage.reverse();
        if(message.type == "chat"){
          that.setData({
           newslist :newlist
          })
          wx.pageScrollTo({
            scrollTop:99999,
            complete: (res) => {},
          })
        }
        },2000)
        
      })
    }

  },

  send: function () {
    var webSocketTask = app.globalData.webSocketTask;
    var that = this;
    var flag = this

    if (this.data.message == null){
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    }else {
      setTimeout(function(){
        flag.setData({
          increase: false
        })
      },500)
      var id = wx.getStorageSync('userId');
      var time = utils.formatTime(new Date());
      var data = {
        fromUserId : id ,
        toUserId : that.data.toUserId,
        contentText : that.data.message,
        type : "chat",
        time : time
      }
      webSocketTask.send({
        data: JSON.stringify(data),
        success:res=>{

          app.globalData.message[that.data.index].chatMessage.unshift(data);
          
          wx.setStorageSync('chat', app.globalData.message);
          var list = wx.getStorageSync('chat');
          var newlist = list[that.data.index].chatMessage;
          var end = newlist.reverse();
          that.setData({
            message:null,
            newslist:end
          })
        },
        fail:err=>{
            wx.showToast({
              title: '无法连接网络',
              icon: "none",
              duration: 2000
            })
        }
      })     
      
      
          
      wx.pageScrollTo({
        scrollTop:99999,
        complete: (res) => {},
      })
        
    }
  },
  //监听input值的改变
  bindChange(res) {
    var that = this;
    that.setData({
      message : res.detail.value
    })
  },
  cleanInput(){
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
  },
  increase() {
    this.setData({
      increase: true,
      aniStyle: true
    })
  },
  //点击空白隐藏message下选框
  outbtn(){
    this.setData({
      increase: false,
      aniStyle: true
    })
  },
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        wx.uploadFile({
          url: '', 
          filePath: tempFilePaths[0],
          name: 'file',
          headers: {
            'Content-Type': 'form-data'
          },
          success: function (res) {
            if (res.data){
              that.setData({
                increase: false
              })
              websocket.send('{"images":"'+ res.data +'","date":"'+utils.formatTime(new Date())+'","type":"image","nickName":"'+that.data.userInfo.nickName+'","avatarUrl":"'+that.data.userInfo.avatarUrl+'"}')
              that.bottom()
            }
          }
        })   
       
      }
    })
  },

  gotoIndex:function(){
    var that = this;
    wx.navigateTo({
      url: '../coPlayerIndex/coPlayerIndex?id='+ that.data.toUserId,
    })
  },
  
  //图片预览
  previewImg(e){
    var that = this
    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
    var res = e.target.dataset.src
    var list = this.data.previewImgList //页面的图片集合数组
    
    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
    if (list.indexOf(res) == -1 ) {
        this.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res, // 当前显示图片的http链接
      urls: that.data.previewImgList // 需要预览的图片http链接列表
    })
    
  },
  
})