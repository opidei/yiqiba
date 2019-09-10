const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    avatar:''
  },
  ready(){
    var that=this
    wx.getUserInfo({
      success(res) {
        const avatarUrl = res.userInfo.avatarUrl
        that.setData({
          avatar: avatarUrl,
        })
      }
    })
  },
  methods: {

  },
})