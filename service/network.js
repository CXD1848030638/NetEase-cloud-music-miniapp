import { baseURL, timeout} from "./config"

function request(options, method='GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      timeout: timeout,
      data: {
        ...options.data,
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').toString():''
      },
      method: method,
      header: {
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').toString():''
      },
      success: function(res) {
        if(options.data && options.data.islogin) {
          wx.setStorage({
            data: res.data.cookie,
            key: 'cookies',
          })
          console.log(wx.getStorageSync('cookies'));
        }
        resolve(res.data)
      },
      fail: reject,
      complete: res => {
      }
    })
  })
}

export default request;