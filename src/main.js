import Vue from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

import Cookies from "js-cookie";
import { Shortcuts } from "shortcuts";
import md5 from "js-md5";
import Element from "element-ui";
import "./assets/styles/element-variables.scss";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive
import plugins from "./plugins"; // plugins
import { download } from "@/utils/request";
import dataV from "@jiaminghi/data-view";
Vue.use(dataV);

import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  addDateRangeBy,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  poidownload,
  handleDicts,
} from "@/utils/ruoyi";
import { checkPermi } from "@/utils/permission"; // 权限判断函数

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 富文本组件
import Editor from "@/components/Editor";
// 文件上传组件
import FileUpload from "@/components/FileUpload";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview";
// 字典标签组件
import DictTag from "@/components/DictTag";
// 头部标签组件
import VueMeta from "vue-meta";
// 字典数据组件
import DictData from "@/components/DictData";

export const bus = new Vue();

// 全局方法挂载
Vue.prototype.$message1 = function (msg) {
  this.$message({message: msg,duration:1000})
}

Vue.prototype.md5 = md5;
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.checkPermi = checkPermi;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.addDateRangeBy = addDateRangeBy;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.poidownload = poidownload;
Vue.prototype.handleDicts = handleDicts;
Vue.prototype.$shortcuts = new Shortcuts();
// 全局组件挂载
Vue.component("DictTag", DictTag);
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("Editor", Editor);
Vue.component("FileUpload", FileUpload);
Vue.component("ImageUpload", ImageUpload);
Vue.component("ImagePreview", ImagePreview);

Vue.use(directive);
Vue.use(plugins);
Vue.use(VueMeta);

DictData.install();

// 自定义全局指令，渲染数学公式
Vue.directive("katex", {
  bind(el, binding) {
    el.innerHTML = katex.renderToString(binding.value, {
      throwOnError: false,
    });
  },
});

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
