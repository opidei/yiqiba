//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp();
const userid = wx.getStorageSync('userid');
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    TabCur: 0,
    scrollLeft: 0,
    List: [
      { name: "精选" },
      { name: "热门活动" },
      { name: "最强攻略" }
    ],
    intnum:'',
    acts:[],
  },
  created(){
    wx.showToast({
      title: '加载中……',
      icon:'none',
    })
  },
  attached(){
    let that=this;
    var _ranStr = app.createRandStr();
    wx.request({
      url: 'https://www.comeonkids.cn/api/base/getReqtoken',
      method: 'POST',
      data: {
        randStr: _ranStr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log('123')
        wx.setStorageSync('token', res.data.data.token);
        wx.setStorageSync('randStr', _ranStr);
        that.getAll(res.data.data.token, _ranStr);
      },
      fail: function (res) {
        console.log(res.data);
      }
    })
  },
  methods: {
    getAll(_token,_randStr){
      let that = this;
      var acts;
      var act = [];
      if(!_token){
        _token = wx.getStorageSync('token');;
        _randStr = wx.getStorageSync('randStr');;
      }
      var logintoken = wx.getStorageSync('logintoken');
      console.log(logintoken);
      wx.request({
        url: 'https://www.comeonkids.cn/api/Activity/getActivitys',
        method: 'POST',
        data: {
          token: logintoken,
          reqToken: _token,
          ranStr: _randStr,
          type: 4,
          id: ''
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (res) {
          console.log(res);
          if (res.data.code === 1000) {
            acts = res.data.data.activity;
            for (var i = 0; i < acts.length; i++) {
              var obj = acts[i];
              var img = obj.imgs;
              if (img != null) {
                img = img.split(',')
                obj.img = img;
              } else {
                obj.img = img
              }
              var time = obj.create_time.substr(0, 4) + '年' + obj.create_time.substr(5, 2) + '月' + obj.create_time.substr(8, 2) + '日';
              obj.time = time;
              act.unshift(obj);
              app.globalData.acts = act;
              that.setData({
                acts: app.globalData.acts,
              });
              wx.hideToast();
            }
          } else if (res.data.code === 5003) {
            wx.navigateTo({
              url: '/pages/regist/regist',
            })
          } else if (res.data.code === 5002) {
            wx.hideToast();
            util.showToast('none', '请刷新页面');
          }
          console.log(acts);
        }
      });
    },
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    },
    navigate(e){
      var id = e.currentTarget.dataset.id
      var crtuser = e.currentTarget.dataset.crtuser
      var user= wx.getStorageSync('openid');
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
          id:user,
          activityId:id
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
    }
  },
})
