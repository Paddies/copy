import request from '@/utils/request'
export function page(data) {
  return request({
    url: '/businessLog/page',
    method: 'post',
    data: data
  })
}