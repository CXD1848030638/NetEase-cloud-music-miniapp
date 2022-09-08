import {getRecentPlayList,getLevel} from '../../service/home'
import {getSongDetail,userPlayList,activeList,getSonglist} from '../../service/songs'
const app = getApp() 
Page({
  data: {
    h: '',
    showAudio: false,
    scrollStyle: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户播放记录
    level: {},
    likes: {},
    own: [],
  },
  onLoad: function() {
    let h = wx.getSystemInfoSync().statusBarHeight
    this.setData({
      h
    })
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      this._getRecentPlayList(1)
      this._getLevel()
      this._userPlayList(this.data.userInfo.userId)
    }
  },
  _userPlayList(id) {
    userPlayList(id).then(res => {
      const own = res.playlist
      this.setData({
        likes: res.playlist[0],
        own: own.slice(1)
      })
    })
  },
  _getLevel() {
    getLevel().then(res => {
      this.setData({
        level: res.data
      })
    })
  },
  _getRecentPlayList(type) {
    let params = {
      uid: this.data.userInfo.userId,
      type: type
    }
    getRecentPlayList(params).then(res => {
      this.setData({
        recentPlayList: res.weekData
      })
    })
  },
  chooseSong(e) {
    let id = e.currentTarget.id
    app.addSong(id)
    getSongDetail(id).then(res => {
      app.playList(res.songs)
    })
    wx.navigateTo({
      url: '/pages/song-play/song-play?id=' + id,
    })
  },
  toLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  chooselist(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/song-list/song-list?id=' + id,
    })
  },
  activePlay() {
    let pid = this.data.likes.id
    getSonglist(pid).then(res => {
      let index = Math.floor(Math.random() * 172)
      let id = res.playlist.tracks[index].id
      activeList(pid,id).then(res => {
        app.globalData.index = -1
        app.addSong(id)
        // app.pid(pid, 'active')
        app.playList(res.data)
        wx.navigateTo({
          url: '/pages/song-play/song-play?active=1&pid='+pid,
        })
      })
    })
  },
  onShow() {
    let h = this.data.h
    if(app.globalData.id && app.globalData.playList.length > 0) {
      let scrollStyle = `height: calc(100% - ${h+44+60}px);top:${h+44}px;`
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