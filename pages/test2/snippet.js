var QQMapWX = require('../../utils/qqmap.js');
var qqmapsdk;
Page({
  
  onLoad:function(){
    qqmapsdk = new QQMapWX({
      key: 'IWTBZ-DN4KP-XI7DN-V2B2E-AOKQF-R2BSU'
    });
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
        }
        else {
          //调用wx.getLocation的API
        }
      }
    })
    let _this=this;
  },
  //多图批量上传
  upload:function(){
    for (var i = 0, h = tempFilePaths.length; i < h; i++) {
      wx.uploadFile({
        url: "https://www.comeonkids.cn/api/base/picUpload",
        filePath: tempFilePaths[i],
        name: 'img',
        formData: {
          'img': i,
          'token': logintoken,
          'reqToken': token,
          'ranStr': randStr
        },
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          console.log(res)
          uploadImgCount++;
          var data = JSON.parse(res.data);
          var url = data.data.fullpath;
          //服务器返回格式: { "fullpath: https://test.com/1.jpg" }  
          var images = that.data.imgList;
          images.push(url);
          that.setData({
            imgList: images
          });
          //如果是最后一张,则隐藏等待中  
          if (uploadImgCount == tempFilePaths.length) {
            wx.hideToast();
          }
        },
        fail: function (res) {
          wx.hideToast();
          console.log(res)
          wx.showModal({
            title: '错误提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      });
    }
  },
  openmap:function(){
    var that = this;
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.longitude
        var accuracy = res.accuracy
        that.setData({ latitude: latitude })
        that.setData({ longitude: longitude })
      }
    })
  }
})