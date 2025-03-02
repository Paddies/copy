import request from "@/utils/request";

/** 获取 项目配置 */
export function getProjectConfig(data) {
  return request({
    url: "/proJect/getProjectConfig",
    method: "post",
    data: data,
  });
}

export function page(data) {
  return request({
    url: "/proJect/page",
    method: "post",
    data: data,
  });
}

export function add(data) {
  return request({
    url: "/proJect/add",
    method: "post",
    data: data,
  });
}

export function update(data) {
  return request({
    url: "/proJect/update",
    method: "post",
    data: data,
  });
}

export function detail(data) {
  return request({
    url: "/proJect/item",
    method: "post",
    data,
  });
}

export function del(data) {
  return request({
    url: "/proJect/del",
    method: "post",
    data: data,
  });
}

export function delJob(data) {
  return request({
    url: "/proJect/delJob",
    method: "post",
    data: data,
  });
}

export function delCheck(data) {
  return request({
    url: "/proJect/delCheck",
    method: "post",
    data: data,
  });
}

export function addJobUser(data) {
  return request({
    url: "/proJect/addJobUser",
    method: "post",
    data: data,
  });
}

export function addCheckUser(data) {
  return request({
    url: "/proJect/addCheckUser",
    method: "post",
    data: data,
  });
}

export function getCheckUser(data) {
  return request({
    url: "/proJect/getCheckUser",
    method: "post",
    data: data,
  });
}

export function getJobUser(data) {
  return request({
    url: "/proJect/getJobUser",
    method: "post",
    data: data,
  });
}

// 项目详情-查询所有质检员
export function getProjectChekers(data) {
  return request({
    url: "/pCheckUser/page",
    method: "post",
    data,
  });
}

// 项目详情-查询所有标注员
export function getProjectMarkers(data) {
  return request({
    url: "/pJobUser/page",
    method: "post",
    data,
  });
}
// 项目详情-添加质检员
export function addProjectCheckers(data) {
  return request({
    url: "/pCheckUser/addCheckUser",
    method: "post",
    data,
  });
}
// 项目详情-删除质检员
export function delProjectCheckers(data) {
  return request({
    url: "/pCheckUser/del",
    method: "post",
    data,
  });
}
// 项目详情-删除标注员
export function delProjectMarkers(data) {
  return request({
    url: "/pJobUser/del",
    method: "post",
    data,
  });
}
// 项目详情-新增标注员
export function addProjectMarkers(data) {
  return request({
    url: "pJobUser/addJobUser",
    method: "post",
    data,
  });
}
// 项目详情-查询所有文件
export function getProjectFiles(data) {
  return request({
    url: "/pFile/page",
    method: "post",
    data,
  });
}

// 项目详情-删除项目文件列表文件
export function addProjectFile(data) {
  return request({
    url: "pFile/addFile",
    method: "post",
    data,
  });
}

// 项目详情-删除项目文件列表文件
export function delProjectFile(data) {
  return request({
    url: "/pFile/del",
    method: "post",
    data,
  });
}

// 项目详情-查询所有用户
export function getUserRoleList(data) {
  return request({
    url: "/proJect/getUserRoleList",
    method: "post",
    data,
  });
}
// 获取项目组人员列表
export function personnelStatistics(data) {
  return request({
    url: "/proJect/personnelStatistics",
    method: "post",
    data,
  });
}

export function pdfpage(data) {
  return request({
    url: "/pdf/page",
    method: "post",
    data: data,
  });
}

// 生成PDF任务
export function createPDFTask(data) {
  return request({
    url: "proJect/addJobPdfProject",
    method: "post",
    data,
  });
}

// 生成OCR任务
export function createImgTask(data) {
  return request({
    url: "proJect/addJobImgProject",
    method: "post",
    data,
  });
}
// 生成语音任务
export function createvoiceTask(data) {
  return request({
    url: "proJect/addJobVoiceProject",
    method: "post",
    data,
  });
}
// 生成2D任务
export function create2DTask(data) {
  return request({
    url: "proJect/addJob2DProject",
    method: "post",
    data,
  });
}
// 生成3D任务
export function create3DTask(data) {
  return request({
    url: "proJect/addJob3DProject",
    method: "post",
    data,
  });
}

// 快速标注
export function getQuickJob(data) {
  return request({
    url: "/group/quickJob",
    method: "post",
    data,
  });
}

// 快速质检
export function getQuickCheck(data) {
  return request({
    url: "/group/quickCheck",
    method: "post",
    data,
  });
}

// 快速OCR标注
export function getOcrJob(data) {
  return request({
    url: "/imgJob/check",
    method: "post",
    data,
  });
}

// 快速OCR质检
export function getOcrCheck(data) {
  return request({
    url: "/imgJobCheck/check",
    method: "post",
    data,
  });
}

// 完成标注
export function getRoleUser(data) {
  return request({
    url: "/proJect/getUser4RoleList",
    method: "post",
    data,
  });
}

export function completeMark(data) {
  return request({
    url: "/jobContent/finish",
    method: "post",
    data,
  });
}

// OCR标注数量
export function dimensionBoxStatistics(data) {
  return request({
    url: "proJect/dimensionBoxStatistics ",
    method: "post",
    data,
  });
}

export function reStartCheck(data) {
  return request({
    url: "/jobContent/reStartCheck",
    method: "post",
    data,
  });
}

// 查询PDF项目
export function getPDFProjects(data) {
  return request({
    url: "/proJect/pdfPage",
    method: "post",
    data,
  });
}

// 查询OCR项目
export function getOCRProjects(data) {
  return request({
    url: "/proJect/ocrPage",
    method: "post",
    data,
  });
}

// 语音标注任务列表
export function getVoiceProjects(data) {
  return request({
    url: "/voiceJob/page",
    method: "post",
    data,
  });
}

// 语音标注任务列表
export function getVoiceJobTask(data) {
  return request({
    url: "/voiceJob/jobTask",
    method: "post",
    data,
  });
}

// 语音质检任务列表
export function getVoiceCheckTask(data) {
  return request({
    url: "/voiceJob/checkTask",
    method: "post",
    data,
  });
}

// PDF标注任务列表
export function getPdfJobTask(data) {
  return request({
    url: "group/jobTask",
    method: "post",
    data,
  });
}

// PDF质检任务列表
export function getPdfCheckTask(data) {
  return request({
    url: "/group/checkTask",
    method: "post",
    data,
  });
}

// OCR标注任务列表
export function getOcrJobTask(data) {
  return request({
    url: "imgJob/jobTask",
    method: "post",
    data,
  });
}

// OCR质检任务列表
export function getOcrCheckTask(data) {
  return request({
    url: "imgJobCheck/checkTask",
    method: "post",
    data,
  });
}

// 获取所有的项目经理
export function getPMlist(data) {
  return request({
    url: "proJect/getPM",
    method: "post",
    data,
  });
}
/** PDF标注分组任务待领取列表 */
export function getPDFWaitJobTask(data) {
  return request({
    url: "group/waitJobTask",
    method: "post",
    data,
  });
}
/**PDF质检待领取分组任务列表 */
export function getPDFWaitCheckTask(data) {
  return request({
    url: "group/waitCheckTask",
    method: "post",
    data,
  });
}
//关闭项目
export function getCloseProject(data) {
  return request({
    url: "proJect/closeProject",
    method: "post",
    data,
  });
}
//还原项目
export function getOpenProject(data) {
  return request({
    url: "proJect/openProject",
    method: "post",
    data,
  });
}
