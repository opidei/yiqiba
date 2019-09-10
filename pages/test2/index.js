//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onLoad: function () {
    let that = this
    wx.login({
      success: function (res) {
        //用拿到的code，从后台获取sessionId
        wx.request({
          url: 'https://www.comeonkids.cn/api/server/login',
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (res) {
            // console.log(res.data.resultData);
            //调用getUserInfo获取加密数据encryptedData和iv
            console.log(res.data)
            wx.setStorageSync('sessionId', res.data.data.sessionkey);
            wx.setStorageSync('openID', res.data.data.openId);
            var exist = res.data.data.isExist;
            //调用getUserInfo获取加密数据encryptedData和iv
            if (exist == false) {
              console.log(123)
              that.adduser();
            }
          }
        })
      }
    })
  },
  adduser: function () {
    wx.getUserInfo({
      success: function (msg) {
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
          success: function (res) {
            if (res.statusCode == 200) {
              console.log(res.data);
            } else {
              console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
            }
          },
          fail:function(){
            console.log("未授权")
          }
        })
      }
    })   
  },
  beiyong:function(){
    
  },
  getcache: function () {
    var sessionid = wx.getStorageSync('sessionId')
    var openid=wx.getStorageSync('openID')
    console.log(sessionid);
    console.log(openid)
  }
})
