const app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    cardCur: 0,
    swiperList: [],
    title:'',
    tag:'',
    intro:'',
    schedule:'',
    activityId:'',
    textareaValue:'',
    user:'',
    isJoin:false,
    nick_name:'',
    comment:[]
  },
  onLoad(option) {
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    let _this=this;
    var id=option.id;
    console.log(this.data.isJoin);
    var creator = option.crtuser;
    var user=wx.getStorageSync('openid');
    this.setData({
      'activityId':id
    });
    console.log(option);
    //获取用户昵称，判断是否创建者
    wx.request({
      url: 'https://www.comeonkids.cn/api/User/getLoginUserInfo',
      method: 'POST',
      data: {
        'accessToken': logintoken,
        'reqToken': token,
        'ranStr': randStr,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          user:res.data.data.id,
          nick_name:res.data.data.nick_name
        });
        console.log(res.data.data.id);
        if(res.data.data.id==creator){
          _this.setData({
            isCrt:true
          })
        } else {
          _this.setData({
            isCrt: false
          })
        }
      },
      fail(){
        util.showToast('none', '网络问题，请重试');
      }
    })
    //获取活动详情信息
    wx.request({
      url: 'https://www.comeonkids.cn/api/Activity/getActivity',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'id':id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success:function(res){
        var activity=res.data.data.activity;
        var pics=res.data.data.pics;
        console.log(activity);
        console.log(pics);
        var imgList=[];
        pics[0].forEach(function (value, index){
          imgList.push({"url":value.file_url});
        })
        console.log(imgList);
        _this.setData({
          title:activity['activity_name'],
          intro:activity['brief_introduction'],
          swiperList:imgList
        })
      },
      fail:function(e){

      }
    });
    //判断是否点赞
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFavor/chkFavor',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activity_id': _this.data.activityId,
        'userId':user
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          like:res.data.data.isFavor
        })
      }
    });
    //判断是否收藏
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFavorite/getFavorite',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        var activity=res.data.data.favorit;
        activity.forEach(function (value, index) {
          if(id==value.id){
            _this.setData({
              'favor':true
            })
          }
        })
      }
    });
    //判断是否参加
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityAttender/getActivityUser',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activity_id': id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var users=[];
        res.data.data.forEach(function(value,index){
          users.push(value.id);
        })
        if(users.indexOf(_this.data.user)>=0){
          _this.setData({
            isJoin:true
          })
        }
      }
    })
    //获取活动评论
    this.getComment(id);
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');
  },
  //获取活动评论
  getComment(id){
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    let _this=this;
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityComment/getComment',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activityId': id,
        'scheduleId': 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        var comment = [];
        res.data.data.forEach(function (value, index) {
          var all = value.comment_content.split('：');
          var nick_name = all[0];
          var content = all[1];
          var time = value.create_time;
          comment.push({
            'nick_name': nick_name,
            'content': content,
            'time': time
          })
        });
        console.log(comment);
        _this.setData({
          comment: comment
        })
      }
    });
  },
  //点赞
  Like() {
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    let _this = this;
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFavor/chkFavor',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activity_id': _this.data.activityId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res.data.data.isFavor);
        if (res.data.data.isFavor == false) {
          wx.request({
            url: 'https://www.comeonkids.cn/api/ActivityFavor/addFavor',
            method: 'POST',
            data: {
              'token': logintoken,
              'reqToken': token,
              'ranStr': randStr,
              'activityId': _this.data.activityId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              console.log(res);
              _this.setData({
                like: true
              })
            },
          })
        } else if (res.data.data.isFavor == true) {
          wx.request({
            url: 'https://www.comeonkids.cn/api/ActivityFavor/delFavor',
            method: 'POST',
            data: {
              'token': logintoken,
              'reqToken': token,
              'ranStr': randStr,
              'activity_id': _this.data.activityId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              console.log(res);
              _this.setData({
                favor: false
              })
            },
          })
        }
      }
    })
  },
  //收藏
  Favor() {
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    let _this = this;
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFavorite/addFavorite',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activityId': _this.data.activityId,
        'favorite_remark': ''
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code === 1000 && res.data.data.length!=0) {
          util.showToast('success', "收藏成功");
          _this.setData({
            favor: true
          })
        } else if (res.data.code === 1000 && res.data.data.length === 0){
          util.showToast('success', "取消收藏成功");
          _this.setData({
            favor: false
          })
        }
      }
    })
  },
  //评论界面弹出
  showComment(e){
    this.setData({
      'modalName':'comment'
    });
    console.log(e);
    var name=e.currentTarget.dataset.name;
    if(name){
      this.setData({
        re_name:name
      })
    }
  },
  hideModal(){
    this.setData({
      'modalName': ''
    });
    if(this.data.textareaValue){
      this.setData({
        textareaValue:''
      })
    }
  },
  //评论框输入
  textareaInput(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  //提交评论
  comment(e){
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    console.log();
    var reply=[];
    if (this.data.re_name){
      reply = this.data.re_name.split('回复');
      var content = this.data.nick_name+'回复'+reply[0] + "：" + this.data.textareaValue;
    }else{
      var content = this.data.nick_name + "：" + this.data.textareaValue;
    }
    let _this=this;
    
    if(!this.data.commentID){
      var commentID=0;
    }else{
      var commentID=this.data.commentID;
    }
    console.log(content);
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityComment/addComment',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'parent_id': 0,
        'activity_id': _this.data.activityId,
        'schedule_id': 0,
        'comment_content': content
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success:function(res){
        _this.getComment(_this.data.activityId);
        _this.hideModal();
        _this.setData({
          textareaValue: ''
        })
        util.showToast('success','评论成功');
        console.log(res);
      }
    })
  },
  //参加活动界面弹出
  edit(){
    this.setData({
      'modalName': 'join'
    });
    let _this=this;
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityAttender/getActivityFamily',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activityId': _this.data.activityId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        if(res.data.data.length===0){
          _this.setData({
            haveFamily:false
          })
        }
      }
    })
  },
  //创建家庭
  create(){
    let _this=this
    wx.navigateTo({
      url: './create?activityid=' + _this.data.activityId+'&nickname='+_this.data.nick_name,
    })
  },
  //查看家庭
  viewFamily(){
    let _this = this
    wx.navigateTo({
      url: './family?activityid=' + _this.data.activityId + '&nickname=' + _this.data.nick_name,
    })
  },

  //头部轮播图
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }, towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  onShareAppMessage:function(option){
    if(option.from=="menu"){
      return{
        title:"一起吧",
        path:"/pages/activity/detail",
        imageUrl:"https://ossweb-img.qq.com/images/lol/web201310/skin/big10004.jpg"
      }
    }
  }
})