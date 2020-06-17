// pages/coPlayerIndex/coPlayerIndex.js
const myaudio = wx.createInnerAudioContext(); 
const app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bl:false,
    id:"",
    tabs:["动态","评论"],
    indicator: true,
    indicatorColor: "#FF7F00",
    autoplay: true,
    interval: 10000,
    duration: 500,
    comments: [{ commentsId: "1",
                 name: "xx", commentPhoto:"https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3226533415,1667671188&fm=26&gp=0.jpg", 
                 comments:"", 
      starsComments: "5.0"
    }, {
      commentsId: "1",
        name: "xx", commentPhoto: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3226533415,1667671188&fm=26&gp=0.jpg",
        comments: "",
        starsComments: "5.0"
      }],
    zhanboImg: [],
    coPlayer: {
      name: "",
      userId: "",
      userAge: 0,
      gender: "",
      isPick:true,
      imgPhoto: "",
      skill: [],
      imgIntroduction: [],
      textIntroduction: "",
      audioIntroduction:{
        },
      comments: [],
      starComments: 0,
      tag: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = options.id
    var id;

    id = wx.getStorageSync("userId")
    

    wx.request({
      url: 'http://localhost:8080/isPick',
      data:{
        id: id,
        pickId:userid
      },
      success(res){
        var pl = that.data.coPlayer;
        pl.isPick = res.data;
        that.setData({
          id:id,
          coPlayer:pl
        })
      }
    })
    wx.request({
      url: 'http://localhost:8080/coPlayer',
      data: {
        id:options.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        var co = that.data.coPlayer;
        co.name = res.data.userName;
        co.userId = res.data.userId;
        co.userAge = res.data.userAge;
        co.gender = res.data.userGender;
        co.imgPhoto = res.data.userPhoto;
        co.skill = res.data.skills;
        co.audioIntroduction = res.data.audioIntroduction;
        co.textIntroduction = res.data.textIntroduction;
        that.setData({
          zhanboImg : res.data.imgIntroduction,
          coPlayer:co
        })

      }
    })
    wx.request({
      url: 'http://localhost:8080/getComments',
      data: {
        id:options.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
          that.setData({
            comments:res.data
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

  goChat:function(){
    var that = this;
    var id = that.data.coPlayer.userId;
    var name = that.data.coPlayer.name;
    var photo = that.data.coPlayer.imgPhoto;
    var list = app.globalData.message;
    var target = null;
    for(var index in list){
      if(list[index].userId == id){
        target =index;
      }
    }
    if(target == null){
      var data ={
        "userId": id, 
        "tag":0,
        "NickName":name,
        "Photo":photo,
        "chatMessage":[],
      }
      app.globalData.message.push(data);
      wx.setStorageSync('chat', app.globalData.message);
      var l = app.globalData.message;
      for(var n in l){
        if(app.globalData.message[n].userId == id){
          target = n;
        }
      }
    }
    wx.navigateTo({
      url: '../chat/chat?index=' + target,
    })

  },

  click:function(e){
    var index = e.currentTarget.dataset.index;
    var imgArr= this.data.zhanboImg;
    wx.previewImage({
      current:imgArr[index],
      urls: imgArr,
    })
  },
  
  orderStart:function(){
    var that = this;
    wx.navigateTo({
      url: '../steps/steps?active=0'+"&userId="+that.data.coPlayer.userId,
    })
  },

  audioPlay(e) {
    var that = this;

    that.setData({
      bl: true,
      
    })

    myaudio.autoplay = true;
    var  vidSrc = that.data.coPlayer.audioIntroduction;
    myaudio.src = vidSrc;

    myaudio.play();

    //开始监听
    myaudio.onPlay(() => {
      console.log('开始播放');
    })

    //结束监听
    myaudio.onEnded(() => {
      console.log('自动播放完毕');
      var that = this;
      that.setData({
        bl: false,
      })
    })

    //错误回调
    myaudio.onError((err) => {
      console.log(err);
      var that = this;
      that.setData({
        coPlayer: false,
      })
      return
    })

  },

  // 音频停止
  audioStop(e) {
    console.log("Jinlaile");

    var that = this;
    //设置状态

    that.setData({
      bl: false
    })

    myaudio.pause();

    //停止监听
    myaudio.onPause(() => {
      console.log('暂停播放');
    })

  },
  onClick:function(e){
    console.log(e.detail.name);
  },

  pick:function(e){
    var that = this;
    var id = wx.getStorageSync("userId");
    wx.request({
      url: 'http://localhost:8080/addPick',
      data:{
        id : id,
        pickId: that.data.coPlayer.userId
      },
      success(res){
        if(res.data == true){
          var co = that.data.coPlayer;
          co.isPick = true;
          that.setData({
            coPlayer:co
          })
        }else{
          Toast.fail('关注失败,请稍后重试');
        }
      },
      fail(res){
        Toast.fail("网络异常,请稍后重试")
      }
    })
  },
  canclePick(res){
    Dialog.confirm({
      title: '取消确认',
      message: '你真的要取消关注吗'
    }).then(() => {
      var that = this;
      var id = wx.getStorageSync("userId");
      wx.request({
        url: 'http://localhost:8080/cancelPick',
        data: {
          id: id,
          pickId: that.data.coPlayer.userId
        },
        success(res) {
          if (res.data == true) {
            var co = that.data.coPlayer;
            co.isPick = false;
            that.setData({
              coPlayer: co
            })
          } else {
            Toast.fail('取消关注失败,请稍后重试');
          }
        },
        fail(res) {
          Toast.fail("网络异常,请稍后重试")
        }
      })
    }).catch(() => {
      // on cancel
    });
    
  }
})