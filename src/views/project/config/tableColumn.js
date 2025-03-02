export const checkersDataEdit = [
  {
    key: "nickName",
    label: "姓名",
    slot: "filter",
  },
  {
    key: "role",
    label: "角色",
  },
  {
    key: "phonenumber",
    label: "电话",
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
  // {
  //   key: 'checkNum',
  //   label: '已质检数量'
  // }
];

export const markersDataEdit = [
  {
    key: "nickName",
    label: "姓名",
    slot: "filter",
  },
  {
    key: "role",
    label: "角色",
  },
  {
    key: "phonenumber",
    label: "电话",
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
  // {
  //   key: 'markNum',
  //   label: '已标注数量'
  // },
  // {
  //   key: 'markTopicNum',
  //   label: '已标注小题'
  // }
];

export const filesDataEdit = [
  {
    key: "fileName",
    label: "文件名",
    width: 200,
  },
  {
    key: "fileId",
    label: "文件Id",
  },
  {
    key: "cTime",
    label: "创建时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];
export const checkersDataStatic = [
  {
    key: "nickName",
    label: "姓名",
    slot: "filter",
  },
  {
    key: "role",
    label: "角色",
  },
  {
    key: "phonenumber",
    label: "电话",
  },
];

export const markersDataStatic = [
  {
    key: "nickName",
    label: "姓名",
    slot: "filter",
  },
  {
    key: "role",
    label: "角色",
  },
  {
    key: "phonenumber",
    label: "电话",
  },
  // {
  //   key: 'markNum',
  //   label: '已标注数量'
  // },
  // {
  //   key: 'markTopicNum',
  //   label: '已标注小题'
  // }
];

export const filesDataStatic = [
  {
    key: "fileName",
    label: "文件名",
    width: 200,
  },
  {
    key: "fileId",
    label: "文件Id",
  },
  {
    key: "cTime",
    label: "创建时间",
    width: 200,
  },
];
export const tasksPDFDataConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    width: 200,
  },
  {
    key: "groupStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
    width: 200,
  },
  {
    key: "jobSum",
    label: "任务数量",
  },
  {
    key: "tags",
    label: "标签",
    slot: "filter",
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "submitTime",
    label: "标注时间",
    width: 200,
  },
  {
    key: "checkNickName",
    label: "质检员",
    slot: "filter",
  },
  {
    key: "checkTimeConsumingDesc",
    label: "质检时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasksVoiceDataConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    width: 200,
  },
  {
    key: "jobStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
    width: 200,
  },
  {
    key: "inspectedCount",
    label: "任务数量",
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "submitTime",
    label: "标注时间",
    width: 200,
  },
  {
    key: "checkNickName",
    label: "质检员",
    slot: "filter",
  },
  {
    key: "checkTime",
    label: "质检时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasksOCRDataConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    width: 200,
  },
  {
    key: "fileId",
    label: "缩略图",
    slot: "image",
    width: 300,
  },
  {
    key: "jobStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
    width: 200,
  },
  {
    key: "inspectedCount",
    label: "任务数量",
  },
  // {
  //   key: 'tags',
  //   label: '标签',
  //   slot: 'filter',
  // },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "submitTime",
    label: "标注时间",
    width: 200,
  },
  {
    key: "checkNickName",
    label: "质检员",
    slot: "filter",
  },
  {
    key: "checkTime",
    label: "质检时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasksOCRWaitJobConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    with: 200,
  },
  {
    key: "fileId",
    label: "缩略图",
    slot: "image",
    width: 300,
  },
  {
    key: "jobStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
  },
  {
    slot: "operate",
    label: "操作",
  },
];

export const tasksOCRWaitCheckConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    with: 200,
  },
  {
    key: "fileId",
    label: "缩略图",
    slot: "image",
    width: 300,
  },
  {
    key: "jobStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
  },
  {
    key: "inspectedCount",
    label: "任务数量",
    width: 100,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "submitTime",
    label: "标注时间",
    with: 200,
  },
  {
    slot: "operate",
    label: "操作",
  },
];

export const tasks2DDataConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    width: 200,
  },
  {
    key: "groupStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
    width: 200,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "jobTimeConsumingDesc",
    label: "标注时间",
    width: 200,
  },
  {
    key: "checkNickName",
    label: "质检员",
    slot: "filter",
  },
  {
    key: "checkTimeConsumingDesc",
    label: "质检时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 400,
  },
];

export const tasks2DWaitJobConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasks2DWaitCheckConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    isFilter: true,
    fixed: false,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "jobTimeConsumingDesc",
    label: "标注时间",
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasksPDFWaitJobConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];
export const tasksPDFWaitCheckConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    isFilter: true,
    fixed: false,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "jobTimeConsumingDesc",
    label: "标注时间",
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];
export const tasks3DWaitJobConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];

export const tasks3DWaitCheckConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    isFilter: true,
    fixed: false,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "jobTimeConsumingDesc",
    label: "标注时间",
  },
  {
    slot: "operate",
    label: "操作",
    width: 300,
  },
];
export const tasks3DDataConfig = [
  {
    key: "fileName",
    label: "文件名",
    slot: "filter",
    fixed: false,
    width: 200,
  },
  {
    key: "groupStatus",
    label: "任务状态",
    slot: "filter",
    filterType: "select",
    width: 200,
  },
  {
    key: "jobNickName",
    label: "标注员",
    slot: "filter",
    width: 200,
  },
  {
    key: "jobTimeConsumingDesc",
    label: "标注时间",
    width: 200,
  },
  {
    key: "checkNickName",
    label: "质检员",
    slot: "filter",
  },
  {
    key: "checkTimeConsumingDesc",
    label: "质检时间",
    width: 200,
  },
  {
    slot: "operate",
    label: "操作",
    width: 400,
  },
];
