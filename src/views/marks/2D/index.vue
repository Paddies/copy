<template>
  <div class="ivu-layout">
    <!-- 头部按钮区 -->
    <el-row class="ivu-layout-header">
      <mark-header ref="markheader" :job2d="detailData" :job_mode="job_mode" @toolsEvent="toolsEvent" @save="saveGraph"
        @saveAndNext="saveAndNextGraph" @changeStatus="changeStatus"></mark-header>
    </el-row>
    <!-- 标框内容区 -->
    <div style="height: calc(100vh - 64px)" class="ivu-layout-content">
      <!-- 左侧区域 -->
      <div class="left-bar tools">
        <Tools ref="toolsRef" :toolsConfigs="toolsConfigs" :activeObj="activeObj" @toolsEvent="setFrameType"
          @toolsProps="setToolsProps"></Tools>
      </div>
      <!-- 画布区域 -->
      <div class="mark draw_wrap">
        <!-- 画框区 -->
        <div  class="mark-main" ref="screensRef" id="screens" @wheel="handleWheel" @scroll="handleScroll">
          <div ref="containerRef" class="screen-container">
            <div id="fabric" :style="canvasStyle">
              <!-- 辅助线 -->
              <div id="ox" v-show="isShowLine"></div>
              <div id="oy" v-show="isShowLine"></div>
              <!-- 右击弹框 -->
              <!-- <div id="menu" class="menu-x" v-show="menuVisable" :style="menuPosition" @contextmenu.prevent="" ref="menu">
                <div>什么都不做</div>
                <div>什么都不做</div>
                <div>什么都不做</div>
                <div>什么都不做</div>
              </div> -->
            </div>
          </div>
          <!-- 小工具 -->
          <div class="posi_right">
            <draw-tools @drawEvents="handledrawEvents"></draw-tools>
          </div>
        </div>
        <!-- 按钮区 -->
        <bottom-handler :imgData="detailData" :rightStatus="showRight" :job_mode="job_mode" @eventTab="bottomHandlerTap"
          :objCheckList="objCheckList"></bottom-handler>

      </div>
      <!-- 右侧区域 -->
      <div class="right-bar" v-show="attrBarShow">
        <!-- 对象列表 -->
        <object-list v-show="showRight === 'objects'" :isCheck="false" ref="objListRef" :list="objList"
          :configData="configData" :currentView="objects" :show="showObjectList" @choose="chooseObject"
          @showDraw="handleShowDrawObj"></object-list>
        <!-- 热键 -->
        <HotKeys v-show="showRight === 'hotkey'" :codes="configs" :job_mode="job_mode"></HotKeys>
        <!-- 驳回列表 -->
        <object-list v-show="showRight === 'rejectList'" :isCheck="false" ref="objListCheckRef" :list="objCheckList"
          :configData="configData" @choose="chooseObject" :currentView="Overruled"></object-list>
        <!-- 驳回记录 -->
        <RejectLogs v-show="showRight === 'rejectRecord'" :list="jobCheckLogs"></RejectLogs>
      </div>
      <!-- 右侧关闭按钮 -->
      <div :class="`close-btn right-btn ${attrBarShow && 'right-btn-open'}`" @click="switchAttrBar"></div>

    </div>

    <!-- 作废理由弹框 -->
    <el-dialog :visible.sync="showNoMark" width="600px">
      <el-form :model="noMarkForm" :rules="noMarkRules" ref="noMarkForm" label-width="100px">
        <el-form-item label="作废理由：" prop="reason">
          <el-input v-model="noMarkForm.reason" type="textarea" placeholder="请输入作废理由" />
        </el-form-item>
        <el-form-item align="end">
          <el-button type="primary" @click="confirmNoMark">作废</el-button>
          <el-button @click="showNoMark = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 对象列表和驳回列表验证提示弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="600px" t title="系统提示">
      <div>
        <p v-if="objformList"> 对象列表中，第
          <strong>{{ objformList }}</strong>
          个对象属性尚未完善
        </p>
        <p v-if="rejectObjList"> 驳回列表中，第
          <strong>{{ rejectObjList }}</strong>
          个对象属性尚未完善
        </p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import hotkeys from 'hotkeys-js'

