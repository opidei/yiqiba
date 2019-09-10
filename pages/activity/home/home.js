const app = getApp();
var util = require('../../../utils/util.js');

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    iconList: [{
      icon: 'recordfill',
      color: 'orange',
      badge: 0,
      name: '我的活动',
      url:'/pages/activity/list/list',
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '当前行程',
      url:'/pages/activity/schedule/schedule'
    },],
    tab: [
      '我管理的',
      '我参与的',
      '我收藏的'
    ],
    TabCur: 0,
    acts:[],
    users:[],
    myAct:[],
    inAct:[],
    favorAct:[]
  },
  attached(){
    this.getmy();
  },
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
      });
      if (e.currentTarget.dataset.id===0){
        this.getmy();
      } else if (e.currentTarget.dataset.id===1){
        this.getin();
      } else if (e.currentTarget.dataset.id===2){
        this.getfavor();
      }
    },
    getmy(){
      var userid = wx.getStorageSync('userid');
      let _this=this;
      var logintoken = wx.getStorageSync('logintoken');
      var token = wx.getStorageSync('token');
      var randStr = wx.getStorageSync('randStr');
      util.showToast('none','加载中……');
      console.log(userid);
      wx.request({
        url: 'https://www.comeonkids.cn/api/Activity/getActivitys',
        method: 'POST',
        data: {
          'token': logintoken,
          'reqToken': token,
          'ranStr': randStr,
          'type': 1,
          'id':userid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (res) {
          console.log(res);
          _this.setData({
            myAct: res.data.data.activitys,
            mypics:res.data.data.pics
          })
          util.showToast('success','加载完成')
        },
        fail: function (e) {

        }
      });
    },
    getin(){
      var logintoken = wx.getStorageSync('logintoken');
      var token = wx.getStorageSync('token');
      var randStr = wx.getStorageSync('randStr');
      let _this = this;
      var userid = wx.getStorageSync('userid');
      util.showToast('none', '加载中……');
      console.log(userid);
      wx.request({
        url: 'https://www.comeonkids.cn/api/Activity/getActivitys',
        method: 'POST',
        data: {
          'token': logintoken,
          'reqToken': token,
          'ranStr': randStr,
          'type': 2,
          'id': userid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (res) {
          console.log(res);
          _this.setData({
            inAct: res.data.data.activitys,
          })
          util.showToast('success', '加载完成')
        },
        fail: function (e) {

        }
      });
    },
    getfavor(){
      var logintoken = wx.getStorageSync('logintoken');
      var token = wx.getStorageSync('token');
      var randStr = wx.getStorageSync('randStr');
      let _this = this;
      util.showToast('none', '加载中……');
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
          _this.setData({
            favorAct: res.data.data.favorit,
          })
          util.showToast('success', '加载完成')
        },
        fail: function (e) {

        }
      });
    },
    create(){
      wx.navigateTo({
        url: '/pages/activity/create/create',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    navigate(e) {
      var id = e.currentTarget.dataset.id
      var crtuser = e.currentTarget.dataset.crtuser
      var user = wx.getStorageSync('openid');
      var logintoken = wx.getStorageSync('logintoken');
      var token = wx.getStorageSync('token');
      var randStr = wx.getStorageSync('logintoken');
      console.log(user);
      wx.request({
        url: 'https://www.comeonkids.cn/api/ActivityBrowse/addActivityBrowse',
        method: 'POST',
        data: {
          token: logintoken,
          reqToken: token,
          ranStr: randStr,
          id: user,
          activityId: id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (res) {
          console.log(res);
        }
      })
      wx.navigateTo({
        url: '/pages/activity/detail/detail?id=' + id + '&crtuser=' + crtuser,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
  },
})