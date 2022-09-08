import {getOpenId,login, loginEmail,userDetail} from "./service/home"
App({
  onLaunch: function () {
    let isLogin = !!(wx.getStorageSync('cookies')) && !!(wx.getStorageSync('userInfo'))
    this.globalData.isLogin = isLogin
    if(isLogin) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  addSong(id) {
    if(this.globalData.id && this.globalData.id == id) {
      this.globalData.isSame = true
    } else {
      this.globalData.isSame = false
      this.globalData.backgroundAudioManager = {}
      this.globalData.id = id
    }
  },
  playList(arr) {
    this.globalData.playList = arr
  },
  getSong(type) {
    if(this.globalData.playList.length > 1) {
      if(type == 'next') {
        this.globalData.index >= this.globalData.playList.length -1? this.globalData.index = 0: this.globalData.index ++
      } else {
        this.globalData.index <= 0?this.globalData.index = this.globalData.playList.length -1: this.globalData.index --
      }
    } else {
      this.globalData.index = 0
    }
    let id = this.globalData.playList[this.globalData.index].id
    this.globalData.id = id
    return id
  },
  globalData: {
    //是否登陆
    isLogin: false,
    // 播放列表
    playList: [],
    index: 0,
    state: false,
    isSame: false,
    id: '',
    pid: '',
    active: '',
    backgroundAudioManager:{},
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // wx.login({
    //   success: (res) => {
    //     console.log(res);
    //     let code = res.code
    //     getOpenId(code).then(res => {

    //     })
    //   }
    // })
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
