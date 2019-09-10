const app = getApp();
const logintoken = wx.getStorageSync('logintoken');
const token = wx.getStorageSync('token');
const randStr = wx.getStorageSync('randStr');
var util = require('../../../utils/util.js');
Page({
  data: {
  },
  onLoad(options){
    console.log(options);
    var activityid=options.activityid;
    let _this=this;

    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFamilyMember/getFamilyMember',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activityId': activityid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
      },
      fail() {
        util.showToast('none', '网络问题，请重试');
      }
    });
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityAttender/getActivityFamily',
      method: 'POST',
      data: {
        'token': logintoken,
        'reqToken': token,
        'ranStr': randStr,
        'activityId':activityid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
      },
      fail() {
        util.showToast('none', '网络问题，请重试');
      }
    })
  },
  view() {
    wx.request({
      url: 'https://www.comeonkids.cn/api/User/getUserInfo',
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
        console.log(res);
      },
      fail() {
        util.showToast('none', '网络问题，请重试');
      }
    })
  }
})
