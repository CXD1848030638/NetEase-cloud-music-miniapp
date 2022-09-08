import request from "./network"
export function getVideoNav() {
  return request({
    url: '/video/group/list'
  })
}
export function getVideoList(id, offset = 0) {
  return request({
    url: '/video/group',
    data: {
      id: id,
      offset: offset
    }
  })
}

export function getVideoInfo(vid) {
  return request({
    url: '/video/url',
    data: {
      id: vid
    }
  })
}

// 视频评论 
export function getVideoComment(id, offset = 1) {
  return request({
    url: '/comment/video',
    data: {
      id: id,
      offset: offset,
      limit: 40
    }
  })
}