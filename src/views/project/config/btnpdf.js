/**
 * 字典库：group_status
 * 0、任务待领取 1、标注中 2、标注完成待质检 3、质检完成待关闭 4、任务已关闭 5、无效任务 6、分组已驳回 7、质检中
 */

// 标注任务显示按钮：任务清单、标注完成、无效分组、开启分组、释放、标注转移

/**
 * 开启分组：目前只有标注任务有接口  缺质检任务的接口和权限指令
 * 无效分组：目前只有标注任务有接口  缺质检任务的接口和权限指令
 */

export const jobPerBtn = [
  {
    text: "参数配置",
    command: "queryParamsJob",
    permission: ["group:param"],
    svgIcon: "el-icon-s-help",
    status: ["3", "1", "0"],
  },
  {
    text: "完成标注",
    command: "completeJob",
    permission: ["pdf:job:completeJob"],
    svgIcon: "el-icon-folder-checked",
    status: ["1", "6"],
  },
  // {
  //   text: "任务清单",
  //   command: "jobTaskList",
  //   permission: ["group:getJob"],
  //   svgIcon: "el-icon-notebook-1",
  //   status: ["0", "1", "2", "3", "4", "5", "6", "7"],
  // },

  {
    text: "开启分组",
    command: "openGroup",
    permission: ["pdf:job:openGroup"],
    svgIcon: "el-icon-folder-opened",
    status: ["5"],
  },

  {
    text: "释放",
    command: "openJob",
    permission: ["pdf:job:release"],
    svgIcon: "el-icon-folder-checked",
    status: ["1", "6"],
  },
  {
    text: "无效分组",
    command: "discardJob",
    permission: ["pdf:job:invalidJob"],
    svgIcon: "el-icon-folder-delete",
    status: ["1"],
  },
  {
    text: "标注转移",
    command: "transferJob",
    permission: ["transfer:job:pdf"],
    svgIcon: "el-icon-bottom-left",
    status: ["1", "6"],
  },
];
// 教辅质检任务按钮显示：任务清单、质检完成、无效分组、关闭分组、质检转移
export const checkPerBtn = [
  {
    text: "参数配置",
    command: "queryParamsCheck",
    permission: ["pdf:job:config"],
    svgIcon: "el-icon-s-help",
    status: ["7", "3", "2", "4"],
  },
  // {
  //   text: "任务清单",
  //   command: "checkTaskList",
  //   permission: ["pdf:job:jobList"],
  //   svgIcon: "el-icon-notebook-1",
  //   status: ["0", "1", "2", "3", "4", "5", "6", "7"],
  // },

  {
    text: "完成质检",
    command: "completeCheck",
    permission: ["pdf:job:completeCheck"],
    svgIcon: "el-icon-folder-checked",
    status: ["7", "2"],
  },
  {
    text: "开启分组",
    command: "openCheckGroup",
    permission: ["pdf:check:openGroup"],
    svgIcon: "el-icon-folder-opened",
    status: ["4"],
  },
  {
    text: "关闭分组",
    command: "closeCheckGroup",
    permission: ["pdf:job:closeGroup"],
    svgIcon: "el-icon-folder",
    status: ["3"],
  },
  {
    text: "无效分组",
    command: "discardJob",
    permission: ["pdf:job:invalidJob"],
    svgIcon: "el-icon-folder-delete",
    status: ["7"],
  },
  {
    text: "质检转移",
    command: "transferCheck",
    permission: ["transfer:check:pdf"],
    svgIcon: "el-icon-bottom-left",
    status: ["7"],
  },
];
// / 教辅质检待领取任务：领取任务
export const waitCheckPDFBtn = [
  {
    text: "领取任务",
    command: "receiveCheck",
    permission: ["pdf:job:receiveCheck"],
    svgIcon: "el-icon-document-add",
    status: ["2"],
  },
];
// 教辅标注待领取任务：领取任务
export const waitJobPDFBtn = [
  {
    text: "领取任务",
    command: "receiveJob",
    permission: ["pdf:job:receiveJob"],
    svgIcon: "el-icon-document-add",
    status: ["0"],
  },
];
