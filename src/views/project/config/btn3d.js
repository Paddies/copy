/**
 * 字典库：group_status
 * 0、任务待领取 1、标注中 2、标注完成待质检 3、质检完成待关闭 4、任务已关闭 5、无效任务 6、分组已驳回 7、质检中
 */
/**
 * 
领取标注分组任务 当分组状态为任务待领取（0）时可点击按钮
领取质检分组任务 当分组状态为标注完成待质检（2）时可点击按钮
完成标注 当分组状态为标注中（1）时可点击按钮 且分组下的任务无标注中和待开始的任务
完成质检 当分组状态为质检中（7）时可点击按钮 且分组下的任务无质检中和待检验的任务
关闭分组 当分组状态为质检完成待关闭（3）时可点击按钮
开启分组 当分组状态为任务已关闭（4）时可点击按钮
 */

// 3D标注任务按钮显示：开始标注\完成标注
export const Job3DPerBtn = [
    {
      text: "开始标注",
      command: "startJob",
      permission: ["point:cloud:startJob"],
      svgIcon: "el-icon-edit-outline",
      status: ["1", "6"],
    },
    {
      text: "完成标注",
      command: "completeJob",
      permission: ["point:cloud:completeJob"],
      svgIcon: "el-icon-folder-checked",
      status: ["1"],
    },
    {
      text: "标注转移",
      command: "transferJob",
      permission: ["transfer:job:3D"],
      svgIcon: "el-icon-bottom-left",
      status: ["1", "6"],
    },
  ];
  
  // 3D质检任务按钮显示：开始质检\完成质检\关闭任务\开启任务
  export const Check3DPerBtn = [
    {
      text: "开始质检",
      command: "startCheck",
      permission: ["point:cloud:startCheck"],
      svgIcon: "el-icon-edit-outline",
      status: ["7"],
    },
    {
      text: "完成质检",
      command: "completeCheck",
      permission: ["point:cloud:completeCheck"],
      svgIcon: "el-icon-folder-checked",
      status: ["7"],
    },
    {
      text: "关闭分组",
      command: "closeGroup",
      permission: ["point:cloud:closeGroup"],
      svgIcon: "el-icon-folder",
      status: ["3"],
    },
    {
      text: "开启分组",
      command: "openGroup",
      permission: ["point:cloud:openGroup"],
      svgIcon: "el-icon-folder-opened",
      status: ["4"],
    },
    {
      text: "质检转移",
      command: "transferCheck",
      permission: ["transfer:check:3D"],
      svgIcon: "el-icon-bottom-left",
      status: ["7"],
    },
  ];
  
  // 3D质检待领取任务：领取任务
  export const waitCheck3DBtn = [
    {
      text: "领取任务",
      command: "receiveCheck",
      permission: ["point:cloud:receiveCheck"],
      svgIcon: "el-icon-document-add",
      status: ["2"],
    },
  ];
  
  // 3D标注待领取任务：领取任务
  export const waitJob3DBtn = [
    {
      text: "领取任务",
      command: "receiveJob",
      permission: ["point:cloud:receiveJob"],
      svgIcon: "el-icon-document-add",
      status: ["0"],
    },
  ];
  