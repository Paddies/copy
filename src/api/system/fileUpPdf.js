import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/pdf/page',
    method: 'post',
    data: data
  })
}




export function add(data) {
  return request({
    url: '/pdf/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/pdf/update',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/pdf/del',
    method: 'post',
    data: data
  })
}



