import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/managePointCloud/page',
    method: 'post',
    data: data
  })
}


export function add(data) {
  return request({
    url: '/managePointCloud/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/managePointCloud/update',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/managePointCloud/del',
    method: 'post',
    data: data
  })
}




