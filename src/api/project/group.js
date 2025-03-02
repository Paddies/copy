import request from "@/utils/request";
export function page(data) {
  return request({
    url: "/group/list",
    method: "post",
    data: data,
  });
}

export function quick(data) {
  return request({
    url: "/group/quick",
    method: "post",
    data: data,
  });
}

export function pageNull(data) {
  return request({
    url: "/group/listNote",
    method: "post",
    data: data,
  });
}

export function add(data) {
  return request({
    url: "/group/add",
    method: "post",
    data: data,
  });
}

export function update(data) {
  return request({
    url: "/group/edit",
    method: "post",
    data: data,
  });
}

export function statusUpdate(data) {
  return request({
    url: "/group/statusEdit",
    method: "post",
    data: data,
  });
}

export function reall(data) {
  return request({
    url: "/group/reAll",
    method: "post",
    data: data,
  });
}
export function del(data) {
  return request({
    url: "/group/del",
    method: "post",
    data: data,
  });
}
export function downZipFileByGroup(data) {
  return request({
    url: "/group/downZipFileByGroup",
    method: "post",
    data: data,
  });
}

// 锁定质检
export function lockCheckGroup(data) {
  return request({
    url: "/group/getCheckGroup",
    method: "post",
    data: data,
  });
}

// 获取未分配质检
export function getListCheckNote(data) {
  return request({
    url: "/group/listCheckNote",
    method: "post",
    data: data,
  });
}

// 领取质检
export function getCheckGroup(data) {
  return request({
    url: "/group/getCheckJob",
    method: "post",
    data: data,
  });
}

// 获取分组质检列表
export function getListCheck(data) {
  return request({
    url: "/group/listCheck",
    method: "post",
    data: data,
  });
}

// 完成质检前获取回显值
export function getGroupContentList(data) {
  return request({
    url: "/group/getGroupContentList",
    method: "post",
    data,
  });
}
// 题目标注统计

export function getAnnotationStatistics(data) {
  return request({
    url: "/group/getAnnotationStatistics",
    method: "post",
    data: data,
  });
}

// 质检统计
export function getCheckStatistics(data) {
  return request({
    url: "/group/getCheckStatistics",
    method: "post",
    data: data,
  });
}

// 标注完成

export function groupOkJob(data) {
  return request({
    url: "/group/groupOkJob",
    method: "post",
    data: data,
  });
}

// 质检完成

export function pdfJobCheckTask(data) {
  return request({
    url: "/group/pdfJobCheckTask",
    method: "post",
    data: data,
  });
}

// 标注无效任务

export function groupDiscardJob(data) {
  return request({
    url: "/group/groupDiscardJob",
    method: "post",
    data: data,
  });
}

// 标注开启任务
export function groupOpen(data) {
  return request({
    url: "/group/groupOpen",
    method: "post",
    data: data,
  });
}

// 质检-关闭分组
export function groupClose(data) {
  return request({
    url: "/group/groupClose",
    method: "post",
    data: data,
  });
}

// 质检-开启分组
export function groupCheckOpen(data) {
  return request({
    url: "/group/groupCheckOpen",
    method: "post",
    data: data,
  });
}

// 任务释放
export function groupRelease(data) {
  return request({
    url: "/group/release",
    method: "post",
    data: data,
  });
}
