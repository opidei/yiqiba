var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate:"",
    enddate:"",
    acname:"传递",
    abstract:"",
    thumb:"",
    currentTab: 0,
    lists: [
      {day:1,food:"",hotel:"",car:""},
    ],
    images: []
  },
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  addItemFn: function () { 
    var { lists } = this.data; 
    var newData = { text: "新的元素" }; 
    lists.push(newData); 
    this.setData({ lists: lists }) 
  },
  datechange1:function(e){
    this.setData({
      startdate:e.detail.value
    })
  },
  datechange2:function(e){
    this.setData({
      enddate:e.detail.value
    })
  },
  chooseImage(e) {
    var that=this;
    wx.chooseImage({
      count:9,
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function(res){
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
            url: "https://www.comeonkids.cn/api/activity/picupload",
            filePath: tempFilePaths[i],
            name: 'img',
            formData: {
              'img': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              console.log(data.data.fullpath);
              var url=data.data.fullpath;
              //服务器返回格式: { "fullpath: https://test.com/1.jpg" }  
              var images = that.data.images;
              images.push(url);
              that.setData({
                images: images
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
      }
    })
  },

 

  namechange:function(e){
    var name = e.detail.detail.value;
    console.log(name)
    this.setData({
      acname: name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("创建活动程序启动");
    var date=util.formatTime(new Date());
    console.log("当前日期"+date);
    this.setData({
      startdate:date,
      enddate:date
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})