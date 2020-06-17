//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasMore:true,
    netError:false,
    isLoading:false,
    pageIndex:0,
    page:2,
    coPlayer:[], 
    type:[{
      name:"英雄联盟",
      img:"https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2070426211,1331596930&fm=26&gp=0.jpg"
    },{
      name: "王者荣耀",
        img: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2305787666,943118815&fm=26&gp=0.jpg"
    },{
      name: "和平精英",
        img: "https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2249410810,515486504&fm=26&gp=0.jpg"
    },{
      name: "绝地求生",
        img: "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1138039379,2471778894&fm=26&gp=0.jpg"
    }, {
      name: "使命召唤",
        img: "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3226664486,3716073390&fm=26&gp=0.jpg"
    },{
      name: "云顶之弈",
        img: "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1059505224,3133873445&fm=26&gp=0.jpg"
    },]
  },

  onLoad: function (options) {

    var that = this;
    wx.checkSession({
      success: function () {
        app.globalData.isLogin = true;
        
      },
      fail: function () {
        console.log("checksession fail")
        
        
      }
    })
    wx.request({
      url: 'http://localhost:8080/index',
      data: {
        page: 2,
        start: 0
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          coPlayer: res.data,
          pageIndex:that.data.pageIndex+1
        })
        
      }
    })
  },

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

  into:function(event){

    if(app.globalData.isLogin != false){
      wx.navigateTo({
        url: '../createOrder/createOrder?name=' + event.currentTarget.dataset.name,
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  click:function(event){
    if (app.globalData.isLogin != false){

      wx.navigateTo({
        url: '../coPlayerIndex/coPlayerIndex?id=' + event.currentTarget.dataset.userid,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  }
})
