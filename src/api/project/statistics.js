import request from "@/utils/request";

// 获取项目组人员列表
export function personnelStatistics(data) {
  return request({
    url: "/statistics/personnelStatistics",
    method: "post",
    data,
  });
}

// 图片数量框统计
export function dimensionBoxStatistics(data) {
  return request({
    url: "/statistics/dimensionBoxStatistics",
    method: "post",
    data,
  });
}

// 题目标注员统计
export function getAnnotationStatistics(data) {
  return request({
    url: "/statistics/getAnnotationStatistics",
    method: "post",
    data,
  });
}

// 题目质检员统计
export function getCheckStatistics(data) {
  return request({
    url: "/statistics/getCheckStatistics",
    method: "post",
    data,
  });
}


