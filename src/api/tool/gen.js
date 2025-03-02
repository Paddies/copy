import request from "@/utils/request";

// 查询生成表数据
export function listTable(query) {
  return request({
    url: "/tool/gen/list",
    method: "get",
    params: query,
  });
}
// 查询db数据库列表
export function listDbTable(query) {
  return request({
    url: "/tool/gen/db/list",
    method: "get",
    params: query,
  });
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: "/tool/gen/" + tableId,
    method: "get",
  });
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: "/tool/gen",
    method: "put",
    data: data,
  });
}

// 导入表
export function importTable(data) {
  return request({
    url: "/tool/gen/importTable",
    method: "post",
    params: data,
  });
}

// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: "/tool/gen/preview/" + tableId,
    method: "get",
  });
}

// 删除表数据
export function delTable(tableId) {
  return request({
    url: "/tool/gen/" + tableId,
    method: "delete",
  });
}

// 生成代码（自定义路径）
export function genCode(tableName) {
  return request({
    url: "/tool/gen/genCode/" + tableName,
    method: "get",
  });
}

// 同步数据库
export function synchDb(tableName) {
  return request({
    url: "/tool/gen/synchDb/" + tableName,
    method: "get",
  });
}

// 上传
export function uploadImg(data) {
  return request({
    url: "/tools/upFile",
    method: "post",
    data: data,
  });
}

// 图片转译
export function latexImage(params) {
  return request({
    url: "tools/latexImageByFileId",
    method: "get",
    params,
  });
}

export function file(fileId) {
  var baseUrl =
    process.env.VUE_APP_BASE_API + "/tools/downFile?fileId=" + fileId;
  return baseUrl;
}

// 删除
export function deleteTempFile(params) {
  return request({
    url: "tools/deleteTempFile",
    method: "get",
    params,
  });
}
