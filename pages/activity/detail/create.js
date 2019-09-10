const app = getApp();
const logintoken = wx.getStorageSync('logintoken');
const token = wx.getStorageSync('token');
const randStr = wx.getStorageSync('randStr');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityID:options.activityid,
      nick_name:options.nickname
    })
  },

  formSubmit: function (e) {
    var activity_id=this.data.activityID;
    let pages=getCurrentPages();
    let prepage=pages[pages.length-2];
    let _this=this;
    console.log(e.detail.value);
    wx.request({
      url: 'https://www.comeonkids.cn/api/ActivityFamily/crtFamily',
      method: 'POST',
      data: {
        token: logintoken,
        reqToken: token,
        ranStr: randStr,
        family_name: e.detail.value.family_name,
        contact_number: e.detail.value.contact_number,
        member_count: e.detail.value.member_count,
        activity_id: activity_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        if (res.data.code === 1000) {
          console.log(123);
          wx.request({
            url: 'https://www.comeonkids.cn/api/ActivityAttender/addUser',
            method: 'POST',
            data: {
              token: logintoken,
              reqToken: token,
              ranStr: randStr,
              family_id: res.data.data.id,
              family_member_id:1,
              nick_name:_this.data.nick_name,
              contactNumber: e.detail.value.contact_number,
              activity_id: activity_id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (ans) {
              console.log(ans);
              if(ans.data.code===1000){
                prepage.setData({
                  isJoin: true,
                  modalName: ''
                });
                util.showToast('success', '创建成功！');
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            }
          })          
        }else if(res.data.code===4001){
          util.showToast('none',res.data.message);
        }
      }
    })
  }

})