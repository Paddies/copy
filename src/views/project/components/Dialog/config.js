// 表单默认
export const baseConfig = {
  // 标注模式
  job_mode: "1",
  // 是否继承
  job_extends: "1",
  // 继承内容
  extends_content: ["1"],
  // 自动保存
  auto_save: "1",
  // 教辅参数配置
  pdf_config: ["pubYear", "subject", "language"],
  // 教辅默认选项
  mark_title_type: "selection",
};

// 工具默认
export const baseTools = ["rect", "polygon", "polyline"];
export const tables2D = [
  {
    tool: "rect",
    shortcutKeys: "1",
    toolColour: "#f53f3f",
    toolCategory: "0",
    toolAttribute: ["cut_level", "graph_cover", "identify_level"],
  },
  {
    tool: "polygon",
    shortcutKeys: "2",
    toolColour: "#7eb712",
    toolCategory: "2",
    toolAttribute: ["cut_level", "graph_cover", "identify_level"],
  },
  {
    tool: "polyline",
    shortcutKeys: "3",
    toolColour: "#722ed1",
    toolCategory: "7",
    toolAttribute: ["cut_level", "graph_cover", "identify_level"],
  },
];
export const tablsOCR = [
  {
    tool: "rect",
    shortcutKeys: "1",
    toolColour: "#0DFFF0",
    toolTag: "print",
  },
  {
    tool: "rect",
    shortcutKeys: "2",
    toolColour: "#3382FF",
    toolTag: "print_fromula",
  },
  {
    tool: "rect",
    shortcutKeys: "3",
    toolColour: "#0DFFF0",
    toolTag: "mnistmnist_formula",
  },
  {
    tool: "rect",
    shortcutKeys: "4",
    toolColour: "#5FFF37",
    toolTag: "mnist",
  },
  {
    tool: "polygon",
    shortcutKeys: "5",
    toolColour: "#0DFFF0",
    toolTag: "print",
  },
  {
    tool: "polygon",
    shortcutKeys: "6",
    toolColour: "#3382FF",
    toolTag: "print_fromula",
  },
  {
    tool: "polygon",
    shortcutKeys: "7",
    toolColour: "#0DFFF0",
    toolTag: "mnistmnist_formula",
  },
  {
    tool: "polygon",
    shortcutKeys: "8",
    toolColour: "#5FFF37",
    toolTag: "mnist",
  },
  {
    tool: "polyline",
    shortcutKeys: "9",
    toolColour: "#0DFFF0",
    toolTag: "print",
  },
];
export const tables3D = [
  {
    tool: "threeTools",
    shortcutKeys: "1",
    toolColour: "#f53f3f",
    toolCategory: "0",
    toolAttribute: ["cut_level", "graph_cover", "identify_level"],
  },
];
