import {getRankList} from "../../service/home"

Page({

  data: {
    ids: [1978921795,71385702,991319590,5059633707,5059661515,10520166,71384707,5059642708],
    ids1: [60198,180106,11641012,60131,27135204,2809577409,2809513713,5059644681,745956260],
    gList: [],
    list: []
  },

  onLoad: function (options) {
    // this._getRankList()
    this._getRanks()
  },
  _getRanks() {
    getRankList().then(res => {
      const gList = res.list.slice(0,4)
      let list = []
      let worldList = []
      this.data.ids.forEach(ele => {
        try {
          res.list.forEach(item => {
            if(ele == item.id) {
              list.push(item)
              throw new Error('EndIterative')
            }
          })
        } catch(e) {
          if(e.message != 'EndIterative') throw e
        }
      })
      this.data.ids1.forEach(ele => {
        try {
          res.list.forEach(item => {
            if(ele == item.id) {
              worldList.push(item)
              throw new Error('EndIterative')
            }
          })
        } catch(e) {
          if(e.message != 'EndIterative') throw e
        }
      })
      this.setData({
        gList,list,worldList
      })
    })
  },
  _getRankList() {
    getRankList().then(res => {
      console.log(res);
      const rankList = res.list
    })
  },
  chooseList(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/song-list/song-list?id=' + id,
    })
  }
})