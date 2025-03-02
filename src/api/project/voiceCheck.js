import request from "@/utils/request";
// 通过 或者 驳回
export function voiceCheck(data) {
  return request({
    url: "voiceJob/check",
    method: "post",
    data,
  });
}
// 通过 或者 驳回
export function nextCheck(data) {
  return request({
    url: "voiceJob/nextCheck",
    method: "post",
    data,
  });
}
