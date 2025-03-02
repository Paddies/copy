import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/group/listContent',
    method: 'post',
    data: data
  })
}




export function add(data) {
  return request({
    url: '/group/addContent',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/group/editContent',
    method: 'post',
    data: data
  })
}


export function del(data) {
  return request({
    url: '/group/delContent',
    method: 'post',
    data: data
  })
}



