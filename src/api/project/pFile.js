import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/pFile/page',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/pFile/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/pFile/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/pFile/del',
    method: 'post',
    data: data
  })
}
