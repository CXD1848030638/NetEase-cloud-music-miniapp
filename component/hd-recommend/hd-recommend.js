import {personal_fm} from '../../service/songs'
const app = getApp()
Component({
  properties: {

  },

  data: {
    recommendList:[{
      icon: 'icon-meirinongshi',
      text: '每日推荐',
      type: 'recommend'
    },{
      icon: 'icon-sirenFM',
      text: '私人FM',
      type: 'FM'
    },{
      icon: 'icon-remengedanjingangqu',
      text: '歌单',
      type: 'songlist'
    },{
      icon: 'icon-paihang',
      text: '排行榜',
      type: 'ranklist'
    },{
      icon: 'icon-zhuanjis',
      text: '歌手',
      type: 'singer'
    }]
  },

  methods: {
    openNew(e) {
      let type = e.currentTarget.dataset.type
      if(type == 'FM') {
        personal_fm().then(res => {
          const data = res.data
          app.globalData.index = 0
          app.addSong(data[0].id)
          app.playList(data)
          wx.navigateTo({
            url: '/pages/song-play/song-play?id=' + data[0].id,
          })
        })
      } else {
        wx.navigateTo({
          url: `/pages/new-${type}/new-${type}`,
        })
      }
    }
  }
})
