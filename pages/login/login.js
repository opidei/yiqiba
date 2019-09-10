const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.navigateTo({
        url: '/pages/home/home',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.login({
      success: function(res) {
        //用拿到的code，从后台获取sessionId
        /* wx.request({
          url: 'https://www.comeonkids.cn/api/base/getOpenid',
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function(res) {
            // console.log(res.data.resultData);
            //调用getUserInfo获取加密数据encryptedData和iv
            console.log(res.data)
            wx.setStorageSync('sessionId', res.data.data.sessionkey);
            wx.setStorageSync('openID', res.data.data.openId);
            wx.setStorageSync('avatar', res.data.data.headimgurl);
            var exist = res.data.data.isExist;
            //调用getUserInfo获取加密数据encryptedData和iv
            if (exist == false) {
              console.log(123)
              that.adduser();
            }
          },
          fail: function(res) {
            console.log(res.data);
            wx.showModal({
              title: '错误！',
              content: '连接失败',
              showCancel: true,
              cancelText: '',
              cancelColor: '',
              confirmText: '',
              confirmColor: '',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        }) */
      }
    })
  },
  adduser: function() {
    wx.getUserInfo({
      success: function(msg) {
        console.log(msg)
        var encryptedData = msg.encryptedData,
          iv = msg.iv;
        wx.request({
          url: 'https://www.comeonkids.cn/api/users/adduser',
          method: 'POST',
          data: {
            encryptedData: encryptedData,
            iv: iv
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.statusCode == 200) {
              console.log(res.data);
            } else {
              console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
            }
          },
          fail: function() {
            console.log("未授权")
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})