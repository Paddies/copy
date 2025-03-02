import request from "@/utils/request";

/** 任务详情 */
export function get2DJobDetail(data) {
  return request({
    url: "/planeGraph/jobItem",
    method: "post",
    data
  });
}

/* 保存 */
export function saveGraph(data) {
  return request({
    url: "/planeGraph/saveGraphTags",
    method: "post",
    data
  });
}
/* 保存并继续 */
export function submitGraphTagsAndNext(data) {
  return request({
    url: "/planeGraph/submitGraphTagsAndNext",
    method: "post",
    data
  });
}

// 无效任务
export function invalidJob(data) {
  return request({
    url: "/planeGraph/invalidJob",
    method: "post",
    data
  });
}

// 通过驳回
export function graphCheck(data) {
  return request({
    url: "/planeGraph/graphJobCheck",
    method: "post",
    data
  });
}

// 标注框驳回
export function rejectTags(data) {
  return request({
    url: "/planeGraph/rejectTags",
    method: "post",
    data
  });
}

/** 任务列表 */
export function get2DjobList(data) {
  return request({
    url: "/planeGraph/jobList",
    method: "post",
    data,
  });
}

/** 2D标注分组任务列表 */
export function get2DJobTask(data) {
  return request({
    url: "/planeGraph/jobTask",
    method: "post",
    data,
  });
}

/** 2D质检分组任务列表 */
export function get2DCheckTask(data) {
  return request({
    url: "/planeGraph/checkTask",
    method: "post",
    data,
  });
}
/** 2D标注分组任务待领取列表 */
export function get2DWaitJobTask(data) {
  return request({
    url: "/planeGraph/waitJobTask",
    method: "post",
    data,
  });
}
/**2D质检待领取分组任务列表 */
export function get2DWaitCheckTask(data) {
  return request({
    url: "/planeGraph/waitCheckTask",
    method: "post",
    data,
  });
}
/**2D快速标注 */
export function quickJob(data) {
  return request({
    url: "/planeGraph/quickJob",
    method: "post",
    data,
  });
}
/**2D快速质检 */
export function quickCheck(data) {
  return request({
    url: "/planeGraph/quickCheck",
    method: "post",
    data,
  });
}
/**2D质检转移 */
export function checkTransfer2D(data) {
  return request({
    url: "/transfer/checkTransfer2D",
    method: "post",
    data,
  });
}
/**2D标注转移 */
export function JobTransfer2D(data) {
  return request({
    url: "/transfer/JobTransfer2D",
    method: "post",
    data,
  });
}

/**2D领取标注分组任务 */
export function receiveJob(data) {
  return request({
    url: "/planeGraph/receiveJob",
    method: "post",
    data,
  });
}
/**2D领取质检分组任务 */
export function receiveCheck(data) {
  return request({
    url: "/planeGraph/receiveCheck",
    method: "post",
    data,
  });
}
/**2D完成标注分组任务 */
export function completeJob(data) {
  return request({
    url: "/planeGraph/completeJob",
    method: "post",
    data,
  });
}
/**2D完成质检分组任务 */
export function completeCheck(data) {
  return request({
    url: "/planeGraph/completeCheck",
    method: "post",
    data,
  });
}
/**2D关闭分组任务 */
export function closeGroup(data) {
  return request({
    url: "/planeGraph/closeGroup",
    method: "post",
    data,
  });
}
/**2D开启分组任务 */

export function openGroup(data) {
  return request({
    url: "/planeGraph/openGroup",
    method: "post",
    data,
  });
}

/** 开始标注 */
export function startJob(data) {
  return request({
    url: "/planeGraph/startJob",
    method: "post",
    data,
  });
}
/** 开始质检 */
export function startCheck(data) {
  return request({
    url: "/planeGraph/startCheck",
    method: "post",
    data,
  });
}

/* 更改筛选状态 */
export function getJobStatus(data) {
  return request({
    url: "/planeGraph/getJobCount",
    method: "post",
    data
  });
}
//跳过
export function checkSkip(data) {
  return request({
    url: "/planeGraph/checkSkip",
    method: "post",
    data
  });
}
