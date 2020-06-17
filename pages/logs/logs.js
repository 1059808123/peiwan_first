//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    
    orders:[
    //   {
    //   id:1,
    //   name:"这是一个订单名字，XXX-XXX",
    //   price:30,
    //   start:"黄金",
    //   gameTime:3,
    //   zone:["电信","艾欧尼亚"],
    //   description:"这是一处介绍",
    //   status:"exist",
    //   isTalk:"需要语音交流",
    //   warrantedPrice:50,
    //   imgUrl: "../../../../pages/Images/dy.png"
    // },
    // {
    //   id:2,
    //   name:"这是一个订单名字，XXX-XXX",
    //   price:"342",
    //   start: "白银",
    //   gameTime: 3,
    //   status: "exist",
    //   zone: ["电信", "艾欧尼亚"],
    //   description: "这是一处介绍",
    //   boss:"YYY",
    //   isTalk: "需要语音交流",
    //   warrantedPrice: 50,
    //   imgUrl: "../../../../pages/Images/dy.png"
    // },
    // {
    //   id:3,
    //   name:"这是一个订单名字，XXX-XXX",
    //   price:"342",
    //   start: "铂金",
    //   gameTime: 3,
    //   status: "exist",
    //   zone: ["电信", "艾欧尼亚"],
    //   description: "这是一处介绍",
    //   boss:"ZZZ",
    //   isTalk: "需要语音交流",
    //   warrantedPrice: 50,
    //   imgUrl: "../../../../pages/Images/dy.png"
    // },
    // {
    //   id:4,
    //   name:"这是一个订单名字，XXX-XXX",
    //   price:30,
    //   start:"钻石",
    //   gameTime: 3,
    //   status: "exist",
    //   zone:["电信","艾欧尼亚"],
    //   description:"这是一处介绍",
    //   boss:"XXX",
    //   isTalk:"需要语音交流",
    //   warrantedPrice:50,
    //   imgUrl: "../../../../pages/Images/dy.png"
    // },
    // {
    //   id:5,
    //   name:"这是一个订单名字，XXX-XXX",
    //   price:30,
    //   start:"青铜",
    //   gameTime: 3,
    //   status: "end",
    //   zone:["电信","艾欧尼亚"],
    //   description:"这是一处介绍",
    //   boss:"XXX",
    //   isTalk:"需要语音交流",
    //   warrantedPrice:50,
    //   imgUrl: "../../../../pages/Images/dy.png"
    // }
    ],
    
    zhanboImg: ["/pages/Images/tag_top.png", "/pages/Images/tag_top.png"],
    img:"/Pages/Images/shili.jpg"
  },

  onLoad:function (options) {
      var that = this;
      
    var list = app.globalData.getOrder
      that.setData({
        orders:list
      })

      var webSocketTask = app.globalData.webSocketTask;
      var webSocketOpen = app.globalData.socketOpen;

      if(webSocketOpen){

        webSocketTask.onMessage(function(res){
          var message = JSON.parse(res.data)
 
          setTimeout(function(){
            var list = app.globalData.getOrder;
          if(message.type == "getOrder"){
            that.setData({
              orders:list
            })
          }
          },2000)
          
        })
      }
  },
  onShow:function(options){

  },

  get:function(event){
    var that = this;
    var webSocketTask = app.globalData.webSocketTask;
    var webSocketOpen = app.globalData.socketOpen;
    var index = event.currentTarget.dataset.index

    if(webSocketOpen){
      console.log(that.data.orders[index])
      console.log(index)
      var toUserId = that.data.orders[index].fromUserId;
      var list = that.data.orders;
      var price = that.data.orders[index].orderPrice;
      var time = that.data.orders[index].orderTime;
        var data={
          price : price,
          time : time,
          toUserId:toUserId,
          type:"getOrderResponse",
        }
        webSocketTask.send({
          data:JSON.stringify(data),
          
          success(res){
            list[index].status = "getting"
              that.setData({
                orders:list
              })
          },
          fail(res){
            console.log("发送回复失败");
          }
        })
    }else{
      console.log("信道连接失败")
    }
  } 
  
})
