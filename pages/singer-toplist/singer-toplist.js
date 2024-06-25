import {singerInfo} from "../../service/songs"
const app = getApp()
Page({
  data: {
    h: '',
    scrollStyle: '',
    opcity: 1,
    id: "",
    artist: {},
    hotSongs: [],
    // 弹框组件控制
    isShow: false,
    index: 0,
    showAudio: false,
  },
  onLoad: function (options) {
    let h = wx.getSystemInfoSync().statusBarHeight
    this.setData({
      h,
      id: options.id
    })
    this._singerInfo(this.data.id)
  },
  _singerInfo(id) {
    singerInfo(id).then(res => {
      const artist = res.artist
      const hotSongs = res.hotSongs
      this.setData({
        artist,hotSongs
      })
    })
  },
  chooseSong(e) {
    let {id,index} = e.currentTarget.dataset
    app.globalData.index = index
    app.addSong(id)
    app.playList(this.data.hotSongs)
    wx.navigateTo({
      url: '/pages/song-play/song-play?id='+ id,
    })
  },
  scroll(e) {
    let top = 220
    let scrollTop = e.detail.scrollTop
    if(scrollTop <= 150) {
      let opcity = (top - scrollTop) / top
      this.setData({
        opcity
      })
    }
  },
  backTo() {
    wx.navigateBack()
  },
  onShow() {
    let h = this.data.h
    if(app.globalData.id && app.globalData.playList.length > 0) {
      let scrollStyle = `height: calc(100% - ${h+44+62}px);top:${h+44}px;`
      this.setData({
        showAudio: true,
        scrollStyle
      })
    } else {
      let scrollStyle = `height: calc(100% - ${h+44}px);top:${h+44}px;`
      this.setData({
        scrollStyle
      })
    }
  }
})