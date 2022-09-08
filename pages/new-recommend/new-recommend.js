import {getSongs} from "../../service/songs"

const app = getApp()

const month = ((new Date().getMonth())+1)<10? '0'+ (new Date().getMonth() + 1): (new Date().getMonth())+''
const day = new Date().getDate()<10? '0'+new Date().getDate() :new Date().getDate() +''
Page({
  data: {
    h: '',
    date: {month, day},
    imgUrl: '',
    dailySongs: [],
    isShow: false,
    index: 0,
    showAudio: false,
  },
  options: {
    addGlobalClass: true
  },
  onLoad: function (options) {
    let h = wx.getSystemInfoSync().statusBarHeight
    this.setData({
      h
    })
    this._getSongs()
  },
  backTo() {
    wx.navigateBack()
  },
  _getSongs() {
    getSongs().then(res => {
      const dailySongs = res.data.dailySongs
      const reasons = res.data.recommendReasons
      let data = dailySongs.find(ele => {
        return ele.id == reasons[0].songId
      })
      this.setData({
        imgUrl: data.al.picUrl,
        dailySongs
      })
    })
  },
  // 歌曲详情弹框
  openMenu(e) {
    this.setData({
      isShow: true
    })
  },
  closeMenu() {
    this.setData({
      isShow: false,
    })
  },
  // 播放器歌曲列表弹框
  openPlaylist() {
    this.setData({
      showPlaylist: true
    })
  },
  chooseSong(e) {
    let {id,index} = e.currentTarget.dataset
    // this.setData({
    //   index
    // })
    app.globalData.index = index
    // app.pid(null)
    app.addSong(id)
    app.playList(this.data.dailySongs)
    wx.navigateTo({
      url: '/pages/song-play/song-play?id='+id,
    })
  },
  onShow() {
    if(app.globalData.id && app.globalData.playList.length > 0) {
      this.setData({
        showAudio: true
      })
    }
  }
})