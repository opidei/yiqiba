const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 验证手机号码是否有效
function isPhoneAvailable(phone) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

//小程序弹框提示
function showToast(icon, msg, duration = 2000){
  wx.showToast({
    title: msg,
    duration: duration,
    icon: icon
  })
}
module.exports = {
  formatTime: formatTime,
  isPhoneAvailable: isPhoneAvailable,
  showToast: showToast
}
