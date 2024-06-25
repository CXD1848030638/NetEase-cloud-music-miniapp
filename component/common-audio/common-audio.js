const app = getApp()
import {getSongUrl,getSongDetail} from "../../service/songs"
Component({
  options: {
    addGlobalClass: true
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log(11111);
      getSongDetail(app.globalData.id).then(res => {
        this.setData({
          playList: app.globalData.playList,
          songInfo: res.songs[0],
          isPlay: app.globalData.state,
          pid: app.globalData.pid,
          active: app.globalData.active
        })
      })
      app.globalData.backgroundAudioManager.onEnded(() => {
        this.nextSong()
      })
      app.globalData.backgroundAudioManager.onPlay(()=>{
        this.setData({
          isPlay: true
        })
        app.globalData.backgroundAudioManager.play()
      })
      app.globalData.backgroundAudioManager.onPause(()=>{
        this.setData({
          isPlay: false
        })
        app.globalData.backgroundAudioManager.pause()
      })
      app.globalData.backgroundAudioManager.onStop(()=>{
        this.setData({
          isPlay: false
        })
        app.globalData.backgroundAudioManager.stop()
        app.globalData.backgroundAudioManager.currentTime = 0
        app.globalData.backgroundAudioManager.duration = 0
      })
    },
    hide: function() {
      // 页面被隐藏
      app.globalData.state = this.data.isPlay
    },
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      getSongDetail(app.globalData.id).then(res => {
        this.setData({
          playList: app.globalData.playList,
          songInfo: res.songs[0],
          isPlay: app.globalData.state,
          pid: app.globalData.pid,
          active: app.globalData.active
        })
      })
      app.globalData.backgroundAudioManager.onEnded(() => {
        this.nextSong()
      })
      app.globalData.backgroundAudioManager.onPlay(()=>{
        this.setData({
          isPlay: true
        })
        app.globalData.backgroundAudioManager.play()
      })
      app.globalData.backgroundAudioManager.onPause(()=>{
        this.setData({
          isPlay: false
        })
        app.globalData.backgroundAudioManager.pause()
      })
      app.globalData.backgroundAudioManager.onStop(()=>{
        this.setData({
          isPlay: false
        })
        app.globalData.backgroundAudioManager.stop()
        app.globalData.backgroundAudioManager.currentTime = 0
        app.globalData.backgroundAudioManager.duration = 0
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      app.globalData.state = this.data.isPlay
    },
  },

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //播放列表
    playList: [],
    songInfo: {},
    isPlay: false,
    pid: '',
    active: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    play() {
      this.setData({
        isPlay: !this.data.isPlay
      })
      if(this.data.isPlay) {
        app.globalData.backgroundAudioManager.play()
      } else {
        app.globalData.backgroundAudioManager.pause()
      }
    },
    goSongPlay() {
      app.globalData.isSame = true
      if(this.data.active == '1') {
        wx.navigateTo({
          url: '/pages/song-play/song-play?active=1&pid='+this.data.pid,
        })
      } else {
        wx.navigateTo({
          url: '/pages/song-play/song-play?pid='+this.data.pid,
        })
      }
    },
    nextSong() {
      let id = app.getSong('next')
      getSongDetail(id).then(res => {
        this.setData({
          songInfo: res.songs[0]
        })
        getSongUrl(id).then(result => {
          app.globalData.backgroundAudioManager = wx.getBackgroundAudioManager()
          app.globalData.backgroundAudioManager.src = result.data[0].url
          app.globalData.backgroundAudioManager.title = this.data.songInfo.name
        })
      })
    }
  }
})
