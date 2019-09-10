Page({
  data:{
    acts:[]
  },
  onLoad(){
    var that=this;
    var actID = wx.getStorageSync('Myact');
    var user = wx.getStorageSync('openID');
    console.log(user);
    var acts=[];
    wx.request({
      url: 'https://www.comeonkids.cn/api/activity/getactivitybyuser',
      method: 'POST',
      data:{
        crtuser:user
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        acts=res.data.data;
        console.log(acts);
        var myact=that.data.acts;
        for(var i=0;i<acts.length;i++){
          var obj=acts[i];
          var img = acts[i].imgs;
          if(img!==null){
            img = img.split(',');
            obj.img = img[0];
          }else{
            obj.img=img;
          }
          obj.starttime = acts[i].starttime.substr(5,5);
          myact.unshift(obj);
        }
        that.setData({
          acts:myact
        });
        console.log(that.data.acts);
      },
      fail: function () {
        console.log("未授权")
      }
    })
  }
})