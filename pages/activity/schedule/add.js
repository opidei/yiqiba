var util = require('../../../utils/util.js');
const logintoken = wx.getStorageSync('logintoken');
const token = wx.getStorageSync('token');
const randStr = wx.getStorageSync('randStr');
Page({
  data:{
    type:'',
    edit:null,
    textareaValue:'',
    s_date:'',
    a_date:'',
    s_time:"06:00",
    e_time:'07:00',
    day:0,
    startdate: "",
    activityid:"",
    index:0,
    picker:["汽车","火车","飞机","轮船","其他"]
  },
  onLoad:function(option){
    var date = util.formatTime(new Date());
    console.log(option.edit)
    console.log(option.type)
    if(option.edit!=null){
      this.setData({
        type:option.type,
        edit:option.edit,
        startdate: date,
        s_date: date,
        a_date:date,
      })
    }
  },
  textareaInput(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  S_DateChange(e) {
    this.setData({
      s_date: e.detail.value
    })
  },
  A_DateChange(e) {
    this.setData({
      a_date: e.detail.value
    })
  },
  S_TimeChange(e) {
    this.setData({
      s_time: e.detail.value
    })
  },
  E_TimeChange(e) {
    this.setData({
      e_time: e.detail.value
    })
  },
  DayChange(e) {
    this.setData({
      day: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})