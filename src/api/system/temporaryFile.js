import request from '@/utils/request'


// 获取附件列表
export function page(data) {
  return request({
    url: '/temporaryFile/page',
    method: 'post',
    data: data
  })
}


// 新增附件
export function add(data) {
  return request({
    url: '/temporaryFile/add',
    method: 'post',
    data: data
  })
}


// 下载附件
export function item(data) {
  return request({
    url: '/temporaryFile/item',
    method: 'get',
    data: data
  })
}

// 下载附件
export function del(data) {
  return request({
    url: '/temporaryFile/del',
    method: 'get',
    data: data
  })
}

// 下载附件
export function update(data) {
  return request({
    url: '/temporaryFile/update',
    method: 'get',
    data: data
  })
}

export function exprort(data) {
  return request({
    url: '/temporaryFile/downZipFileByProject',
    method: 'post',
    data: data
  })
}
