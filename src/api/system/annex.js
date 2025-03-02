import request from '@/utils/request'


// 获取附件列表
export function fileList(data) {
  return request({
    url: '/tools/fileList',
    method: 'post',
    data: data
  })
}


// 新增附件
export function addFiler(data) {
  return request({
    url: '/tools/upFile',
    method: 'post',
    data: data
  })
}


// 下载附件
export function downloadFiler(data) {
  return request({
    url: '/tools/downFile',
    method: 'get',
    data: data
  })
}
