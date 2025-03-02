import request from '@/utils/request'

export function getMyAchievement(data) {
  return request({
    url: '/staging/achievement',
    method: "post",
    data: data,
  });
}

export function getMyProduction(data) {
  return request({
    url: '/staging/capacity',
    method: "post",
    data: data,
  });
}

export function getMyTasks(data) {
  return request({
    url: '/staging/tasksInvolved',
    method: "post",
    data: data,
  });
}
