
var url = 'ws://localhost:8080/websocket/';


function connect(userId) {
  var webSocket = wx.connectSocket({
    url: url + userId,
    header: { 'content-type': 'application/json' },
    success: function () {
      console.log('信道连接成功~')
      
    },
    fail: function () {
      console.log('信道连接失败~')
    }
  })

  return webSocket  
}



module.exports = {
  connect: connect
}