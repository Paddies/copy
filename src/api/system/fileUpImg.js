import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/img/page',
    method: 'post',
    data: data
  })
}




export function add(data) {
  return request({
    url: '/img/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/img/update',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/img/del',
    method: 'post',
    data: data
  })
}




