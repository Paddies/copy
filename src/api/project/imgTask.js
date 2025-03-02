import request from "@/utils/request";
export function page(data) {
  return request({
    url: "/imgJob/page",
    method: "post",
    data: data,
  });
}

export function getOCRJobDetail(data) {
  return request({
    url: "/imgJob/item",
    method: "post",
    data: data,
  });
}

export function saveJob(data) {
  return request({
    url: "imgJob/saveJob",
    method: "post",
    data,
  });
}

export function submitJob(data) {
  return request({
    url: "imgJob/submitJob",
    method: "post",
    data,
  });
}

export function submitTag(data) {
  return request({
    url: "imgJob/updateTags",
    method: "post",
    data,
  });
}

export function voidJob(data) {
  return request({
    url: "imgJob/cancel",
    method: "post",
    data,
  });
}

export function ocrJobTransfer(data) {
  return request({
    url: "transfer/ocrJobTransfer",
    method: "post",
    data,
  });
}

export function pdfJobTransfer(data) {
  return request({
    url: "transfer/pdfJobTransfer",
    method: "post",
    data,
  });
}
export function voiceJobTransfer(data) {
  return request({
    url: "transfer/voiceJobTransfer",
    method: "post",
    data,
  });
}
export function voiceCheckTransfer(data) {
  return request({
    url: "transfer/voiceCheckTransfer",
    method: "post",
    data,
  });
}

export function pdfCheckTransfer(data) {
  return request({
    url: "transfer/pdfCheckTransfer",
    method: "post",
    data,
  });
}

export function ocrCheckTransfer(data) {
  return request({
    url: "transfer/ocrCheckTransfer",
    method: "post",
    data,
  });
}
/** 转移日志 */
export function getJobTransferRecord(data) {
  return request({
    url: "transfer/page",
    method: "post",
    data,
  });
}

// submitJobNoNext 保存并下一题
export function submitJobNoNext(data) {
  return request({
    url: "imgJob/submitJobNoNext",
    method: "post",
    data,
  });
}

// OCR标注待领取
export function getOCRWaitJobTask(data) {
  return request({
    url: "imgJob/waitJobTask",
    method: "post",
    data,
  });
}

// OCR质检待领取
export function getOCRWaitCheckTask(data) {
  return request({
    url: "imgJob/waitCheckTask",
    method: "post",
    data,
  });
}

// OCR标注领取
export function receiveOCRTask(data) {
  return request({
    url: "imgJob/receiveJob",
    method: "post",
    data,
  });
}

// OCR质检领取
export function receiveOCRCheck(data) {
  return request({
    url: "imgJob/receiveCheck",
    method: "post",
    data,
  });
}
