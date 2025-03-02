import request from "@/utils/request";
//项目详情
export function getJobContent(data) {
  return request({
    url: "voiceJob/item",
    method: "post",
    data,
  });
}
// 提交
export function saveVoiceParagraphs(data) {
  return request({
    url: "voiceJob/saveVoiceParagraphs",
    method: "post",
    data,
  });
}

// 下一条、快速质检

export function nextJob(data) {
  return request({
    url: "voiceJob/nextJob",
    method: "post",
    data,
  });
}
// 下一条、快速标注

export function nextCheck(data) {
  return request({
    url: "voiceJob/nextCheck",
    method: "post",
    data,
  });
}

// 作废
export function voiceCancel(data) {
  return request({
    url: "voiceJob/cancel",
    method: "post",
    data,
  });
}

// 提交
export function voiceSave(data) {
  return request({
    url: "voiceJob/saveVoiceParagraphs",
    method: "post",
    data,
  });
}

// 任务提交并继续
// export function submitVoiceJob(data) {
//   return request({
//     url: "voiceJob/submitVoiceJob",
//     method: "post",
//     data,
//   });
// }

// 通过/驳回
export function submitVoiceJob(data) {
  return request({
    url: "voiceJob/submitVoiceJob",
    method: "post",
    data,
  });
}

