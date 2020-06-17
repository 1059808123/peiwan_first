var webSocketTask = require("/websocket.js")

const app = getApp()
function userLogin() {
  wx.checkSession({
    success: function () {
      console.log("checksession 成功")
      app.globalData.isLogin=true;
      var list = wx.getStorageSync('userId') || [];
      if(list == null){
        console.log("null")
        onLogin();
      }
      wx.switchTab({
        url: '../index/index',
      })
    },
    fail: function () {
      console.log("checksession fail")
      //不存在登陆态
      onLogin();
      
    }
  })
}

function onLogin() {
  console.log("onlogin执行了")
  wx.login({
    success: function (res) {
      console.log("wx.login执行成功了")
      if (res.code) {
        console.log(res)
        //发起网络请求
        wx.request({
          url: 'http://localhost:8080/login',
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/json"
          },
          method:"POST",
          success: function (res) {

            console.log("login请求得到"+res.data.userId)
            const self = this
            if (res.data != null) { 
              
              wx.setStorage({
                key: "userId",
                data: res.data.userId
              })
              
              app.globalData.webSocketTask = webSocketTask.connect(res.data.userId);
              app.globalData.webSocketTask.onOpen(function (res) {
                app.globalData.socketOpen = true;
                console.log("信道成功打开");
              })
              app.globalData.isLogin = true;
              setTimeout( getUserInfo,2000)
              
            }
            else {

            }
          },
          fail: function (res) {
              
          }
        })
      }
    },
    fail: function (res) {
      console.log("请求code失败" + res)
      console.log(res)
    }
  })

}

function getUserInfo() {
  wx.getUserInfo({
    success: function (res) {
      console.log(res)
      var userInfo = res.userInfo
      app.globalData.userInfo=res.userInfo
      console.log(app.globalData.userInfo)
      userInfoSetInSQL(userInfo)
    },
    fail: function (res) {
      console.log("失败了")
      console.log(res)
      userAccess()
    }
  })
}

function userInfoSetInSQL(userInfo) {
  wx.getStorage({
    key: 'userId',
    success: function (res) {
      wx.request({
        url: 'http://localhost:8080/loginAdd',
        data: {
          userId: res.data,
          userName: userInfo.nickName,
          userPhoto: userInfo.avatarUrl,
          userGender: userInfo.gender,
          
        },
        header: {
          "Content-Type": "application/json"
        },
        method:"POST",
        success: function (res) {
          console.log("zuihou")
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
    }
  })
}

module.exports={
  userLogin: userLogin,
  onLogin : onLogin
}