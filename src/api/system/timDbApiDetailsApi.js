import request from '@/utils/request'

//api接口分页获取客服列表
export function timApiPage(params) {
return request({
url: '/tim-db/api/pages',
method: 'post',
data:params
})
}

//api接口获取详情
export function timApiItem(params) {
return request({
url: '/api/page/sys-init-timApi/item',
method: 'post',
data:params
})
}

//api接口新增
export function timApiInsert(params) {
return request({
url: '/api/insert/timApi',
method: 'post',
data:params
})
}

//更新api接口
export function timApiUpdate(params) {
return request({
url: '/api/update/timApi/id',
method: 'post',
data:params
})
}


//api接口删除
export function timApiDel(params) {
return request({
url: '/api/del/timApi/id',
method: 'post',
data:params
})
}
