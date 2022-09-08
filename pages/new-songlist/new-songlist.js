import {getNavList, getPlayList} from "../../service/songs"
Page({
  data: {
    params: {
      limit: 1,
      before: '',
      tag: '',
      id: ''
    },
    navList: [],
    playList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getNavList()
  },
  _getNavList() {
    getNavList().then(res => {
      this.setData({
        navList: res.tags.slice(0, 7),
        params: {
          limit: 1,
          before: 0,
          tag: res.tags[0].name,
          id: res.tags[0].id
        }
      })
      this._getPlayList(this.data.params)
    })
  },
  _getPlayList(params) {
    getPlayList(params).then(res => {
      const playList = res.playlists
      this.setData({
        playList
      })
    })
  },
  changeNav(e) {
    let params = {
      limit: 1,
      before: '',
      tag: this.data.navList[e.detail.index].name,
      id: this.data.navList[e.detail.index].id
    }
    this._getPlayList(params)
    this.setData({
      params
    })
  }
})