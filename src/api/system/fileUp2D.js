import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/twoDimensional/page',
    method: 'post',
    data: data
  })
}


export function add(data) {
  return request({
    url: '/twoDimensional/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/twoDimensional/update',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/twoDimensional/del',
    method: 'post',
    data: data
  })
}




