//app.js
var websocket = require('/utils/websocket.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    let that=this
    that.globalData.message = wx.getStorageSync('chat') || [] 

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var id = wx.getStorageSync("userId")

    if(id != null){
        that.globalData.webSocketTask = websocket.connect(id);
    }

    that.globalData.webSocketTask.onOpen(function (res) {
      that.globalData.socketOpen = true;
      console.log("信道成功打开");
    })

    that.globalData.webSocketTask.onClose(function (res) {
      console.log("信道关闭");
      that.globalData.socketOpen = false;

    })

    that.globalData.webSocketTask.onError(function (res) {
      console.log("连接出错");
      that.globalData.socketOpen = false;
    })

    that.globalData.webSocketTask.onMessage(function(res){
      console.log("shoudao")
      var message = JSON.parse(res.data)
      if(message.type=="getOrder"){
          var orderList = that.globalData.getOrder;
          orderList.unshift(message);
          that.globalData.getOrder = orderList;
          console.log(that.globalData.getOrder)
      }
      // [
      // {
      //   userId:,
      //   chatMessage:[
      //     {}
      //   ]
      // }
      // ]
     if(message.type=="chat"){
      
       var flag = true;
       for(var item in that.globalData.message){
         if(that.globalData.message[item].userId == message.fromUserId){
           flag = false;
           that.globalData.message[item].chatMessage.unshift(message);
           that.globalData.message[item].tag = that.globalData.message[item].tag + 1
           wx.setStorageSync('chat', that.globalData.message)
          }
       }
       if(flag == true){
         wx.request({
           url: 'http://localhost:8080/chat',
           data:{
             id:message.fromUserId
           },
           method: 'GET',
           header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){

            var img = res.data.userPhoto;
            var name = res.data.userName;
            var newChat = {
              "userId": message.fromUserId, 
              "tag":1,
              "NickName":name,
              "Photo":img,
              "chatMessage":[message],
              
             };
             that.globalData.message.push(newChat);
             wx.setStorageSync('chat', that.globalData.message)
          }
         })
         
       }
       wx.setStorageSync('chat', that.globalData.message)

     }
    })
    // 登录
    // wx.getUserInfo({
    //   success: function (res) {
        
    //     console.log(res);
    //     that.globalData.userInfo = res.userInfo;

    //   }

    //})
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // websocketInit(){
  //   var webSocket = wx.connectSocket({
  //     url: url + userId,
  //     header: { 'content-type': 'application/json' },
  //     success: function () {
  //       console.log('信道连接成功~')

  //     },
  //     fail: function () {
  //       console.log('信道连接失败~')
  //     }
  //   })
  // },

  globalData: {
    isLogin:false,
    userInfo: null,
    socketOpen:false,
    webSocketTask:{},
    getOrder:[],
    message:[]
    
  }
})