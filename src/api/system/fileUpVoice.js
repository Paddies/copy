import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/voice/page',
    method: 'post',
    data: data
  })
}




export function add(data) {
  return request({
    url: '/voice/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/voice/update',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/voice/del',
    method: 'post',
    data: data
  })
}




