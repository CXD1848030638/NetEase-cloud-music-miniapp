// component/recommend-list/recommend-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendList: {
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
    toList() {
      wx.navigateTo({
        url: '/pages/new-songlist/new-songlist',
      })
    }
  }
})
