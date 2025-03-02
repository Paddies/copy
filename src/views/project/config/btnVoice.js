/**
 * 字典库：jobStatus
 *  -1、作废 0、待开始 1、标注中 2、待检验  4、已通过 5、检验中 9、已驳回
 */

// 标注任务
export const JobVoiceBtn = [
  {
    text: "标注转移",
    command: "transferJob",
    permission: ["transfer:job:voice"],
    svgIcon: "el-icon-bottom-left",
    status: ["1", "9"],
  },
];

// 质检任务
export const CheckVoiceBtn = [
  {
    text: "质检转移",
    command: "transferCheck",
    permission: ["transfer:check:voice"],
    svgIcon: "el-icon-bottom-left",
    status: ["5"],
  },
];
