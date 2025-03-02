import request from "@/utils/request";

export function page(data) {
  return request({
    url: "/imgJobCheck/page",
    method: "post",
    data: data,
  });
}

export function imgDetail(data) {
  return request({
    url: "/imgJobCheck/item",
    method: "post",
    data: data,
  });
}

export function saveJob(data) {
  return request({
    url: "imgJobCheck/checkUpdateJob",
    method: "post",
    data,
  });
}

export function submitJob(data) {
  return request({
    url: "imgJobCheck/passJob",
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

export function imgTagsCheck(data) {
  return request({
    url: "imgTags/check",
    method: "post",
    data,
  });
}
