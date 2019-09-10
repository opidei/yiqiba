const app=getApp();
const logintoken = wx.getStorageSync('logintoken');
const token = wx.getStorageSync('token');
const randStr = wx.getStorageSync('randStr');
Page({
  data: {
    PageCur: 'index'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onLoad(){
    let that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }else{
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
              wx.setStorageSync('userid', res.data.data.id);
            },
            fail() {
              wx.showToast('none', '网络问题，请重试');
            }
          })
        }
      }
    })
  }
})