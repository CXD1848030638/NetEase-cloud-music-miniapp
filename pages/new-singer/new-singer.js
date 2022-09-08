import {getSingers,followSub} from "../../service/songs"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [{
      name: '华语',
      id: '7'
    },{
      name: '欧美',
      id: '96'
    },{
      name: '日本',
      id: '8'
    },{
      name: '韩国',
      id: '16'
    },{
      name: '其他',
      id: '0'
    }],
    typeList: [{
      name: '男',
      id: '1'
    },{
      name: '女',
      id: '2'
    },{
      name: '乐队/组合',
      id: '3'
    }],
    area: '',
    type:'',
    offset: 0,
    singerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSingers({initial:-1,offset: 0})
  },
  _getSingers(params) {
    getSingers(params).then(res => {
      let singerList = res.artists
      this.setData({
        singerList
      })
    })
  },
  filter(e) {
    let id = e.currentTarget.id
    let type = e.currentTarget.dataset.type
    if(!this.data.area && !this.data.type) {
      if(type == 'area') {
        this.setData({
          area: id,
          type: '1',
          offset: 0
        })
      } else{
        this.setData({
          area: '7',
          type: id,
          offset: 0
        })
      }
    } else {
      if(type == 'area') {
        this.setData({
          area: id,
          offset: 0
        })
      } else{
        this.setData({
          type: id,
          offset: 0
        })
      }
    }
    this._getSingers({area:this.data.area,type:this.data.type,initial:-1,offset: 0})
  },
  follow(e) {
    let info = e.currentTarget.dataset.info
    let t = info.followed?0:1
    let singerList = this.data.singerList
    singerList[e.currentTarget.id].followed = !info.followed
    this.setData({
      singerList
    })
    followSub({id:info.id,t})
  },
  toSinger(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/singer-toplist/singer-toplist?id='+id
    })
  },
  loadmore() {
    this.setData({
      offset: this.data.offset + 1
    })
    getSingers({area:this.data.area,type:this.data.type,initial:-1,offset: this.data.offset * 10}).then(res => {
      let singerList = this.data.singerList
      res.artists.forEach(ele => {
        singerList.push(ele)
      })
      this.setData({
        singerList
      })
    })
  }
})