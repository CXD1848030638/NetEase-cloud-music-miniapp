Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navList: {
      type: Array,
      value: []
    },
    navId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  methods: {
    chooseNav(e) {
      this.setData({
        navId: e.currentTarget.id
      })
      this.triggerEvent('changeNavId', {navId: e.currentTarget.id,index: e.currentTarget.dataset.index})
    }
  },
})