import { str2arr } from "@/utils/validate";
import { hexToRgba } from "@/utils/ruoyi"
import MarkHeader from "@/views/components/marktools/markheader";
import drawTools from "@/views/components/marktools/drawTools";
import ObjectList from "@/views/components/marktools/objectlist";
import Tools from "@/views/components/marktools/tools";
import BottomHandler from "@/views/components/marktools/bottomhandler";
import DemandList from "@/views/components/marktools/demandlist";
import HotKeys from "@/views/components/marktools/hotkeys";
import RejectLogs from "@/views/components/marktools/rejectLogs";
import AttributeOption from "@/views/components/marktools/attributeOption";
import draw from "./draw";
import SketchRule from "vue-sketch-ruler";
// 接口
import {
  get2DJobDetail,
  saveGraph,
  submitGraphTagsAndNext,
  invalidJob,
  completeJob,
  getJobStatus,
  quickJob,
  checkSkip
} from "@/api/project/2d";
export default {
  /*
   * 静态字典通过provide异步注入供子孙级组件使用
   * 获取属性相关字典，后期需要动态配置获取
   * graph_cover属性遮挡、graph_cut属性截断
   **/
  components: {
    SketchRule,
    drawTools,
    MarkHeader,
    ObjectList,
    Tools,
    BottomHandler,
    DemandList,
    HotKeys,
    RejectLogs,
    AttributeOption,
  },
  data() {
    return {
      jobCheckLogs: [],
      // 属性快捷键
      initDicts: ["project_attribute", "project_tools", "t_job_type", "tool_attribute", 'ocr_reject_reason'],
      md5: null,
      job_mode: '',   // 标注模式：'1' ： 系统派题  '2': 手动派题
      // 是否继承
      iSinherit: false,
      rectWidth: 960,
      rectHeight: 720,
      scale: 1, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [],
        v: [],
      },
      thick: 20,
      width: 500,
      height: 400,
      lang: "zh-CN", // 中英文
      isShowRuler: true, // 显示标尺
      isShowReferLine: false, // 显示参考线

      groupStatus: null, // 当前分组状态
      jobStatus: "", // 当前任务状态
      jobNum: null,
      groupId: "",
      jobId: "",
      objformList: '',
      rejectObjList: '',
      type: 0,
      // destroyCanvas: false, // 销毁画布
      showObjectList: true,
      showDemandList: false,
      // 是否显示右侧属性框
      attrBarShow: true,
      showNoMark: false, // 作废理由弹框
      dialogFormVisible: false, // 列表验证弹框
      noMarkForm: {
        reason: "",
      },
      noMarkRules: {
        reason: [
          { required: true, message: "请输入作废理由", trigger: "blur" },
        ],
      },
      dynamicComponents: HotKeys, // 异步组件
      imgUrl: require("@/assets/images/11.png"),
      frame: null,
      ox: null,
      oy: null,
      showHelper: true, // 是否显示辅助线
      activeObj: {}, // 当前激活属性
      labelType: {
        value: "",
      },
      projectTags: [],
      projectTools: [],
      detailData: null,
      oldObjList: "", // 旧标注对象
      objList: [], // 所有标注对象
      isShowLine: true,
      objCheckList: [],//所有驳回对象
      currentDrawType: "select",
      activeAttribute: null, // 当前选中对象的属性
      shortkeys: [], // 快捷键实例
      showRight: "objects", // 是否展示快捷键列表
      currentPosAttribute: {}, // 当前对象移动的坐标
      shortLoading: false,
      menuVisable: false,
      proConfigData: {}, // 配置数据
      dictData: {}, // 所有字典的初始化
      configData: {}, // 所有字典的初始化
      configTools: [], // 该项目配置工具表
      toolsConfigs: [],
      keyCodesConfigs: [],
      configs: [],
      rejectTags: [],
      tags: [],
      objects: "objects",
      Overruled: "Overruled",
      toolsValue: 'helper',
      menuPosition: ''
    };
  },
  beforeRouteLeave(to, from, next) {
    // 清除可拖拽缓存
    sessionStorage.removeItem("enableDrager");
    next();
  },
  computed: {
    isSavePermision() {
      return (this.groupStatus === '1' || this.groupStatus === '6') && this.checkPermi(['graph:job:saveGraphTags', 'graph:job:submitNext'])
    },
    shadow() {
      return {
        x: 0,
        y: 0,
        width: this.rectWidth,
        height: this.rectHeight,
      };
    },
    canvasStyle() {
      return {
        positon: 'relative',
        width: this.rectWidth + "px",
        height: this.rectHeight + "px",
        transform: `scale(${this.scale})`,
      };
    },
    jobStatusOptions() {
      return this.$store.state.dicts.jobStatus;
    },
    detailParams() {
      return {
        jobId: this.jobId,
        jobStatus: this.jobStatus,
        jobNum: this.jobNum
      };
    },
    // 是否继承工具
    iSinheritTools() {
      let tool = this.configData?.extends_content || []
      return tool.some(item => item === '1') && this.iSinherit
    },
    // 是否继承属性
    iSinheritAttrs() {
      let attr = this.configData?.extends_content || []
      return attr.some(item => item === '2') && this.iSinherit
    },
    // 显示历史记录条数
    historyObj() {
      const { history, redoStack, undoStack } = draw.getHistory()
      return {
        history, redoStack, undoStack
      }
    }

  },
  watch: {
    // 是否继承
    iSinherit(val) {
      if (!val) {
        localStorage.removeItem('2dObj')
      }
    },
    // 继承工具
    iSinheritTools(val) {
      let obj = localStorage.getItem('2dObj')
      // console.log(JSON.stringify(obj));
      if (val && obj) {
        this.activeObj.figureName = obj.figureName
        this.activeObj.figureCode = obj.figureCode
      } else {
        this.activeObj.figureName = ''
        this.activeObj.figureCode = ''
      }
    },
    // 继承属性
    iSinheritAttrs(val) {
      let obj = localStorage.getItem('2dObj')
      if (val && obj) {
        this.activeObj.tagCode = obj.tagCode
        this.activeObj.tagName = obj.tagName
        this.activeObj.toolConfigId = obj.toolConfigId
      } else {
        this.activeObj.tagCode = ''
        this.activeObj.tagName = ''
        this.activeObj.toolConfigId = ''
      }
    },
    // 监听右边区域显隐，重新适应画布
    attrBarShow() {
      setTimeout(() => {
        this.resizeView()
      }, 500);
    }
  },

  destroyed() {
    this.$modal.closeLoading();
    hotkeys.unbind()
  },
  mounted() {
    let { id, groupStatus, proId, groupId } = this.$route.query;
  //async mounted() {
    this.jobId = id;
    this.groupId = groupId;
    this.groupStatus = groupStatus;


    // 防止缓存了以前的状态为拖拽模式
    sessionStorage.removeItem("enableDrager"); // 关闭拖拽

    // 先取缓存里面的标签
    let str = this.taskType === "job" ? "job_tag_type" : "check_tag_type";
    this.labelType.value = localStorage.getItem(str) || "";

    // 添加自定义监听事件
    this.handleListener();

    //  添加鼠标事件
    this.handleMouseEvent();


    // 辅助线默认显示
    this.drawLine();

    // 获取项目详情
    this.get2DJobDetail();

    let that = this;
    setTimeout(function () {
      // 绑定快捷键
      that.handlebindKey();
    }, 1000);
  },
  methods: {
    /**自动保存 */
    autosave() {
      const jobStatus = this.detailData.jobStatus;
      if (jobStatus === '1' && this.objList.length > 0) {
        this.intervalId = setInterval(() => {
          this.saveGraph(); // 调用 saveGraph 方法
        }, 30000);
      }
    },
    /** 初始化字典数据 */
    async handleDicts(dicts) {
      let obj = {};
      let arr = await Promise.all(
        dicts.map(async (item) => {
          return {
            key: item,
            options: await this.$store.dispatch("dicts/GET_DIC", { key: item }),
          };
        })
      );

      arr.forEach((k) => {
        obj[k.key] = k.options;
      });

      return obj;
    },
    // 自定义监听事件
    handleListener() {
      // 监听自定义事件 拉框新建对象
      document.addEventListener("createObject", async (event) => {
        console.log(event.detail);
        const objListItem = { ...event.detail, ...this.activeObj };
        console.log('新增的objListItem', objListItem, this.activeObj);
        this.activeObj.toolConfigId = objListItem.toolConfigId

        // 处理二级属性回显
        let textArr = this.dictData["project_attribute"];
        let remarks = textArr?.find((o) => o.dictValue === objListItem.tagCode)?.remark

        objListItem.secondDict = remarks || '';
        objListItem.secondList = remarks ? await this.$store.dispatch("dicts/GET_DIC", { key: remarks }) : []
        this.objList.push(objListItem);

        setTimeout(() => {
          if (this.$refs.objListRef) {
            // 对象列表展开最新的一条
            this.$refs.objListRef.active = this.objList.length - 1;
            this.$refs.objListRef.scrollToBottom();
          }
        }, 100);
      });

      // 监听自定义选中事件 获取当前选中的对象
      document.addEventListener("selectObject", async (event) => {
        await this.$nextTick();
        this.classId = event.detail?.classId;
        if (this.classId) {
          const _left = event.detail.left + event.detail.width;
          const _top = event.detail.top;
          this.activeAttribute = {
            x: _left + draw.canvas.viewportTransform[4],
            y: _top + draw.canvas.viewportTransform[5],
          };
          // 是否为驳回框标识
          let isReject = event.detail.isReject
          if (isReject) {
            this.showRight = 'rejectList'
            // 驳回列表选中
            const d = this.objCheckList.findIndex(
              (item) => item.classId === this.classId
            );
            if (this.$refs.objListCheckRef) this.$refs.objListCheckRef.active = d;
          } else {
            this.showRight = 'objects'
            // 对象列表选中
            const i = this.objList.findIndex(
              (item) => item.classId === this.classId
            );
            if (this.$refs.objListRef) this.$refs.objListRef.active = i;
          }



        }
      });
      // 监听自定义移动、缩放对象，主要是位置坐标的变化
      document.addEventListener("externalTransformChanged", (event) => {
        let { id, data } = event;
        this.currentPosAttribute.coordinates = data;
        this.currentPosAttribute.classId = id;
        this.$emit("tagValueChange", event.detail);
      });

      // 监听自定义事件删除
      document.addEventListener(
        "delObject",
        function (event) {
          console.log('多选删除', event);
          // 支持多选删除
          if (event.detail.length > 0) {
            this.objList = this.objList.filter(
              (item) => {
                if (event.detail.indexOf(item.classId) === -1) {
                  return item
                }
              }
            );
            this.objCheckList = this.objCheckList.filter(
              (item) => {
                if (event.detail.indexOf(item.classId) === -1) {
                  return item
                }
              }
            );
          }
        }.bind(this)
      );

      // 监听右击菜单
      document.addEventListener(
        "contextmenu",
        function (event) {
          console.log('showContextMenu', event.detail);
          this.showContextMenu(event.detail)
        }.bind(this)
      );
    },
    // 右键弹框显示
    showContextMenu() {

    },
    // 添加鼠标事件
    handleMouseEvent() {
      // 添加右键点击事件监听器
      var targetElement = document.getElementById("fabric"); // 替换为你的目标元素
      // targetElement.addEventListener(
      //   "contextmenu",
      //   function (e) {
      //     e.preventDefault(); // 阻止默认的浏览器上下文菜单
      //     this.showContextMenu(e); // 显示自定义菜单
      //   }.bind(this),
      //   false
      // );

      // 添加鼠标中键监听器
      targetElement.addEventListener("mousedown", function (e) {
        e.preventDefault();
        // console.log("mousedown", e.button);  // 0 左键按下 1中键按下
        if (e.button === 1) {
          draw.isMiddleMouse = true;
        } else if (e.button === 0) {
          draw.isDragging = true;
        }
      });
      // 添加鼠标左键监听器
      targetElement.addEventListener("mouseup", function (e) {
        e.preventDefault();
        draw.isMiddleMouse = false;
        draw.isCtrl = false;
      });
    },
    // 监听窗口变化
    resizeView() {

      const _targetElement = document.querySelector(".mark-main");
      if (_targetElement) {
        let width = _targetElement.getBoundingClientRect().width;
        let height = _targetElement.getBoundingClientRect().height;
        var targetElement = document.getElementById("fabric"); // 替换为你的目标元素
        targetElement.style.width = width - 12 + "px";
        targetElement.style.height = height + "px";
        draw.resizeCanvas(width, height);
      }
    },
    handlebindKey() {
      let that = this
      hotkeys('x,z,d,q,Space,Escape,ctrl+s,ctrl+shift+s,shift+a', { keydown: true }, function (event, handler) {
        event.preventDefault()
        console.log(event, handler);

        switch (handler.key) {
          case 'z':
            if (that.detailData.upJobId === "-1") {
              return false;
            }
            if (!that.shortLoading) {
              that.bottomHandlerTap({ type: "prev" });
            }
            break;
          case 'x':
            if (that.detailData.nextJobId === "-1") {
              return false;
            }
            if (!that.shortLoading) {
              that.bottomHandlerTap({ type: "next" });
            }
            break;
          case 'd':
            draw.handleDelete();
            break;
          case 'q':
            if (that.$refs.toolsRef) {
              that.$refs.toolsRef.eventChange('select')
              that.isShowLine = false
            }
            break;
          case 'Space':
            draw.handleFinishDraw();
            break;
          case 'Escape':
            draw.handleCancleDraw();
            break;
          // 保存
          case 'ctrl+s':
            // 权限验证
            if (!that.isSavePermision) return
            that.saveGraph();
            break;
          // 保存并继续
          case 'ctrl+shift+s':
            if (!that.isSavePermision) return
            that.saveAndNextGraph();
            break;
          default:
        }


      });

      // 设置工具选择的快捷键
      this.setToolsKeyCodes();

    },
    // 工具选择快捷键添加
    setToolsKeyCodes() {
      this.activeObj = {};
      let that = this
      this.keyCodesConfigs.forEach(item => {
        hotkeys(item.keyCode, { keydown: true }, function (event, handler) {
          that.isShowLine = true
          that.setToolsProps(item)
          event.preventDefault()
        });
      })
    },

    // 属性选择快捷键添加
    setAttrsKeyCodes(data) {
      let arr = data.attrs.map((item) => {
        return {
          shortcut: item.code,
          handler: (event) => {
            // 确定当前需要传递的数据
            let { tagCode, text, color } = item;
            let obj = {
              figureName: data.label,
              figureCode: data.value,
              tagCode: tagCode,
              tagName: text,
              color: color,
            };
            this.setToolsProps(obj);
            // 子组件回显

            this.$refs.toolsRef.propsChange(obj);
            // 关闭弹框
            this.$refs.toolsRef.close();
            return true;
          },
        };
      });

      this.$shortcuts.add(arr);
    },

    /** 清空画布和数据 */
    resetCanvas() {
      this.objList = [];
      this.objCheckList = [];
      if (draw && draw.canvas) {
        // this.$refs.toolsRef.resetStatus()
        draw.coordinates = {};
        draw.canvas.clear();
        draw.canvas.remove(draw.canvas.getActiveObject());
        draw.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        draw.canvas.dispose(); // 销毁画布
        draw.canvas = null;
      }
    },
    // 任务详情
    get2DJobDetail() {
      this.shortLoading = true;
      this.$modal.loading("图片加载中...");
      // let params = {
      //   jobId: this.jobId,
      //   jobStatus: this.jobStatus,
      //   jobNum: this.jobNum,
      //   groupId: this.groupId
      // }
      let groupId = this.groupId


      console.log('请求参数', { ...this.detailParams, groupId: this.groupId });
      get2DJobDetail({ ...this.detailParams, groupId })
        .then((response) => {
          if (response.code === 200) {
            this.resetCanvas();
            let { id, jobNum, groupId, configs, projectId,jobCheckLogs } = response.data;
            // this.jobId = id;
            this.jobNum = jobNum;

            this.detailData = response.data;
            this.jobCheckLogs = jobCheckLogs;

            // 配置信息
            this.configData = configs
            this.job_mode = configs?.job_mode[0];
            // 无继承，清除当前所有画布配置信息
            this.iSinherit = configs.job_extends && configs.job_extends[0] === '1'
            if (!this.iSinherit) {
              this.activeObj = {}
              draw.currentType = 'select';
              draw.strokeColor = 'red';
              this.currentDrawType = 'select'
            }
            this.configTools = configs.tools
            // 初始化配置项里面的字典
            let attrs = this.configData.tools?.map(item => item.toolAttribute)
            let dicts = [...new Set(attrs.reduce(function (a, b) { return a.concat(b) }))].filter(item => item !== '[]')
            Promise.all(
              [...this.initDicts, ...dicts].map(async (item) => {
                return {
                  key: item,
                  options: await this.$store.dispatch("dicts/GET_DIC", { key: item }),
                };
              })
            ).then(res => {
              let obj = {}
              res.forEach((k) => {
                obj[k.key] = k.options;
              });

              this.dictData = obj
              // 更新缓存信息
              this.$store.dispatch("localPro/UPDATE_PRO", {
                projectId,
                data: configs,
              });

              // 初始化画布
              let { tags, fileId, rejectTags } = response.data;
              this.initDrawCanvas(fileId, tags, rejectTags);

            })
            this.autosave();

          }
        })
        .finally(() => {
          this.shortLoading = false;
          this.$modal.closeLoading();
        });
    },
    // 初始化画布
    initDrawCanvas(fileId, tags, rejectTags) {
      // 初始化背景图
      this.imgUrl =
        process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
      const _field = document.querySelector(".mark-main");
      let _canvas = document.getElementById("fabric");
      _canvas.width = _field.clientWidth - 12;
      _canvas.height = _field.clientHeight;
      // 初始化标尺
      this.rectWidth = _canvas.width;
      this.rectHeight = _canvas.height;
      // this.initRules()
      // 初始化画布
      draw.init(
        "fabric",
        _canvas.width,
        _canvas.height,
        this.imgUrl,
        function (e) {
          // // 回显
          this.handleObjList(tags);
          this.handleObjectCheckList(rejectTags)
        }.bind(this)
      );
    },
    // 处理objList数据
    handleObjList(tags) {
      let tools = this.configData?.tools || [];
      let configTools = ['rect', 'polygon', 'polyline', 'keyPoints'];
      let textArr = this.dictData["project_attribute"];
      let textTool = this.dictData['project_tools']

      if (textArr) {
        let configs = tools.map((item, index) => {
          return {

            toolId: item.id,
            tooltoolConfigIdId: item.id,
            tools: item.tool,
            toolTxt: textTool?.find((o) => o.dictValue === item.tool)?.dictLabel,
            text: textArr?.find((o) => o.dictValue === item.toolCategory)?.dictLabel,
            tagCode: textArr?.find((o) => o.dictValue === item.toolCategory)?.dictValue,
            color: item.toolColour,
          };
        });
        this.configs = configs
      }
      // 处理左侧组件渲染数据
      let toolsProps = configTools.map(item => {
        let arr = tools.filter(o => o.tool === item)
        return {
          value: item,
          datas: arr.map(k => {

            return {
              toolConfigId: k.id,
              color: k.toolColour,
              figureCode: k.tool,
              figureName: textTool?.find((o) => o.dictValue === k.tool)?.dictLabel,
              tagName: textArr?.find((o) => o.dictValue === k.toolCategory)?.dictLabel,
              tagCode: k.toolCategory,
              keyCode: k.shortcutKeys
            };
          })
        }
      })
      // console.log(toolsProps);
      this.toolsConfigs = toolsProps
      console.log("配置画图参数====",toolsProps);

      // 处理快捷键数据渲染
      this.keyCodesConfigs = tools.map(k => {
        return {
          toolConfigId: k.id,
          color: k.toolColour,
          figureCode: k.tool,
          figureName: textTool?.find((o) => o.dictValue === k.tool)?.dictLabel,
          tagName: textArr?.find((o) => o.dictValue === k.toolCategory)?.dictLabel,
          remark: textArr?.find((o) => o.dictValue === k.toolCategory)?.remark,
          tagCode: k.toolCategory,
          keyCode: k.shortcutKeys
        };
      })

      draw.currentType = this.currentDrawType;
      if (tags) {

        tags.forEach(async (item) => {
          // 解构
          let { toolConfigId, categoryAttributes, secondaryCategory, topicNum,
            tagType, tagCover, tagCut, otherAttributes, identifyLevel, cutLevel, tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY } = item
          tagWidth = Number(tagWidth)
          tagHeight = Number(tagHeight)
          tagLeft = Number(tagLeft)
          tagTop = Number(tagTop)
          tagScaleX = Number(tagScaleX)
          tagScaleY = Number(tagScaleY)
          // 根据配置项获取属性名字和快捷键
          tools = this.keyCodesConfigs.find(k => k.toolConfigId === item.toolConfigId)
          // console.log('tools', tools);
        let toolTxts = this.dictData['project_tools']
        let textArr = this.dictData["project_attribute"];


       // tags.forEach((item) => {
          // 根据配置项获取属性名字和快捷键
           console.log(this.configs, item, this.dictData);
          let tools = this.configs.filter(k => k.tools === item.tagType)[0]
          console.log('tools', tools);
          let figureName = toolTxts?.find(o => o.dictValue === item.tagType)?.dictLabel
          let tagName = textArr?.find(o => o.dictValue === item.categoryAttributes)?.dictLabel

          const coordinates = str2arr(item.tagCoordinate);
          this.objList.push({
            secondaryCategory: secondaryCategory,
            isShowDraw: true, // 画布是否显示该框
            toolConfigId: toolConfigId,
            classId: topicNum,
            topicNum: topicNum,
            figureCode: tools?.figureCode,
            figureName: tools?.figureName,
            tagCode: categoryAttributes || "",// 属性code
            tagName: tools?.tagName, // 属性名字
            tagType: tagType,
            coordinates,
            color: tools?.color || "",
            tagCover: tagCover || "",
            tagCut: tagCut || "",
            otherAttributes: otherAttributes || "",
            identifyLevel: identifyLevel || "",
            cutLevel: cutLevel || "",
            secondDict: tools?.remark || '',
            secondList: tools?.remark ? await this.$store.dispatch("dicts/GET_DIC", { key: tools?.remark }) : [],
            tagWidth,
            tagHeight,
            tagLeft,
            tagTop,
            tagScaleX,
            tagScaleY,
          });
          // 接口获取的最初的objList
          this.oldObjList = JSON.stringify(this.objList);
          // 传值给对象的obj
          let objs = {
            points: coordinates,
            classId: item.topicNum,
            color: tools?.color,
            fillColor: '',
            isReject: false,
            tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY
          }
          if (item.tagType === "rect") {
            draw.createRectByPoints(objs);
          } else if (item.tagType === "polygon") {
            draw.createPolygonByPoints(objs);
          } else if (item.tagType === "polyline") {
            draw.createPolylineByPoints(objs);
          }
        });
      }
      this.$modal.closeLoading();
    },
    handleObjectCheckList(rejectTags) {
      if (rejectTags) {
        rejectTags.forEach(async (item) => {
          // 解构
          let { toolConfigId, categoryAttributes, secondaryCategory, topicNum,
            tagType, tagCover, tagCut, otherAttributes, identifyLevel, cutLevel, tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY } = item
          tagWidth = Number(tagWidth)
          tagHeight = Number(tagHeight)
          tagLeft = Number(tagLeft)
          tagTop = Number(tagTop)
          tagScaleX = Number(tagScaleX)
          tagScaleY = Number(tagScaleY)
          // 根据配置项获取属性名字和快捷键
          console.log(item.toolConfigId);
          let tools = this.keyCodesConfigs.find(k => k.toolConfigId === item.toolConfigId)
          // console.log('tools', tools);
          const coordinates = str2arr(item.tagCoordinate);

          this.objCheckList.push({
            ...item,
            secondaryCategory: secondaryCategory,
            isShowDraw: true, // 画布是否显示该框
            toolConfigId: toolConfigId,
            classId: topicNum,
            topicNum: topicNum,
            figureCode: tools?.figureCode,
            figureName: tools?.figureName,
            tagCode: categoryAttributes || "",// 属性code
            tagName: tools?.tagName, // 属性名字
            tagType: tagType,
            coordinates,
            color: tools?.color || "",
            tagCover: tagCover || "",
            tagCut: tagCut || "",
            otherAttributes: otherAttributes || "",
            identifyLevel: identifyLevel || "",
            cutLevel: cutLevel || "",
            secondDict: tools?.remark || '',
            secondList: tools?.remark ? await this.$store.dispatch("dicts/GET_DIC", { key: tools?.remark }) : [],
            tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY
          });

          let objs = {
            points: coordinates,
            classId: item.topicNum,
            color: tools?.color,
            fillColor: hexToRgba(tools.color, .5),
            isReject: true,
            tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY
          }


          if (item.tagType === "rect") {
            draw.createRectByPoints(objs);
          } else if (item.tagType === "polygon") {
            draw.createPolygonByPoints(objs);
          } else if (item.tagType === "polyline") {
            draw.createPolylineByPoints(objs);
          }
        });
      }
      this.$modal.closeLoading();
    },
    // 更改筛选状态
    changeStatus(statu) {
      this.$modal.loading("正在获取数据...");
      if (!statu) {
        this.jobStatus = "";
        this.jobNum = null;
        this.get2DJobDetail();
      } else {
        getJobStatus({
          groupId: this.detailData.groupId,
          jobStatus: statu,
        })
          .then((res) => {
            if (res.code === 200) {
              // jobCount
              this.jobStatus = statu;
              this.jobId = res.data.nextJobId;
              this.jobNum = "";
              this.get2DJobDetail();
            }
          })
          .catch((err) => {
            this.jobStatus = "";
            // this.jobNum = ''
            this.$refs.markheader.statu = "";
            this.get2DJobDetail();
          })
          .finally(() => {
            this.$modal.closeLoading();
          });
      }
    },
    // 一键清空
    deleteJob() {
      this.$confirm("此操作将一键清除画布上所有元素, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 清除画布元素
          draw.canvas.getObjects().forEach((item) => {
            draw.canvas.remove(item);
          });
          // 清除列表
          this.objList = [];
          this.objCheckList = []
        })
        .catch(() => { });
    },
    // 获取表单验证数据
    handleValite() {
      let valites = this.$refs.objListCheckRef.getFormReslut()
      let valite = this.$refs.objListRef.getFormReslut()
      this.rejectObjList = valites
      this.objformList = valite
      if (valite || valites) {
        this.dialogFormVisible = true
        return false
      } else {
        return true
      }
    },
    /** 处理保存的数据data */
    handleSaveData() {
      let drawObjs = draw.handleJson()
      const combinedArray = this.objList.concat(this.objCheckList);
      console.log(combinedArray);
      combinedArray.forEach(item => {
        let target = drawObjs.find(k => k.classId === item.classId)
        console.log(target);
        let { width, height, left, top, scaleX, scaleY } = target
        item.width = width
        item.height = height
        item.top = top
        item.left = left
        item.scaleX = scaleX
        item.scaleY = scaleY
      })

      return {
        _id: new Date().getTime(),
        jobId: this.detailData.id,
        tags: combinedArray.map((item, index) => {
          return {
            toolConfigId: item.toolConfigId,
            topicNum: index + 1,
            tagCoordinate: item.coordinates,
            tagType: item.figureCode,
            categoryAttributes: item.tagCode,
            tagCover: item.tagCover,
            tagCut: item.tagCut,
            identifyLevel: item.identifyLevel,
            cutLevel: item.cutLevel,
            otherAttributes: item.otherAttributes,
            secondaryCategory: item.secondaryCategory,
            tagLeft: item.left,
            tagTop: item.top,
            tagWidth: item.width,
            tagHeight: item.height,
            tagScaleX: item.scaleX,
            tagScaleY: item.scaleY,
          };
        }),
      };
    },
    // 保存
    saveGraph() {
      draw.currentType = 'select'
      const combinedArray = this.objList.concat(this.objCheckList);
      if (combinedArray.length === 0) {
        this.$message.warning('请先标注')
        return
      }
      // 验证表单数据
      if (this.handleValite()) {

        let data = this.handleSaveData()
        console.log(data);
        saveGraph(data)
          .then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              // this.jobNum=this.jobNum;
              // this.jobId = "";
              this.get2DJobDetail('');
            }
          })
          .finally(() => {
            this.$refs.markheader.loading = false
          });
      }


    },
    // 保存并继续
    saveAndNextGraph() {
      const combinedArray = this.objList.concat(this.objCheckList);
      if (combinedArray.length === 0) {
        this.$message.warning('请先标注')
        return
      }

      // 验证表单数据
      if (this.handleValite()) {

        let data = this.handleSaveData();
        submitGraphTagsAndNext(data)
          .then((res) => {
            if (res.code == 200) {

              let { nextJobId } = res.data

              if (nextJobId === '-1') {
                if (this.job_mode === '1') {
                  this.$confirm('本组任务已完成质检, 是否开始下一组任务标注?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // 调完成标注
                    completeJob({
                      groupId: this.detailData.groupId,
                      jobMode: this.job_mode,
                    }).then((res) => {
                      if (res.code === 200) {
                        this.$message.success("本组任务已完成标注");
                        let { nextJobId } = res.data
                        if (nextJobId === '-1') {
                          this.$router.back();
                        } else {
                          this.jobId = nextJobId;
                          this.groupId = '';
                          this.jobNum = '';
                          this.get2DJobDetail()
                        }
                      }
                    });
                  }).catch(() => {
                    this.get2DJobDetail()
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: "已是最后一题，请继续标注",
                  });
                }
              } else {
                this.jobId = nextJobId;
                this.jobNum = '';
                this.get2DJobDetail()
                this.showRight = 'objects'
              }
            }
          })
          .finally(() => {
            // this.$refs.markheader.loading = false
          });
      }
    },
    // 确认作废
    confirmNoMark() {
      this.$refs.noMarkForm.validate((valid) => {
        if (valid) {
          invalidJob({
            jobId: this.detailData.id,
            cancelDes: this.noMarkForm.reason,
            jobMode: this.job_mode,
          }).then((res) => {
            if (res.code === 200) {
              if (this.job_mode === '1') {
                let { nextJobId } = res.data
                if (nextJobId === '-1') {
                  this.showNoMark = false;
                  this.$message.success("作废成功，已是最后一题, 请完成标注");
                } else {
                  this.showNoMark = false;
                  this.$message.success("作废成功");
                  this.jobId = nextJobId;
                  this.jobNum = '';
                }
              } else {
                this.showNoMark = false;
                this.$message.success("作废成功");
              }

            }

            this.get2DJobDetail()
          });
          this.resetForm('noMarkForm')
        }
      });
    },
    // 底部按钮点击
    async bottomHandlerTap(e) {
      if (e.type === "self") {
        this.jobNum = e.jobNum;
        this.handleSelfSave();
      } else if (e.type === "start") {
        this.jobNum = 1;
        this.handleSelfSave();
      } else if (e.type === "end") {
        this.jobNum = this.detailData.maxNum;
        this.handleSelfSave();
      } else if (e.type === "prev") {
        if (this.job_mode === '2') {
          this.jobNum = this.detailData.upJobId;
          this.jobId = "";
          this.handleSelfSave();
        }
      } else if (e.type === "next") {
        if (this.job_mode === '2') {
          this.jobId = "";
          this.jobNum = this.detailData.nextJobId;
          this.handleSelfSave();
        }

      } else if (e.type === "nomark") {
        this.showNoMark = true;
      } else if (e.type === "markComplete") {
        this.markComplete();
      } else if (e.type === "hotkey") {
        // 热键说明
        this.attrBarShow = true;
        this.showRight = "hotkey";
      } else if (e.type === "objects") {
        // 对象列表
        this.attrBarShow = true;
        this.showRight = "objects";
      } else if (e.type === "rejectList") {
        // 驳回列表
        this.attrBarShow = true;
        this.showRight = "rejectList";
      } else if (e.type === 'rejectRecord') {
        // 驳回记录
        this.selectedArray = this.objList;
        this.showRight = 'rejectRecord'
        this.attrBarShow = true;
      }
    },
    // 自动保存
    handleSelfSave() {
      // if (this.shortLoading) {
      //   this.$modal.msgError("正在请求接口，请勿频繁操作");
      //   return
      // }

      if (!this.checkObjListChange() && this.shortLoading === false && this.objList.length > 0) {
        this.shortLoading = true;
        this.saveGraph();
      } else {
        this.jobId = ''
        this.get2DJobDetail()
      }
      // 清空弹出属性窗口
      this.activeAttribute = null;
      // if (this.$refs.objListRef) {
      //   this.$refs.objListRef.active = 0;
      // }

      draw.currentType = this.currentDrawType;
    },
    // 添加辅助线
    drawLine() {
      let drawBox = document.getElementById('fabric')
      this.ox = document.getElementById('ox')
      this.oy = document.getElementById('oy')
      // 鼠标移动
      drawBox.onmousemove = function (e) {

        // 优化位置获取不准确导致的bug
        const toolsDom = document.querySelector(".tools");
        const headerDom = document.querySelector(".header.el-row");
        var e = e || window.event;
        var x = e.clientX - toolsDom.clientWidth;
        var y = e.clientY - headerDom.clientHeight;
        this.ox.style.top = y + "px";
        this.oy.style.left = x + "px";
      }.bind(this);
      // 鼠标移入
      drawBox.onmouseover = function () {

        this.isShowLine = false
        console.log(this.toolsValue);
        if (this.toolsValue === 'helper') {
          this.isShowLine = true
        } else {
          this.isShowLine = false
        }

      }.bind(this);
      //鼠标移出事件
      drawBox.onmouseout = function () {
        this.isShowLine = false
      }.bind(this);
    },
    closeObjectList() {
      this.showObjectList = false;
    },
    toolsEvent(type) {
      if (type === "object") {
        this.showObjectList = !this.showObjectList;
      }
    },
    switchAttrBar() {
      this.attrBarShow = !this.attrBarShow

      draw._initResizeObserve()
    },
    hideLine(value) {
      this.toolsValue = value
      this.isShowLine = false
    },
    // 左侧工具栏点击事件
    async setFrameType(action) {
      this.toolsValue = action
      sessionStorage.removeItem("enableDrager"); // 关闭拖拽
      draw.isCtrl = false;

      await this.$nextTick();
      if (action === "helper") {
        this.isShowLine = true
        return;
      } else if (action === "enlarge") {
        this.isShowLine = false
        draw.canvasScaleByBtn();
      } else if (action === "drager") {
        this.isShowLine = false
        draw.isCtrl = true;
        sessionStorage.setItem("enableDrager", "1"); // 开启拖拽模式
      } else if (action === "select") {
        draw.currentType = action;
        draw.handleSelect(true)
      } else {
        draw.handleSelect(false)
      }
      // 点击选取 => 去掉drager、去掉当前创建对象状态、其余保留


    },
    // 画框小工具
    handledrawEvents(obj) {
      let { type } = obj
      switch (type) {
        // 上一步
        case 'revoke':
          draw.undo()
          break;
        // 下一步
        case 'remake':
          draw.redo()
          break;
        // 回归
        case 'home':
          draw.auto()
          break;
        // 放大
        case 'scale':
          draw.canvasScalebig()
          break;
        // 清空
        case 'del':
          this.deleteJob()
      }
    },
    /** 选择标注工具 */
    setToolsProps(props) {
      console.log("index 页面接收到的选择属性", props);
      draw.currentType = props.figureCode;
      draw.strokeColor = props.color;
      props.toolAttribute = this.configTools.find(item => item.shortcutKeys === props.keyCode).toolAttribute

      // 确定当前要画的框的属性
      this.activeObj = props;
      // 保存当前的框类型属性
      this.currentDrawType = props.figureCode;
      //  当前的obj存入缓存

      if (this.iSinheritAttrs || this.iSinheritTools) {
        console.log('存入缓存的2Dobj', this.activeObj);
        localStorage.setItem('2dObj', JSON.stringify(this.activeObj))
      }

      sessionStorage.removeItem("enableDrager"); // 关闭拖拽

      this.isShowLine = true; // 开启辅助线

      // 清空模式选择
      this.$refs.toolsRef?.resetStatus()

    },
    // 选中
    chooseObject(obj) {
      if (!obj) return;
      // 设置激活的框
      const target = draw.canvas._objects.find(
        (item) => item.classId === obj.classId
      );
      // console.log("target", target)
      if (target) {

        draw.canvas.setActiveObject(target).requestRenderAll();

        // 显示属性弹窗
        // this.activeAttribute = target;
        // console.log(this.activeAttribute);
        const _left = target.left + target.width;
        const _top = target.top;
        // console.log(_left, _top);
        this.activeAttribute = {
          x: _left + draw.canvas.viewportTransform[4],
          y: _top + draw.canvas.viewportTransform[5],
        };
      }
    },
    // 画布框的显隐
    handleShowDrawObj(item) {
      // console.log(item);
      if (item.isShowDraw) {
        draw.resetObjectBorderColor(item.classId, item.color)
      } else {
        draw.resetObjectBorderColor(item.classId, 'transparent')
      }
    },
    // 完成标注
    markComplete() {
      completeJob({
        groupId: this.detailData.groupId,
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success("标注完成");
          this.$router.back();
        }
      });
    },
    // 检测objList值是否有变化，如果有的话需调用保存
    checkObjListChange() {
      let newObjList = JSON.stringify(this.objList);
      if (this.objList.length === 0) newObjList = "";
      return this.oldObjList === newObjList;
    },
    /************************************************************************************* */
    handleLine(lines) {
      this.lines = lines;
    },
    handleCornerClick() {
      return;
    },
    handleScroll() {
      const screensRect = document
        .querySelector("#screens")
        .getBoundingClientRect();
      const canvasRect = document
        .querySelector("#fabric")
        .getBoundingClientRect();

      // 标尺开始的刻度
      const startX =
        (screensRect.left + this.thick - canvasRect.left) / this.scale;
      const startY =
        (screensRect.top + this.thick - canvasRect.top) / this.scale;

      this.startX = startX >> 0;
      this.startY = startY >> 0;
    },
    // 控制缩放值
    handleWheel(e) {
      console.log("handle Wheel", e);
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        );
        this.scale = nextScale;
      }
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    initSize() {
      const wrapperRect = document
        .querySelector("#wrapper")
        .getBoundingClientRect();
      const borderWidth = 1;
      this.width = wrapperRect.width - this.thick - borderWidth;
      this.height = wrapperRect.height - this.thick - borderWidth;
    },
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    clearInterval(this.intervalId);
  }
};

