import request from "@/utils/request";

// 3D文件上传
export function upFile3D(data) {
  return request({
    url: "/tools/upFile3D",
    method: "post",
    data,
  });
}

// 3D标注列表
export function get3DJobTask(data) {
  return request({
    url: "/pointCloud/jobTask",
    method: "post",
    data,
  });
}

// 3D质检列表
export function get3DCheckTask(data) {
  return request({
    url: "/pointCloud/checkTask",
    method: "post",
    data,
  });
}

// 3D标注待领取

export function get3DWaitJobTask(data) {
  return request({
    url: "/pointCloud/waitJobTask",
    method: "post",
    data,
  });
}

// 3D质检待领取

export function get3DWaitCheckTask(data) {
  return request({
    url: "/pointCloud/waitCheckTask",
    method: "post",
    data,
  });
}

// 领取质检任务

export function receiveCheck(data) {
  return request({
    url: "/pointCloud/receiveCheck",
    method: "post",
    data,
  });
}
// 领取标注任务
export function receiveJob(data) {
  return request({
    url: "/pointCloud/receiveJob",
    method: "post",
    data,
  });
}
// 完成标注
export function completeJob(data) {
  return request({
    url: "/pointCloud/completeJob",
    method: "post",
    data,
  });
}

// 完成质检
export function completeCheck(data) {
  return request({
    url: "/pointCloud/completeCheck",
    method: "post",
    data,
  });
}
// 关闭分组
export function closeGroup(data) {
  return request({
    url: "/pointCloud/closeGroup",
    method: "post",
    data,
  });
}

// 开启分组

export function openGroup(data) {
  return request({
    url: "/pointCloud/openGroup",
    method: "post",
    data,
  });
}
// 开始标注
export function startJob(data) {
  return request({
    url: "/pointCloud/startJob",
    method: "post",
    data,
  });
}

// 开始质检
export function startCheck(data) {
  return request({
    url: "/pointCloud/startCheck",
    method: "post",
    data,
  });
}
// 快速标注
export function quick3DJob(data) {
  return request({
    url: "/pointCloud/quickJob",
    method: "post",
    data,
  });
}
// 快速质检
export function quick3DCheck(data) {
  return request({
    url: "/pointCloud/quickCheck",
    method: "post",
    data,
  });
}

/**3D质检转移 */
export function checkTransfer3D(data) {
  return request({
    url: "/transfer/checkTransfer3D",
    method: "post",
    data,
  });
}
/**3D标注转移 */
export function JobTransfer3D(data) {
  return request({
    url: "/transfer/jobTransfer3D",
    method: "post",
    data,
  });
}

/**
 * 3d标注框提交
 * @param {*} list
 * @returns
 */
export function submitJob(data) {
  return request({
    url: "/pointCloud/saveGraphTags",
    method: "post",
    data,
  });
}

/**
 * 3d详情
 * @param {*} list
 * @returns
 */
export function getGroupItem(data) {
  return request({
    url: "/pointCloud/jobList",
    method: "post",
    data,
  });
}

/**
 * 3d详情获取当前job下的标注框
 * @param {*} list
 * @returns
 */
export function getCubesItem(data) {
  return request({
    url: "/pointCloud/jobItem",
    method: "post",
    data,
  });
}

/**
 * 3d详情获取当前job下的质检框删除
 * @param {*} list
 * @returns
 */
export function deleteCubeItem(data) {
  return request({
    url: "/pointCloud/delTag",
    method: "post",
    data,
  });
}

/**
 * 3d详情单帧无效
 * @param {*} list
 * @returns
 */
export function invalidJob(data) {
  return request({
    url: "/pointCloud/invalidJob",
    method: "post",
    data
  })
}
// 3D完成标注任务
export function completeJobItem(data) {
  return request({
    url: "/pointCloud/completeJobItem",
    method: "post",
    data
  })
}
// 所有帧无效
export function invalidGroup(data) {
  return request({
    url: "/pointCloud/invalidGroup",
    method: "post",
    data
  })
}

// 质检单帧驳回  通过
export function graphJobCheck(data) {
  return request({
    url: "/pointCloud/graphJobCheck",
    method: "post",
    data
  })
}