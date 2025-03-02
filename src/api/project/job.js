import request from "@/utils/request";
export function page(data) {
  return request({
    url: "/job/list",
    method: "post",
    data: data,
  });
}

export function jobUserPage(data) {
  return request({
    url: "/job/listUser",
    method: "post",
    data: data,
  });
}

export function item(data) {
  return request({
    url: "/job/item",
    method: "post",
    data: data,
  });
}

export function add(data) {
  return request({
    url: "/job/add",
    method: "post",
    data: data,
  });
}

export function update(data) {
  return request({
    url: "/job/edit",
    method: "post",
    data: data,
  });
}

export function del(data) {
  return request({
    url: "/job/del",
    method: "post",
    data: data,
  });
}

export function poiXml(data) {
  return request({
    url: "/job/poiXml",
    method: "post",
    data: data,
  });
}

// 驳回
export function RejectJobContent(data) {
  return request({
    // url: 'jobContent/edit',
    url: "jobContent/reject",
    method: "post",
    data,
  });
}

// 通过
export function PassJobContent(data) {
  return request({
    // url: 'jobContent/edit',
    url: "jobContent/pass",
    method: "post",
    data,
  });
}

// 驳回或者提交前自动保存
export function JobContentCheckSave(data) {
  return request({
    url: "jobContent/checkSave",
    method: "post",
    data,
  });
}

// 保存
export function EditJobContent(data) {
  return request({
    // url: 'jobContent/edit',
    url: "jobContent/save",
    method: "post",
    data,
  });
}

// 提交
export function addJobContentUpdata(data) {
  return request({
    // url: 'jobContent/addUpdata',
    url: "jobContent/submit",
    method: "post",
    data,
  });
}

export function getJobContent(data) {
  return request({
    url: "jobContent/item",
    method: "post",
    data,
  });
}
// const item = {
//   fileName: "了解公会.pdf",
//   versionNo: None,
//   cTime: "2023-10-18 15: 10: 49",
//   id: "1714539515030306816",
//   fileId: "1714539464870625280",
//   md5: "e08dbf294a384b5ad8d4d9d7a723ab4b",
//   tags: "官网",
// };
export function deleteJob(data) {
  return request({
    url: "job/delJob",
    method: "post",
    data,
  });
}

// 查询定时任务调度列表
export function listJobhome(data) {
  return request({
    url: "/job/jobHome",
    method: "post",
    data: data,
  });
}

// 点击文件名查询该分组下的所有任务
export function getJobGroupTable (data) {
  return request({
    url: "jobContent/job4group",
    method: 'post',
    data
  })
}

export function cancellation(data) {
  return request({
    url: '/jobContent/jobInvalid',
    method: 'post',
    data
  })
}


export function completeMarkSave(data) {
  return request({
    url: "jobContent/finishEnd",
    method: "post",
    data: data,
  });
}


export function completeCheckSave(data) {
  return request({
    url: "jobContent/checkEnd",
    method: "post",
    data: data,
  });
}

export function receiveJob(data) {
  return request({
    url: "group/statusEdit",
    method: "post",
    data: data,
  });
}
export function receiveCheck(data) {
  return request({
    url: "group/getCheckGroup",
    method: "post",
    data: data,
  });
}