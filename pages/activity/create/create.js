//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    date:'',
    time:null,
    startdate: "",
    enddate: "",
    img:null,
    acname: "传递",
    activityType:null,
    type:['徒步行','自驾游','其他'],
    abstract: "",
    thumb: "",
    textareaAValue: "请输入活动简介",
    currentTab: 0,
    lists: [
      { day: 1, food: "", hotel: "", car: "" },
    ],
    registrationFee:0,
    imgList: []
  },
  onLoad:function(){
    console.log("创建活动程序启动");
    var date = util.formatTime(new Date());
    console.log("当前日期" + date);
    this.setData({
      date:date,
      startdate: date,
      enddate: date
    });
  },
  PickerChange:function(e){
    console.log(e.detail.value)
    this.setData({
      activityType: e.detail.value
    })
  },
  TimeChange:function(e){
    this.setData({
      time:e.detail.value
    })
  },
  SdateChange:function(e){
    var edate=this.data.enddate
    if(e.detail.value>edate){
      edate=e.detail.value
    }
    this.setData({
      startdate:e.detail.value,
      enddate:edate
    })
  },
  EdateChange:function(e){
    var sdate=this.data.startdate
    if(e.detail.value>sdate){
      this.setData({
        enddate: e.detail.value
      })
    }else{
      wx.showToast({
        title: '时间选择错误',
        icon: 'loading'
      })
    }
  },
  needPay:function(e){
    console.log(e.detail.value);
    this.setData({
      registrationFee:e.detail.value
    })
  },
  textareaInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  //选择图片
  ChooseImage(e) {
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        var uploadImgCount = 0;
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
        wx.request({
          url: '',
        })
      }
    })
  },
  //删除图片
  DelImg(e) {
    wx.showModal({
      title: '图片删除',
      content: '确定要删除这张照片？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //上传表单数据
  formSubmit: function (e) {
    console.log(e.detail);
    var imgs={};
    this.data.imgList.forEach(function(item,index){
      console.log(index);
      if(index==0){
        imgs['conver_img']=item;
      }else{
        var key='image'+index;
        imgs[key]=item;
      }
    });
    console.log(imgs);
    var logintoken = wx.getStorageSync('logintoken');
    var token = wx.getStorageSync('token');
    var randStr = wx.getStorageSync('randStr');
    imgs = JSON.stringify(imgs);
    var crtuser = wx.getStorageSync('openID');
    var activityname = e.detail.value.activityname,
      activityType = e.detail.value.activityType,
      activityintro = e.detail.value.activityintro,
      activityplace = e.detail.value.activityplace,
      starttime = e.detail.value.beginDate,
      endtime = e.detail.value.endDate,
      departureAddress = e.detail.value.departureAddress,
      departureTime = e.detail.value.departureTime,
      cost = e.detail.value.cost,
      remark = e.detail.value.remark,
      allowedit = e.detail.value.allowedit,
      needpay = e.detail.value.needpay,
      registrationFee=0;
    if(needpay){
      registrationFee = e.detail.value.registrationFee;
    }
    console.log(registrationFee);
    wx.request({
      url: 'https://www.comeonkids.cn/api/activity/crtactivity',
      method: 'POST',
      data: {
        token: logintoken,
        reqToken:token,
        ranStr:randStr,
        activityName: activityname,
        activityType:activityType,
        departureAddress: departureAddress,
        departureTime: departureTime,
        briefIntroduction: activityintro,
        targetAddress: activityplace,
        beginDate: starttime,
        endDate: endtime,
        averageBudget: cost,
        remark: remark,
        converImg: imgs,
        allowEdit: allowedit,
        needPay: needpay,
        registrationFee: registrationFee,
        activity_source:1,
        templateId:0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        if(res.data.code==1000){
          var exprs = wx.getStorageSync("Myact") || []
          //向数组中添加新的元素
          exprs.unshift(res.data.data.activityid)
          //将添加的元素存储到本地
          wx.setStorageSync("Myact", exprs)
          wx.showToast({
            title: '创建成功',
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 2000)
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none',
            duration: 2000
          })
        }       
      },
      fail:function(res){
        wx.showToast({
          title: '创建失败',
        })
        console.log(res.data)
      }
    })
  },
})
