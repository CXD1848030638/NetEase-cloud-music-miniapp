import {getVideoNav ,getVideoList, getVideoInfo} from "../../service/video"
const app = getApp()
Page({
  data: {
    navList: [],
    videoList: [],
    navId: '',
    offset: 0,
    isTrigger: false
  },

  onLoad: function (options) {
    this._getVideoNav()
  },
  _getVideoNav () {
    getVideoNav().then(res => {
      let navList = res.data.splice(0,10)
      navList[0].selectTab = true
      this.setData({
        navList,
        navId: navList[0].id
      })
      this._getVideoList(navList[0].id)
    })
  },
  _getVideoList (id, offset) {
    let self = this
    getVideoList(id, offset).then(res => {
      let videoList = res.datas
      this.setData({
        videoList,
        isTrigger: false
      })
    })
  },
  changeNav(e) {
    this._getVideoList(e.detail.navId)
    this.setData({
      navId: e.detail.navId 
    })
  },
  update() {
    this._getVideoList(this.data.navId)
  },
  loadMore() {
    let id = this.data.navId
    this.data.offset++
    let self = this
    getVideoList(id, this.data.offset).then(res => {
      let videoList = this.data.videoList
      res.datas.forEach(ele => {
        videoList.push(ele)
      })
      this.setData({
        videoList
      })
    })
  },
  onShareAppMessage: function ({from}) {
    return {
      title: '转发内容',
      page: '/pages/video/video',
    }
  },
  onShow() {
    app.globalData.state && app.globalData.backgroundAudioManager.pause()
    app.globalData.state = false
  }
})