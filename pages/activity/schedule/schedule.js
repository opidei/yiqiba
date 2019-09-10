Page({
  data:{
    modalname:null,
    icon: [{
        "isShow": true,
        "name": "home",
        "color": "green",
        "text": "飞机",
        "type": 0
      },
      {
        "isShow": true,
        "name": "home",
        "color": "yellow",
        "text": "火车",
        "type": 1
      },
      {
        "isShow":true,
        "name":"taxi",
        "color":"cyan",
        "text":"自驾",
        "type":2
      },{
        "isShow":true,
        "name":"homefill",
        "color":'red',
        "text":"住宿",
        "type": 3
      },{
        "isShow":true,
        "name":"shopfill",
        "color":"orange",
        "text":"餐饮",
        "type": 4
      },{
        "isShow":true,
        "name":"picfill",
        "color":"pink",
        "text":"景点",
        "type": 5
      },
    ]
  },
  showModal:function(e){
    this.setData({
      modalname:e.currentTarget.dataset.target
    })
  },
  hideModal:function(){
    this.setData({
      modalname:null,
    })
  },
  navigator:function(e){
    var edit=e.currentTarget.dataset.action
    var type=e.currentTarget.dataset.type
    wx.navigateTo({
      url: './add?edit='+edit+'&type='+type,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})