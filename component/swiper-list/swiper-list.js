// component/swiper-list/swiper-list.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    swiperList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseList(e) {
      let id = e.currentTarget.id
      wx.navigateTo({
        url: '/pages/song-list/song-list?id=' + id,
      })
    }
  }
})
