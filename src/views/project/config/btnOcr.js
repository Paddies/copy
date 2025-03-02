/**
 * 字典库：jobStatus
 * -1、作废 0、待开始 1、标注中 2、待检验  4、已通过 5、检验中 9、已驳回
 *
 * ocr 完成标注 缺少权限 和接口
 * ocr 完成质检 缺少权限 和接口
 */

// 标注任务
export const JobOCRBtn = [
  {
    text: "标注转移",
    command: "transferJob",
    permission: ["transfer:job:ocr"],
    svgIcon: "el-icon-bottom-left",
    status: ["1", "9"],
  },
];

// 质检任务
export const CheckOCRBtn = [
  {
    text: "质检转移",
    command: "transferCheck",
    permission: ["transfer:check:ocr"],
    svgIcon: "el-icon-bottom-left",
    status: ["5"],
  },
];

// OCR质检待领取任务：领取任务
export const waitCheckOCRBtn = [
  {
    text: "领取质检任务",
    command: "receiveCheck",
    permission: ["ocr:job:receiveCheck"],
    svgIcon: "el-icon-document-add",
    status: ["2"],
  },
];
// OCR标注待领取任务：领取任务
export const waitJobOCRBtn = [
  {
    text: "领取标注任务",
    command: "receiveJob",
    permission: ["ocr:job:receiveJob"],
    svgIcon: "el-icon-document-add",
    status: ["0"],
  },
];
