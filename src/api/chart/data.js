import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/chart/list',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/chart/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/chart/edit',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/chart/del',
    method: 'post',
    data: data
  })
}

export function data(data) {
  return request({
    url: '/chart/chart',
    method: 'post',
    data: data
  })
}
