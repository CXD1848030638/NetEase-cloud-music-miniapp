import { getVideoInfo,getVideoComment} from "../../../../service/video"

Component({
  pageLifetimes: {
    hide: function() {
      // 页面被隐藏
      this.VideoContext && this.VideoContext.stop()
    },
  },
  lifetimes: {
    detached: function() {
      this.VideoContext && this.VideoContext.stop()
    }
  },
  options: {
    addGlobalClass: true
  },
  properties: {
    videoList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    vid: '',
    videoInfo: {},
    id: '',
    comments: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playVideo(e) {
      let vid = e.currentTarget.id
      // this.vid !== vid && this.VideoContext && this.VideoContext.stop()
      // this.vid = vid
      getVideoInfo(vid).then(res => {
        const videoInfo = res.urls[0]
        this.setData({
          vid,
          videoInfo
        })
        this.VideoContext = wx.createVideoContext(vid, this)
        this.VideoContext.play()
      })
    },
    chooseComment(e) {
      let id = e.currentTarget.id
      if(this.data.id == id) {
        this.setData({
          id: '',
          comments: []
        })
      } else {
        getVideoComment(id).then(res => {
          const comments =  res.comments
          this.setData({
            id,comments
          })
        })
      }
    }
  }
})
