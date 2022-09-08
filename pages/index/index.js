import {getBannerData, getRcommendList,getPlaylistDetail} from "../../service/home"
const app = getApp()
Page({
  data: {
    ids: [{
      name: '飙升榜',
      id: 19723756,
    },{
      name: '新歌榜',
      id: 3779629
    },{
      name: '热歌榜',
      id: 3778678
    },{
      name: '原创榜',
      id: 2884035
    },{
      name: '云音乐电音榜',
      id: 1978921795,
    },{
      name: 'UK排行榜周榜',
      id: 180106,
    }],
    banners: [],
    recommendList: [],
    rankList: [],
    showAudio: false
  },
  onLoad: function (options) {
    let h = wx.getSystemInfoSync()
    this._getBannerData()
    this._getRecommendList()
    this._getRankList()
  },
  _getBannerData() {
    getBannerData().then(res => {
      const banners = res.banners
      this.setData({
        banners: banners
      })
    })
  },
  _getRecommendList() {
    getRcommendList().then(res => {
      const recommendList = res.result
      this.setData({
        recommendList: recommendList
      })
    })
  },
  _getRankList() {
    let rankList = []
    this.data.ids.forEach((ele,index) => {
      getPlaylistDetail(ele.id).then(res => {
        rankList.push({
          id: ele.id,
          name: ele.name,
          picUrl: res.playlist.coverImgUrl,
          tracks: res.playlist.tracks.slice(0,3)
        })
        this.setData({
          rankList
        })
      })
    })
  },
  onShow() {
    if(app.globalData.id && app.globalData.playList.length > 0) {
      this.setData({
        showAudio: true
      })
    }
  },
  search() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})