</script>

<style lang="scss" scoped>
#ox {
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  z-index: 99;
  background-color: pink;
  pointer-events: none;
}

#oy {
  position: absolute;
  height: 100%;
  width: 1px;
  top: 0;
  z-index: 99;
  background-color: pink;
  pointer-events: none;
}

.ivu-layout {
  width: 100%;
  background-color: #f7f8fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: auto;
  background: #f5f7f9;

  .ivu-layout-header {
    height: 70px;
  }

  .ivu-layout-content {
    display: flex;
  }

  .ivu-layout-content {
    height: calc(100vh - 70px);

    .left-bar {
      width: 80px;
      height: 100%;
      background: #fff;
      display: flex;
      position: relative;
    }

    .right-bar {
      width: 304px;
      height: 100%;
      overflow-y: auto;
      background: #fff;
    }

    .draw_wrap {
      flex: 1;
      width: 100%;
      position: relative;
      background: #f1f1f1;
      overflow: hidden;

      .mark-main {
        width: 100%;
        height: calc(100vh - 180px);
        padding-right: 12px;
        position: relative;

        #fabric {
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-border-2, #e5e6eb);
          background: var(--color-fill-2, #f2f3f5);
          background: -webkit-linear-gradient(top, transparent 79px, #f2f3f5 0),
            -webkit-linear-gradient(left, transparent 79px, #f2f3f5 0);
          background-size: 80px 80px;
          overflow: hidden;
          position: relative;
        }

        .posi_right {
          position: absolute;
          bottom: 10px;
          right: 20px;
        }
      }
    }
  }

}



// 关闭按钮
.close-btn {
  width: 20px;
  height: 64px;
  cursor: pointer;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  right: -20px;
  z-index: 1;
  top: 50%;
  margin-top: -10px;

  &.right-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
    transform: rotateY(180deg);
    right: 0px;
  }

  &.right-btn-open {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    right: 302px;
  }
}

.el-form {
  border-bottom: 0px;
}
</style>
