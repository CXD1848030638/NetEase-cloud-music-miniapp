import {getSonglist, getSongDetail} from '../../service/songs'
const app = getApp()
Page({
  options: {
    addGlobalClass: true
  },
  data: {
    h:'',
    scrollStyle: '',
    id: 2201879658,
    songList: {},
    tracks: [],
    trackIds: [],
    // 弹框组件控制
    isShow: false,
    index: 0,
    showAudio: false,
    // 弹框信息
    songInfo: {}
  },

  onLoad: function (options) {
    let h = wx.getSystemInfoSync().statusBarHeight
    this.setData({
      id: options.id || '',
      h,
    })
    this._getSonglist()
  },
  _getSonglist() {
    getSonglist(this.data.id).then(res => {
      const songList = res.playlist
      this.setData({
        songList,
        trackIds: songList.trackIds
      })
      this._getSongDetail(songList.trackIds)
    })
  },
  _getSongDetail(trackIds) {
    let ids = []
    trackIds.forEach(ele => {
      ids.push(ele.id)
    })
    ids = ids.join(',')
    getSongDetail(ids).then(res => {
      const tracks = res.songs
      this.setData({
        tracks
      })
    })
  },
  loadmore() {
    console.log('11111');
  },
  backTo() {
    wx.navigateBack()
  },
  // 歌曲详情弹框
  openMenu(e) {
    let songInfo = e.currentTarget.dataset.info
    this.setData({
      isShow: true,
      songInfo
    })
  },
  closeMenu() {
    this.setData({
      isShow: false,
    })
  },
  chooseSong(e) {
    let {id,index} = e.currentTarget.dataset
    app.globalData.index = index
    // app.pid(this.data.id)
    app.addSong(id)
    app.playList(this.data.tracks)
    wx.navigateTo({
      url: '/pages/song-play/song-play?pid='+ this.data.id,
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