import {searchRecord,searchSuggest,search} from '../../service/home'
const app = getApp()
Page({
  data: {
    show: '0',
    hotSearch: [],
    searchSuggest: [],
    searchInfo: [],
    history: []
  },
  options: {
    addGlobalClass: true
  },
  onLoad: function (options) {
    this.setData({
      history: (wx.getStorageSync('history') && JSON.parse(wx.getStorageSync('history'))) || []
    })
    this._searchRecord()
  },
  _searchRecord() {
    searchRecord().then(res => {
      const hotSearch = res.data
      this.setData({
        hotSearch
      })
    })
  },
  input(e) {
    let value = e.detail.value
    if(value) {
      searchSuggest(value).then(res => {
        console.log(res);
        const searchSuggest = res.result.allMatch
        this.setData({
          show: '1',
          searchSuggest
        })
      })
    } else {
      this.setData({
        show: '0'
      })
    }
  },
  searchWord(e) {
    let value = e.currentTarget.dataset.name
    let history = this.data.history
    let index = history.indexOf(value)
    if(index == -1) {
      history.unshift(value)
    } else {
      history.splice(index,1)
       history.unshift(value)
    }
    history.length > 10?history = history.slice(0,10):''
    wx.setStorage({
      data: JSON.stringify(history),
      key: 'history',
    })
    this.setData({
      history
    })
    search(value).then(res => {
      console.log(res);
      const searchInfo = res.result.songs
      this.setData({
        show: '2',
        searchInfo
      })
    })
  },
  search(e) {
    let value = e.detail.value
    let index = history.indexOf(value)
    if(index == -1) {
      history.unshift(value)
    } else {
      history.splice(index,1)
      history.unshift(value)
    }
    history.length > 10?history = history.slice(0,10):''
    wx.setStorage({
      data: JSON.stringify(history),
      key: 'history',
    })
    this.setData({
      history
    })
    search(value).then(res => {
      console.log(res);
      const searchInfo = res.result.songs
      this.setData({
        show: '2',
        searchInfo
      })
    })
  },
  clear() {
    wx.removeStorage({
      key: 'history',
    })
    this.setData({
      history: []
    })
  },
  chooseSong(e) {
    let {id,index} = e.currentTarget.dataset
    app.globalData.index = index
    app.addSong(id)
    app.playList(this.data.searchInfo)
    wx.navigateTo({
      url: '/pages/song-play/song-play?id='+ id,
    })
  }
})