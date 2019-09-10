const util = require('../../utils/util.js');
const app=getApp();


Page({
  data: {
    time: "获取验证码",
    currentTime: 61,
    disabled: false,
    suffix: '',
    mobileNumber: '',
    data_code: '',
    submit:false,
    userCode:''
  },
  
  // 获取输入框的值
  getInputKey(e) {
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value;
    this.setData({
      [key]: value
    })
  },

  // 获取验证码
  getVerificationCode() {
    let _this = this;
    if (!_this.data.disabled) {
      _this.getCode();
    }
  },
  //获取验证码
  getCode(){
    let _this = this;
    let phone = _this.data.mobileNumber;
    console.log(phone);
    var randStr = wx.getStorageSync('randStr');
    if (util.isPhoneAvailable(phone)) {
      wx.request({
        url: 'https://www.comeonkids.cn/api/base/sendSmsCode',
        method: 'POST',
        data: {
          mobileNumber: phone,
          reqToken:_this.data.token,
          ranStr: randStr
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (res) {
          console.log(res);
          util.showToast('success', "已发送");
          _this.setData({
            disabled: true
          });

          // 设置发送验证码按钮样式
          let interval = null;
          let currentTime = _this.data.currentTime;

          interval = setInterval(function () {
            currentTime--;
            _this.setData({
              time: currentTime,
              suffix: '秒后可重新获取'
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              _this.setData({
                time: '重新发送',
                suffix: '',
                currentTime: 61,
                disabled: false,
                submit:false
              })
            }
          }, 1000)
        },
        fail: function (res) {
          util.showToast('none', "发送失败")
        }
      })
    }else{
      util.showToast('none', '请输入正确的手机号码。');
    }
  },
  //手机号登录
  load(){
    let _this = this;
    if(_this.data.data_code!='' && _this.data.phone!=''){
      var data_code=_this.data.data_code;
      var phone = _this.data.mobileNumber;
      // console.log(data_code);
      // console.log(phone);
      // console.log(token);
      // console.log(randStr);
      console.log(_this.data.userCode);
      var randStr = wx.getStorageSync('randStr');
      wx.request({
        url: 'https://www.comeonkids.cn/api/base/mobileLogin',
        method: 'POST',
        data: {
          mobileNumber: phone,
          verCode:data_code,
          minaCode:_this.data.userCode,
          reqToken: _this.data.token,
          ranStr: randStr
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success:function(res){
          var code = res.data.code
          console.log(res);
          console.log(code);
          wx.setStorageSync('openid', res.data.data.openid);
          if(code===1000){
            wx.setStorageSync('logintoken', res.data.data.logintoken);
            util.showToast('success', '登录成功');
            wx.navigateTo({
              url: '/pages/home/home',
            })
          }else if (code===2001){
            console.log('123')
            _this.addUser(res.data.data.openid);
          } else if (code===5003){
            util.showToast('none', '验证码失效，请重新获取');
          } else if(code===5004){
            util.showToast('none', '验证码错误，请重新输入');
          }else{
            util.showToast('none','登录失败，请稍后重试');
          }
        }
      })
    }
  },
  //新增用户
  addUser(openid){
    let _this=this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log(openid);
          wx.checkSession({
            success() {
              //session_key 未过期，并且在本生命周期一直有效
              wx.getUserInfo({
                success: function (msg) {
                  console.log(msg)
                  var encryptedData = msg.encryptedData,
                    iv = msg.iv;
                  var randStr = wx.getStorageSync('randStr');
                  wx.request({
                    url: 'https://www.comeonkids.cn/api/user/addUser',
                    method: 'POST',
                    data: {
                      encryptedData: encryptedData,
                      iv: iv,
                      openid: openid,
                      reqToken: _this.data.token,
                      ranStr: randStr,
                      mobileNumber: _this.data.mobileNumber
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res);
                      if (res.data.code == 1000) {
                        wx.setStorageSync('logintoken', res.data.data.logintoken);
                        util.showToast('success', '登录成功');
                        wx.navigateTo({
                          url: '/pages/home/home',
                        })
                      }
                    },
                    fail: function () {
                      console.log("未授权")
                    }
                  })
                }
              })  
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              wx.login({
                success: res => {
                  wx.getUserInfo({
                    success: function (msg) {
                      console.log(msg)
                      var encryptedData = msg.encryptedData,
                        iv = msg.iv;
                      var randStr = wx.getStorageSync('randStr');
                      wx.request({
                        url: 'https://www.comeonkids.cn/api/user/addUser',
                        method: 'POST',
                        data: {
                          encryptedData: encryptedData,
                          iv: iv,
                          openid: openid,
                          reqToken: token,
                          ranStr: randStr,
                          mobileNumber: _this.data.mobileNumber
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                          console.log(res);
                          if (res.data.code == 1000) {
                            wx.setStorageSync('logintoken', res.data.data.logintoken);
                            util.showToast('success', '登录成功');
                            wx.navigateTo({
                              url: '/pages/home/home',
                            })
                          }
                        },
                        fail: function () {
                          console.log("未授权")
                        }
                      })
                    }
                  })  
                }
              }); //重新登录
            }
          })
        }
        else{
          _this.showModal();
        }
      }
    }) 
  },
  showModal() {
    this.setData({
      modalName: 'bottomModal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  getInfo:function(e){
    console.log(e);
    let _this=this;
    if(e.detail.userInfo){
      console.log(e.detail.userInfo)
      _this.addUser(wx.getStorageSync('openid'));
      _this.hideModal();
    }else{
      _this.hideModal();
      wx.showModal({
        title: '警告',
        content: '您拒绝授权，将无法登录！',
      })
    }
  },
  onLoad(){
    let _this=this;
    var token = wx.getStorageSync('token');
    console.log(token);
    wx.login({
      success: res => {
        console.log(res.code);
        _this.setData({
          userCode: res.code,
          token:token,
        })
      }
    });
  }
})