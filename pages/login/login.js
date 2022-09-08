import {login,sendCaptcha} from '../../service/home'
const app = getApp()
Page({
  data: {
    phone: '',
    pwd: '',
    captcha: '',
    change: false,
    count: 0,
  },
  handleInput(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  getConfimNum() {
    if(!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    this.setData({
      count: 60
    })
    let self = this
    let timer = setInterval(() => {
      if(self.data.count == 0) {
        clearInterval(timer)
      }
      self.setData({
        count: --self.data.count
      })
    }, 1000)
    sendCaptcha({phone:this.data.phone}).then(res => {
      wx.showToast({
        title: '已发送验证码',
        icon: 'none'
      })
    })
  },
  login() {
    let {phone, pwd, captcha, change} = this.data
    if(!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    } else {
      let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!phoneReg.test(phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      } else if(!pwd && change) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return
      } else if(!captcha && !change) {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      } else {
        let param = {
          phone
        }
        if(pwd) {
          param.password = pwd
        }
        if(captcha) {
          param.captcha = captcha
        }
        login({phone, password: pwd, captcha, islogin: true}).then(res => {
          if(res.code === 502) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          } else if(res.code === 400) {
            wx.showToast({
              title: '手机号不存在',
              icon: 'none'
            })
          } else {
            wx.setStorage({
              data: JSON.stringify(res.profile),
              key: 'userInfo',
            })
            wx.switchTab({
              url: '/pages/profile/profile',
            })
          }
        })
      }
    }
  },
  register() {
    wx.showToast({
      title: '想屁吃，给爷爬',
      icon: 'error'
    })
  },
  changeLoginType() {
    this.setData({
      change: !this.data.change,
      captcha: '',
      pwd: ''
    })
  },
  onShow: function() {
    if(!app.globalData.state) {
      wx.hideHomeButton()
    }
  }
})