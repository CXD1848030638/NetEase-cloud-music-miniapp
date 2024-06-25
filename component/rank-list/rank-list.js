// component/rank-list/rank-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankList: {
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
    clickon() {
      console.log(this.data);
    },
    toList() {
      wx.navigateTo({
        url: '/pages/new-ranklist/new-ranklist',
      })
    }
  }
})
