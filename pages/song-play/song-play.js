const app = getApp()
import moment from 'moment'
import {getSongUrl, getSongLyric,getSonglist,getSongDetail,activeList} from '../../service/songs'
let time = null
Page({
  data: {
    h: '',
    pid: '',
    //播放列表
    playList: [],
    isShow: false,
    songInfo: {},
    isPlay: true,
    musicSrc: '',
    //播放进度控制
    progress: 0,
    ct: '00:00',
    dt: '00:00',
    // 播放进度跳转
    width: 0,
    offsetLeft: 0,
    // 循环播放
    circleType: 'icon-xunhuan', 
    //歌词
    lyric: [],
    marginTop: 0,
    currentIndex: 0,
  },

  onLoad: function (options) {
    let h = wx.getSystemInfoSync().statusBarHeight
    this.setData({
      h,
      pid: options.pid || ''
    })
    //心动模式播放
    if(options.active == '1') {
      this.setData({
        circleType: 'icon-B',
      })
    }
    if(app.globalData.isSame) {
      if(app.globalData.backgroundAudioManager.src && app.globalData.backgroundAudioManager.title) {
        getSongDetail(app.globalData.id).then(res => {
          let dt = moment(res.songs[0].dt).format('mm:ss')
          this.setData({
            dt,
            songInfo: res.songs[0],
            playList: app.globalData.playList
          })
        })
        app.globalData.backgroundAudioManager.play()
      } else {
        getSongDetail(app.globalData.id).then(res => {
          let dt = moment(res.songs[0].dt).format('mm:ss')
          this.setData({
            dt,
            songInfo: res.songs[0],
            playList: app.globalData.playList
          })
          this._getUrl(app.globalData.id)
        })
      }
    } else {
      app.globalData.backgroundAudioManager = wx.getBackgroundAudioManager()
      getSongDetail(app.globalData.id).then(res => {
        let dt = moment(res.songs[0].dt).format('mm:ss')
        this.setData({
          dt,
          songInfo: res.songs[0],
          playList: app.globalData.playList
        })
        this._getUrl(app.globalData.id)
      })
    }
     // 获取歌词
    this._getSongLyric(app.globalData.id)
    app.globalData.backgroundAudioManager.onPrev(() => {
      this.changeSong('pre')
    })
    app.globalData.backgroundAudioManager.onNext(() => {
      this.changeSong('next')
    })
    app.globalData.backgroundAudioManager.onEnded(() => {
      this.circlePlay()
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
    app.globalData.backgroundAudioManager.onTimeUpdate((e)=> {
      let self = this
      let ct = moment(app.globalData.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      
      let index = 1
      if(self.data.currentIndex >= index) {
        self.setData({
          marginTop: (self.data.currentIndex - index) * 28
        })
      }
      if(ct !== self.data.ct) {
        let progress = ((app.globalData.backgroundAudioManager.currentTime) / (this.data.songInfo.dt/1000))*100
        self.setData({
          ct,
          progress
        })
        if(self.data.lyric.length !== 0 && this.data.songInfo.fee !== 1) {
          self.lyricProgressUpdate()
        }
      }
      
    })
    let obj = wx.createSelectorQuery()
    obj.select('.progress-line').boundingClientRect((rec) => {
      this.setData({
        offsetLeft: rec.left,
        width: rec.width
      })
    })
    obj.exec()
  },
  backTo() {
    wx.navigateBack()
  },
  //获取歌词
  _getSongLyric(id) {
    getSongLyric(id).then(res => {
      if(res.lrc && res.lrc.lyric) {
        this.setData({
          lyric: this.sliceNull(this.parseLyric(res.lrc.lyric))
        })
      }
    })
  },
  //歌词处理
  parseLyric(text) {
    let result = []
    let lines = text.split('\n')
    let pattern = /\[\d{2}:\d{2}.\d+\]/g
    if(!pattern.test(lines[0])) {
      lines = lines.slice(1);
    }
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach((ele, index, arr) => {
      var time = ele.match(pattern)
      var value = ele.replace(pattern, '');
      time.forEach((e,i,a) => {
        var t = e.slice(1, -1).split(':');
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      })
    })
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  sliceNull(lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    return result
  },
  //歌词进度更新处理
  lyricProgressUpdate() {
    let self = this
    if(self.data.currentIndex != self.data.lyric.length - 1) {
      for(let j = self.data.currentIndex; j< self.data.lyric.length - 1; j++) {
        if(self.data.currentIndex == self.data.lyric.length - 2) {
          if (parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) > parseFloat(self.data.lyric[self.data.lyric.length - 1][0])) {
            self.setData({
              currentIndex: self.data.lyric.length - 1
            })
            return;
          }
        } else {
          if (parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) >= parseFloat(self.data.lyric[j][0]) && parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) < parseFloat(self.data.lyric[j + 1][0])) {
            self.setData({
              currentIndex: j
            })
            return;
          }
        }
      }
    }
  },
  _getUrl(id) {
    getSongUrl(id).then(res => {
      const musicSrc = res.data[0].url
      if(musicSrc) {
        this.setData({
          musicSrc
        })
        app.globalData.backgroundAudioManager = wx.getBackgroundAudioManager()
        app.globalData.backgroundAudioManager.coverImgUrl = this.data.songInfo.al.picUrl
        app.globalData.backgroundAudioManager.src = this.data.musicSrc
        app.globalData.backgroundAudioManager.title = this.data.songInfo.name
      } else {
        this.setData({
          musicSrc: ''
        })
        time = setTimeout(() => {
          this.changeSong('next')
        }, 3000)
      }
    })
  },
  circlePlay() {
    if(this.data.circleType == 'icon-xunhuan' || this.data.circleType == 'icon-B') {
      this.changeSong('next')
    } else {
      app.globalData.backgroundAudioManager.src = this.data.musicSrc
      app.globalData.backgroundAudioManager.title = this.data.songInfo.name
    }
  },
  play() {
    this.setData({
      isPlay: !this.data.isPlay
    })
    this.musicControl(this.data.isPlay)
  },
  musicControl(isPlay) {
    if(isPlay) {
      if(app.globalData.backgroundAudioManager.src) {
        app.globalData.backgroundAudioManager.play()
      } else {
        app.globalData.backgroundAudioManager.src = this.data.musicSrc
        app.globalData.backgroundAudioManager.title = this.data.songInfo.name
      }
    } else {
      app.globalData.backgroundAudioManager.pause()
    }
  },
  //切换歌曲播放模式
  changeCircleType() {
    if(this.data.circleType == 'icon-xunhuan') {
      var circleType= 'icon-xunhuan1'
    } else if(this.data.circleType == 'icon-xunhuan1') {
      if(this.data.pid) {
        var circleType= 'icon-B'
        activeList(this.data.pid,this.data.songInfo.id).then(res => {
          this.setData({
            playList: res.data
          })
          app.globalData.index = -1
          app.playList(this.data.playList)
        })
      } else {
        var circleType= 'icon-xunhuan'
      }
    } else {
      var circleType = 'icon-xunhuan'
      getSonglist(this.data.pid).then(res => {
        const songList = res.playlist
        let ids = []
        songList.trackIds.forEach(ele => {
          ids.push(ele.id)
        })
        ids = ids.join(',')
        getSongDetail(ids).then(t => {
          const playList = t.songs
          this.setData({
            playList
          })
          app.globalData.index = -1
          app.playList(this.data.playList)
        })
      })
    }
    this.setData({
      circleType
    })
  },
  //切换歌曲
  changeSong(type) {
    clearTimeout(time)
    getSongDetail(app.getSong(type)).then(res => {
      this.getSongInfo(res.songs[0])
    })
  },
  //歌曲播放函数
  async getSongInfo(info) {
    await this._getSongLyric(info.id)
    await this._getUrl(info.id)
    await this.setData({
      dt: moment(info.dt).format( 'mm:ss'),
      songInfo: info,
      marginTop: 0,
      currentIndex: 0,
      lyric: []
    })
  },
  switchSong (e) {
    let type = e.currentTarget.id 
    this.changeSong(type)
  },
  // 点击改变进度条
  changeProgress(e) {
    let self = this
    let current = e.changedTouches[0].pageX - this.data.offsetLeft
    if(current>0 && current < this.data.width) {
      let progress = current / this.data.width
      let currentTime = app.globalData.backgroundAudioManager.duration * progress
      for(let i = 0; i < self.data.lyric.length - 1; i++) {
        if(currentTime >= parseFloat(self.data.lyric[i][0]) && currentTime < parseFloat(self.data.lyric[i + 1][0])) {
          self.setData({
            currentIndex: i,
            progress: progress * 100,
            isPlay: true
          })
          break
        }
      }
      app.globalData.backgroundAudioManager.seek(currentTime)
      app.globalData.backgroundAudioManager.play()
    }
  },

  // 播放列表
  openList() {
    this.setData({
      isShow: true,
      index: app.globalData.index > 4? app.globalData.index-4:0
    })
  },
  closeList() {
    this.setData({
      isShow: false
    })
  },
  // 选择某一首歌
  chooseSong(e) {
    app.globalData.index = e.currentTarget.id
    let id = e.currentTarget.dataset.info
    getSongDetail(id).then(res => {
      this.getSongInfo(res.songs[0])
    })
  },
  onShow: function() {
    this.setData({
      marginTop: 0,
      currentIndex: 0,
    })
  },
  onUnload: function() {
    if(this.data.circleType == 'icon-B') {
      app.globalData.active = '1'
    } else {
      app.globalData.active = '0'
    }
    app.globalData.pid = this.data.pid
    app.globalData.state = this.data.isPlay
    app.globalData.id = this.data.songInfo.id
  }
})