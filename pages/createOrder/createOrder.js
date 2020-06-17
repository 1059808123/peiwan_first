// pages/createOrder/createOrder.js
var gameData = require('../../utils/gameType.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allPrice:0,
    checked: false,
    disabled:true,
    gameIndex: 0,
    typeIndex: 0,
    price: null,
    time: null,
    warn: null,
    gameName: "",
    typeObjectArray: [],
    customIndex: [0, 0],
    onlyArray: [
      [],
      []
    ],
    customArray: [

    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    for (var index in gameData.game) {
      if (gameData.game[index].gameName == options.name) {
        var data = {
          gameName: options.name,
          customArray: gameData.game[index].customArray,
          customIndex: this.data.customIndex,
          onlyArray: this.data.onlyArray,
          typeObjectArray: gameData.game[index].typeObjectArray
        };
      }
    }

    for (var i = 0; i < data.customArray.length; i++) {
      data.onlyArray[0].push(data.customArray[i].name);
    }
    for (var j = 0; j < data.customArray[data.customIndex[0]].dept.length; j++) {
      data.onlyArray[1].push(data.customArray[data.customIndex[0]].dept[j].name);
    }
    this.setData(data);
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

  bindPickerChange: function (e) {

    this.setData({
      gameIndex: e.detail.value
    })
  },
  bindPickerChange1: function (e) {

    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindCustomPickerChange: function (e) {
    var customArray = this.data.customArray,
      customIndex = this.data.customIndex,
      onlyArray = this.data.onlyArray;





    this.setData({
      customIndex: e.detail.value
    })
  },
  bindCustomPickerColumnChange: function (e) {
    var customArray = this.data.customArray,
      customIndex = this.data.customIndex,
      onlyArray = this.data.onlyArray;

    customIndex[e.detail.column] = e.detail.value;


    var searchColumn = () => {
      for (var i = 0; i < customArray.length; i++) {
        var arr1 = [];
        if (i == customIndex[0]) {
          for (var j = 0; j < customArray[i].dept.length; j++) {
            arr1.push(customArray[i].dept[j].name);
          }
          onlyArray[1] = arr1;
        }
      };
    }

    switch (e.detail.column) {
      case 0:
        customIndex[1] = 0;
        searchColumn();
        break;
      case 1:
        searchColumn();
        break;
    }
    this.setData({
      onlyArray: onlyArray,
      customIndex: customIndex
    });
  },
  onChange({ detail }) {
    var that=this;

    if(detail==true){
      if(that.data.warn<=0){
        that.setData({
          disabled:true
        })
      }
    }
    if(detail==false){
      if (that.data.price > 0 && that.data.time > 0){
        that.setData({
          disabled:false
        })
      }
    }
    this.setData({
      checked: detail
    })
  },
  onPrice(event) {

    
    var that = this;
    that.setData({
      price:event.detail
    })
    if (that.data.price > 0 && that.data.time > 0) {
      that.setData({
        allPrice: that.data.price * that.data.time*100
      })

      if (that.data.checked == true) {
        if (that.data.warn > 0) {
          that.setData({
            disabled: false
          })
        }
      } else {
        that.setData({
          disabled: false
        })
      }
    }
  },
  onTime(event) {
    var that = this;
    that.setData({
      time: event.detail
    })
    if (that.data.price > 0 && that.data.time > 0) {
      that.setData({
        allPrice: that.data.price * that.data.time*100
      })
      if (that.data.checked == true) {
        if (that.data.warn > 0) {
          that.setData({
            disabled: false
          })
        }
      } else {
        that.setData({
          disabled: false
        })
      }
    }
  },
  onWarn(event) {
    var that = this;
    that.setData({
      warn: event.detail
    })
    if (that.data.price > 0 && that.data.time > 0) {
      that.setData({
        allPrice:that.data.price*that.data.time*100
      })
      if (that.data.checked == true) {

        if (that.data.warn > 0) {

          that.setData({
            disabled: false
          })
        }
      } else {
        that.setData({
          disabled: false
        })
      }
    }
  },
  onConfirm(event) {
    // var that = this;
    // var webSocketTask = app.globalData.webSocketTask;
    // var webSocketOpen =app.globalData.socketOpen;
    // if(webSocketOpen){
    //   webSocketTask.send({
    //     data:{
    //       request:"createOrder",
    //       orderAllPrice:that.data.allPrice,
    //       orderTime:that.data.time,
    //       orderPrice:that.data.price,
    //       orderIsWarn:that.data.checked,
    //       orderWarn:that.data.warn,
    //       orderGameName:that.data.gameName,
    //       orderGameType:that.data.typeObjectArray[that.data.typeIndex],
    //       orderGameBigRange:that.data.onlyArray[0][that.data.customIndex[0]],
    //       orderGameSmallRange: that.data.onlyArray[1][that.data.customIndex[1]],
    //     },
    //     success(res){
    //       wx.navigateTo({
    //         url: '../orderResponse/orderResponse',
    //       })
    //     }
    //   })
    // }
  },
  onSubmit(event){
    var that = this;
    var webSocketTask = app.globalData.webSocketTask;
    var webSocketOpen = app.globalData.socketOpen;
    var data= {
      type: "createOrder",
      toUserId:"",
        orderAllPrice: that.data.allPrice,
          orderTime: that.data.time,
            orderPrice: that.data.price,
              orderIsWarn: that.data.checked,
                orderWarn: that.data.warn,
                  orderGameName: that.data.gameName,
                    orderGameType: that.data.typeObjectArray[that.data.typeIndex],
                      orderGameBigRange: that.data.onlyArray[0][that.data.customIndex[0]],
                        orderGameSmallRange: that.data.onlyArray[1][that.data.customIndex[1]],
        }
    if(webSocketOpen) {
      webSocketTask.send({
          data:JSON.stringify(data),
        success(res) {
          wx.navigateTo({
            url: '../orderResponse/orderResponse',
          })
        }
      })
    }else{
      console.log("信道连接失败")
    }
  }
})