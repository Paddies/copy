<template>
  <div class="ivu-layout">
    <!-- 头部按钮区 -->
    <el-row class="ivu-layout-header" v-if="job2d">
      <mark-header ref="markheader" :job2d="job2d" @toolsEvent="toolsEvent" @save="saveGraph" :isCheck="true"
        :job_mode="job_mode" @changeStatus="changeStatus" @skip="skip"></mark-header>
    </el-row>
    <!-- 标框内容区 -->
    <div style="height: calc(100vh - 64px)" class="ivu-layout-content">
      <!-- 左侧区域 -->
      <div class="left-bar tools">
        <Tools ref="toolsRef" :isCheck="true" :activeObj="activeObj" @toolsEvent="setFrameType"
          @toolsProps="setToolsProps" @hideLine="hideLine"></Tools>
      </div>
      <!-- 画布区域 -->
      <div class="mark draw_wrap">
        <div class="mark-main" ref="screensRef" id="screens" @wheel="handleWheel" @scroll="handleScroll">
          <div ref="containerRef" class="screen-container">
            <div id="fabric" :style="canvasStyle"></div>
          </div>
          <!-- 小工具 -->
          <div class="posi_right">
            <draw-tools :isCheck="true" @drawEvents="handledrawEvents"></draw-tools>
          </div>
          <!-- 按钮区 -->
          <bottom-handler :job_mode="job_mode" :rightStatus="showRight" :imgData="job2d" :isCheck="true"
            :objCheckList="objCheckList" @eventTab="bottomHandlerTap"></bottom-handler>
        </div>
      </div>
      <!-- 右侧区域 -->
      <div class="right-bar" v-show="attrBarShow">
        <!-- 对象列表 -->
        <object-list v-show="showRight === 'objects'" :isCheck="true" ref="objListRef" :list="objList"
          :show="showObjectList" @open="openDialog" @close="closeObjectList" @choose="chooseObject" :currentView="objects"
          :configData="configData" @showDraw="handleShowDrawObj"></object-list>
        <!-- 驳回列表 -->
        <object-list ref="objListCheckRef" v-show="showRight === 'rejectList'" :isCheck="true" :list="objCheckList"
          :configData="configData" @close="closeObjectList" @choose="chooseObject" :currentView="Overruled"></object-list>
        <!-- 驳回记录 -->
        <RejectLogs v-show="showRight === 'rejectRecord'" :list="jobCheckLogs"></RejectLogs>
        <!-- 热键 -->
        <HotKeys v-show="showRight === 'hotkey'" :job_mode="job_mode" :isCheck="true" @close="closeObjectList"></HotKeys>
      </div>
      <!-- 右侧关闭按钮 -->
      <div :class="`close-btn right-btn ${attrBarShow && 'right-btn-open'}`" @click="switchAttrBar"></div>
    </div>
    <!-- 框驳回 -->
    <el-dialog :visible.sync="showDialog" title="驳回理由">
      <el-form :model="reasonParams" ref="rejectReason">
        <el-form-item prop="reasonIds" label="错误类型">
          <el-checkbox-group v-model="reasonParams.reasonIds" size="mini">
            <el-checkbox v-for="dict in OverruledList" :key="dict.dictCode" :label="dict.dictValue">{{ dict.dictLabel
            }}</el-checkbox> </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="reason" label="其他原因">
          <el-input type="textarea" v-model="reasonParams.reason" style="width: 80%;" placeholder="请输入其他驳回理由" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleResonSubmit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回弹框 -->
    <el-dialog title="任务驳回" :visible.sync="showTaskReject" width="600px">
      <el-form :model="taskRejectForm" :rules="taskRejectRules" ref="taskRejectForm" label-width="100px"
        label-position="left">
        <el-form-item label="驳回原因" prop="reason">
          <el-input type="textarea" v-model="taskRejectForm.reason"></el-input>
        </el-form-item>
        <el-form-item align="end">
          <el-button type="primary" @click="confirmTaskReject">确认</el-button>
          <el-button @click="showTaskReject = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import hotkeys from 'hotkeys-js'

import { hexToRgba } from "@/utils/ruoyi"
import { str2arr } from "@/utils/validate";
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
// 接口
import { get2DJobDetail, graphCheck, rejectTags, completeCheck, getJobStatus, checkSkip } from "@/api/project/2d";
export default {
  components: {
    MarkHeader,
    drawTools,
    ObjectList,
    Tools,
    BottomHandler,
    DemandList,
    HotKeys,
    RejectLogs,
    AttributeOption
  },
  watch: {
    // 监听右边区域显隐，重新适应画布
    attrBarShow() {
      setTimeout(() => {
        this.resizeView()
      }, 500);
    }
  },
  data() {
    return {
      groupId: this.$route.query.groupId,
      groupStatus: this.$route.query.groupStatus,
      detalLoading: false,
      itemId: "",
      reasonParams: {
        reasonIds: [],
        reason: ''
      },
      OverruledList: [],
      showDialog: false,
      job_mode: '',
      initDicts: ["project_attribute", "project_tools", "t_job_type", "tool_attribute", 'ocr_reject_reason',],
      dictData: [],
      configData: {}, // 所有字典的初始化
      configTools: [], // 该项目配置工具表
      configs: {},
      keyCodesConfigs: [],
      type: 0,
      //   destroyCanvas: false, // 是否销毁画布
      showObjectList: true,
      showDemandList: false,
      showrejectList: false,
      // 是否显示右侧属性框
      attrBarShow: true,
      showRejectReason: false, // 驳回
      // 框驳回
      rejectReason: {
        tagAttributes: [],
        reason: "",
        tags: "",
        cover: "",
        cut: "",
        otherAttributes: "",
      },
      rules: {
        tagAttributes: [
          { required: true, message: "错误类型不能为空", trigger: "blur" },
        ],
      },
      // 任务驳回
      showTaskReject: false,
      taskRejectForm: {
        reason: "",
      },
      taskRejectRules: {
        reason: [
          { required: true, message: "驳回原因不能为空", trigger: "blur" },
        ],
      },
      dynamicComponents: DemandList, // 异步组件
      imgUrl: require("@/assets/images/11.png"),
      frame: null,
      ox: null,
      oy: null,
      showHelper: true, // 是否显示辅助线
      activeObj: null, // 当前激活属性
      labelType: {
        value: "",
      },
      projectTags: [],
      projectTools: [],
      job2d: null,
      jobCheckLogs: [],  // 驳回记录
      objList: [], // 所有标注对象
      objCheckList: [],//所有驳回对象
      activeRejectTag: null, // 被驳回的标签
      errorTypeList: [],
      coverTypeList: [],
      cutTypeList: [],
      currentDrawType: 'select',
      activeAttribute: null, // 当前选中对象的属性
      shortkeys: [],  // 快捷键实例
      statu: '',  // 当前任务状态
      showRight: 'objects',  // 是否展示快捷键列表
      currentPosAttribute: {}, // 当前对象移动的坐标
      rectWidth: 960,
      rectHeight: 720,
      rejectTags: [],
      tags: [],
      objects: "objects",
      Overruled: "Overruled",
    };
  },
  computed: {
    // 通过和驳回按钮的权限验证
    isPassPermi() {
      return this.groupStatus === '7' && this.checkPermi(['graph:job:graphJobCheck', 'graph:job:completeCheck'])
    },
    canvasStyle() {
      return {
        width: this.rectWidth + "px",
        height: this.rectHeight + "px",
        transform: `scale(${this.scale})`,
      };
    },
    dynamicRules: () => {
      return {
        reason: [
          {
            required: true,
            message: "其它原因必填",
            trigger: "change",
          },
        ],
      };
    },
    attr_covers() {
      return this.$store.state.dicts.graph_cover;
    },
    attr_cuts() {
      return this.$store.state.dicts.graph_cut;
    },
    jobStatus() {
      return this.$store.state.dicts.jobStatus;
    }
  },
  beforeRouteLeave(to, from, next) {
    // 清除可拖拽缓存
    sessionStorage.removeItem('enableDrager', '0');
    sessionStorage.removeItem('isCheck');
    next();
  },
  destroyed() {
    this.$modal.closeLoading();
    this.job2d = {}
    hotkeys.unbind()
  },
  mounted() {
    // 确认当前分组id
    // 防止缓存了以前的状态为拖拽模式
    sessionStorage.removeItem('enableDrager', '0') // 关闭拖拽
    sessionStorage.setItem('isCheck', '1');
    // 获取字典
    if (!this.attr_covers) {
      // 获取字典
      this.getDicts('graph_cover').then(res => {
        this.$store.commit('dicts/SET_DICT', {
          key: 'graph_cover',
          value: res.data
        });
      });
    }
    if (!this.attr_cuts) {
      // 获取字典
      this.getDicts('graph_cut').then(res => {
        this.$store.commit('dicts/SET_DICT', {
          key: 'graph_cut',
          value: res.data
        });
      });
    }
    if (!this.jobStatus) {
      // 任务状态字典
      this.getDicts('t_job_type').then(res => {
        this.$store.commit('dicts/SET_DICT', {
          key: 'jobStatus',
          value: res.data
        });
      })
    }

    // 先取缓存里面的标签
    let str = this.taskType === 'job' ? 'job_tag_type' : 'check_tag_type'
    this.labelType.value = localStorage.getItem(str) || ''
    // 监听自定义事件 拉框新建对象
    document.addEventListener("createObject", (event) => {
      const objListItem = { ...event.detail, ...this.activeObj };
      this.objList.push(objListItem);
    });

    // 监听自定义选中事件 获取当前选中的对象
    document.addEventListener("selectObject", async (event) => {
      // console.log(event.detail);
      await this.$nextTick();
      this.classId = event.detail?.classId;
      if (this.classId) {
        const _left = event.detail.left + event.detail.width;
        const _top = event.detail.top;
        console.log(_left, _top);
        this.activeAttribute = {
          x: _left + draw.canvas.viewportTransform[4],
          y: _top + draw.canvas.viewportTransform[5],
        }
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
      let { id, data } = event.detail;
      this.currentPosAttribute.coordinates = data;
      this.currentPosAttribute.classId = id;
      this.$emit("tagValueChange", event.detail);
    });

    // 监听自定义事件删除
    // document.addEventListener("delObject", (event) => {
    //   this.$emit("del", event.detail);
    // });

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

    // 自定义右键菜单也需要阻止右键在上面点击
    // var c_dom = document.getElementById("customContextMenu");
    // c_dom.addEventListener("contextmenu", function (e) {
    //   e.preventDefault();
    // });
    // 添加鼠标中键监听器
    targetElement.addEventListener("mousedown", function (e) {
      e.preventDefault();
      // console.log("mousedown", e.button);  // 0 左键按下 1中键按下
      if (e.button === 1) {
        draw.isMiddleMouse = true;
      } else if (e.button === 0) {
        draw.isDragging = true
      }
    });

    targetElement.addEventListener("mouseup", function (e) {
      e.preventDefault();
      draw.isMiddleMouse = false;
      draw.isCtrl = false;
    });

    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.querySelector('.mark-main')
    const _r = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes') {
          element.style.width = element.clientWidth + 'px'
          element.style.height = element.clientHeight + 'px'
        }
      })
    })
    // resize
    window.addEventListener(
      "resize",
      () => {
        const _targetElement = document.querySelector(".mark-main");
        if (_targetElement) {
          let width = _targetElement.getBoundingClientRect().width;
          let height = _targetElement.getBoundingClientRect().height;
          targetElement.style.width = width - 12 + "px";
          targetElement.style.height = height + "px";
          draw.resizeCanvas(width, height);
        }
      },
      false
    );

    const mainMark = document.querySelector(".mark");
    mainMark.onresize = function () {
      console.log("resize");
      // draw.resizeCanvas(mainMark.clientWidth, mainMark.clientHeight);
    };
    // 绑定快捷键
    this.handlebindKey();
    this.get2DJobDetail()

    this.getOverruledList();
  },
  methods: {
    async getOverruledList() {
      const res = await this.getDicts("ocr_reject_reason");
      this.OverruledList = res.data;
      if (!res.data) {
        return;
      }
    },
    openDialog(itemId) {
      this.itemId = itemId;
      this.showDialog = true;
    },
    // 提交单框驳回原因
    handleResonSubmit() {
      let { reason, reasonIds } = this.reasonParams
      if (reason === '' && reasonIds.length === 0) {
        this.$modal.msgWarning('请至少选择一个驳回理由')
      } else {
        let params = {
          reasonIds: reasonIds.join(','),
          jobId: this.job2d.id,
          tagId: this.itemId,
          errorType: reasonIds.join(','),
          reason: reason,
        }
        console.log("preview", params);
        rejectTags(params).then(res => {
          this.resetCanvas();
          this.get2DJobDetail('current')
          this.showDialog = false;
          this.$modal.msgSuccess('驳回成功');
          this.showRight = 'rejectList'
          this.reasonParams.reasonIds = []
          this.reasonParams.reason = ''

        })
      }

    },
    // 快捷键绑定
    async handlebindKey() {
      let that = this
      hotkeys('x,z,q,Space,Escape,shift+a', { keydown: true }, function (event, handler) {

        event.preventDefault()
        switch (handler.key) {
          case 'z':
            if (that.job2d && that.job2d.upJobId === "-1") {
              return false;
            }
            that.bottomHandlerTap({ type: "prev" });
            break;
          case 'x':
            if (that.job2d && that.job2d.nextJobId === "-1") {
              return false;
            }
            that.bottomHandlerTap({ type: "next" });
            break;
          case 'q':
            if (that.$refs.toolsRef) {
              that.$refs.toolsRef.eventChange('select')
            }
            break;
          // 通过
          case 'Space':
            if (!that.isPassPermi) return
            that.bottomHandlerTap({ type: "pass" });
            break;
          // 驳回
          case 'Escape':
            // 权限验证
            if (!that.isPassPermi) return
            that.bottomHandlerTap({ type: "reject" });
            break;
          default:
        }

      });
    },
    // 字典
    getAllDicts(dicts) {

      if (!dicts) {
        setTimeout(() => {
          this.$router.back()
        }, 1000);
        return this.$message.error('需要先配置字典！')
      };
      let objs = {};
      dicts.forEach((dict, index) => {
        objs[dict] = index
      })
      return Promise.all(
        dicts.map((dict) => {
          return this.getDicts(dict);
        })
      ).then((response) => {
        const projectTags = response[objs['project_attribute']].data.filter(item => this.job2d[dicts[objs['project_attribute']]].includes(item.dictValue));
        const projectTools = response[objs['project_tools']].data.filter(item => this.job2d[dicts[objs['project_tools']]].includes(item.dictValue));
        this.projectTags = projectTags;
        this.projectTools = projectTools;
      })
    },
    /** 清空画布和数据 */
    resetCanvas() {
      this.objList = [];
      if (draw && draw.canvas) {
        draw.coordinates = {};
        draw.canvas.clear();
        draw.canvas.remove();
        draw.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        draw.canvas.dispose(); // 销毁画布
      }
    },
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
    // 任务详情
    get2DJobDetail(t, id, statu) {
      this.detalLoading = true
      this.$modal.loading('图片加载中...')
      let data = {
        jobId: this.$route.query.id,
      };
      if (t) {

        let jobNum = ''
        if (t === "prev") {
          jobNum = this.job2d?.upJobId
        } else if (t === 'next') {
          jobNum = this.job2d?.nextJobId
        } else if (t === 'current') {
          // jobNum = this.job2d?.jobNum
          // jobId = this.$route.query.id
        }
        data = {
          groupId: this.$route.query.groupId,
          jobNum,
          jobStatus: this.statu,
        };
        if (t === 'current') {
          data.jobId = this.job2d.id
        }

      }
      // 更新当前
      if (id) {
        if (statu) {
          data = {
            jobId: id,
            jobStatus: statu
          };
        } else {
          data = {
            jobId: id,
          };
        }
      }

      get2DJobDetail(data).then((response) => {
        if (response.code === 200) {

          this.job2d = {}
          let { id, jobNum, groupId, configs, jobCheckLogs, projectId, tags, rejectTags } = response.data;
          this.job2d = response.data;
          this.jobCheckLogs = jobCheckLogs
          // 配置信息
          this.configData = configs
          this.configTools = configs.tools
          this.job_mode = configs?.job_mode[0];
          let attrs = this.configData.tools?.map(item => item.toolAttribute)
          let dicts = [...new Set(attrs.reduce(function (a, b) { return a.concat(b) }))].filter(item => item !== '[]')          // 字典


          Promise.all(
            [...this.initDicts, ...configs.dictTypes, ...dicts].map(async (item) => {
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

        }
      }).finally(() => {
        this.$modal.closeLoading();
      });
    },
    initDrawCanvas(fileId, tags, rejectTags) {
      this.imgUrl =
        process.env.VUE_APP_BASE_API +
        "/tools/view?fileId=" +
        fileId;
      console.log(this.imgUrl);
      const _field = document.querySelector(".mark-main");
      let _canvas = document.getElementById("fabric");
      _canvas.width = _field.clientWidth - 12;
      _canvas.height = _field.clientHeight;
      // 初始化画布
      draw.init(
        "fabric",
        _canvas.width,
        _canvas.height,
        this.imgUrl,
        function (e) {
          this.handleObjectList(tags)
          this.handleObjectCheckList(rejectTags)
        }.bind(this)
      );
    },
    handleObjectList(tags) {
      this.$modal.closeLoading();
      let tools = this.configData?.tools || [];
      let textArr = this.dictData["project_attribute"];
      let textTool = this.dictData['project_tools']

      // console.log(textTool, tools);
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
      this.objList = []
      // 回显
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
          const coordinates = str2arr(item.tagCoordinate);

          this.objList.push({
            secondaryCategory: secondaryCategory || '',
            ...item,
            isShowDraw: true, // 画布是否显示该框
            toolConfigId: toolConfigId,
            classId: topicNum,
            topicNum,
            figureCode: tools.figureCode,
            figureName: tools.figureName,
            tagCode: categoryAttributes || "",// 属性code
            tagName: tools.tagName, // 属性名字
            tagType: tagType,
            coordinates,
            color: tools.color || "",
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
          // 传值给对象的obj
          let objs = {
            points: coordinates,
            classId: topicNum,
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
    },
    handleObjectCheckList(rejectTags) {


      // 回显
      if (rejectTags) {
        this.objCheckList = []

        rejectTags.forEach(async (item) => {
          let { toolConfigId, categoryAttributes, secondaryCategory, topicNum, reasonIds, reason,
            tagType, tagCover, tagCut, otherAttributes, identifyLevel, cutLevel, tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY } = item
          tagWidth = Number(tagWidth)
          tagHeight = Number(tagHeight)
          tagLeft = Number(tagLeft)
          tagTop = Number(tagTop)
          tagScaleX = Number(tagScaleX)
          tagScaleY = Number(tagScaleY)
          // 根据配置项获取属性名字和快捷键

          let tools = this.keyCodesConfigs.find(k => k.toolConfigId === item.toolConfigId)
          console.log('tools', this.OverruledList);

          const coordinates = str2arr(item.tagCoordinate);

          this.objCheckList.push({
            ...item,
            secondaryCategory: secondaryCategory,
            isShowDraw: true, // 画布是否显示该框
            reasonIds: reasonIds,
            reason: reason,
            toolConfigId: toolConfigId,
            classId: topicNum,
            topicNum: topicNum,
            figureCode: tools.figureCode,
            figureName: tools.figureName,
            tagCode: categoryAttributes || "",// 属性code
            tagName: tools.tagName, // 属性名字
            tagType: tagType,
            coordinates,
            color: tools.color || "",
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

          let objs = {
            points: coordinates,
            classId: item.topicNum,
            color: tools?.color,
            fillColor: hexToRgba(tools.color, .5),
            isReject: true,
            tagWidth, tagHeight, tagLeft, tagTop, tagScaleX, tagScaleY
          }
          // console.log(objs);

          if (item.tagType === "rect") {
            draw.createRectByPoints(objs);
          } else if (item.tagType === "polygon") {
            draw.createPolygonByPoints(objs);
          } else if (item.tagType === "polyline") {
            draw.createPolylineByPoints(objs);
          }
        });
      }
    },
    // 更改筛选状态
    changeStatus(statu) {
      this.$modal.loading('正在获取数据...');
      this.statu = statu;
      if (!statu) {
        this.resetCanvas();
        this.get2DJobDetail('', this.job2d.id);
      } else {
        getJobStatus({
          groupId: this.job2d.groupId,
          // jobId: this.job2d.id,
          jobStatus: statu
        }).then(res => {
          if (res.code === 200) {
            this.resetCanvas();
            this.get2DJobDetail('', res.data.nextJobId, statu);
          }
        }).catch(err => {
          this.statu = ''
          this.$refs.markheader.statu = ''
          this.resetCanvas();
          this.get2DJobDetail('', this.job2d.id)
        }).finally(() => {
          this.$modal.closeLoading();
        });
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
        jobId: this.job2d.id,
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
      let data = this.handleSaveData()
      saveGraph(data)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.resetCanvas();
            this.get2DJobDetail('current')
          }
        })
        .finally(() => {
          this.$refs.markheader.loading = false;
        });
    },
    bottomHandlerTap(e) {
      if (e.type === "reject") {
        // 任务驳回
        this.showTaskReject = true;
      } else if (e.type === "pass") {
        this.handlePass();
      } else if (e.type === "prev" || e.type === "next") {
        if (this.job_mode === '2') {
          this.activeAttribute = null;
          // 清空弹出属性窗口
          this.$nextTick(() => {
            if (this.$refs.objList) {
              this.$refs.objList.active = 0;
            }
            draw.currentType = this.currentDrawType;
            // console.log(e.type);
            this.resetCanvas();
            this.get2DJobDetail(e.type)
          })
        }
      } else if (e.type === "nomark") {
        this.showNoMark = true;
      } else if (e.type === 'checkComplete') {
        this.checkComplete()
      } else if (e.type === 'hotkey') {
        // 热键
        this.attrBarShow = true;
        this.showRight = 'hotkey';
      } else if (e.type === 'rejectList') {
        // 驳回列表
        this.showRight = 'rejectList'
        this.attrBarShow = true;
        this.selectedArray = this.objCheckList;

      } else if (e.type === 'objects') {
        // 对象列表
        this.selectedArray = this.objList;
        this.showRight = 'objects'
        this.attrBarShow = true;

      } else if (e.type === 'rejectRecord') {
        // 驳回记录
        this.selectedArray = this.objList;
        this.showRight = 'rejectRecord'
        this.attrBarShow = true;
      }
    },
    // 确认驳回(任务)
    confirmTaskReject() {
      this.$refs.taskRejectForm.validate((valid) => {
        if (valid) {
          //  驳回
          graphCheck({
            jobId: this.job2d.id,
            jobStatus: "9",
            checkNote: this.taskRejectForm.reason,
            jobMode: this.job_mode,
          }).then((res) => {

            if (this.job_mode === '2') {
              // 手动领题
              this.$message.success("驳回成功");
              this.get2DJobDetail('current')
              return
            }

            // 系统发题
            let { nextJobId } = res.data
            // 是没有下一题
            if (nextJobId === '-1') {
              // 系统发题
              this.$confirm('已是最后一题, 是否开始下一组任务质检?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 调完成质检 
                completeCheck({
                  groupId: this.job2d.groupId,
                  jobMode: this.job_mode,
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success("质检完成");
                    let { nextJobId } = res.data
                    if (nextJobId === '-1') {
                      this.$router.back();
                    } else {
                      this.jobId = nextJobId;
                      this.resetCanvas();
                      this.get2DJobDetail('', this.jobId)
                    }

                  }
                })
              }).catch(() => {
                this.resetCanvas();
                this.get2DJobDetail('current')
              });

            } else {
              // 有下一题
              this.jobId = nextJobId;
              this.resetCanvas();
              this.get2DJobDetail('', this.jobId)
              this.resetForm('taskRejectForm')
              this.$message({
                type: "success",
                message: "驳回成功",
              });

            }

          });

          this.showTaskReject = false;
          this.resetForm('taskRejectForm')
        }
      });
    },
    // 通过质检
    handlePass() {
      graphCheck({
        jobId: this.job2d.id,
        jobStatus: "4",
        jobMode: this.job_mode,
      }).then((res) => {

        if (this.job_mode === '2') {
          // 手动领题
          this.$message.success("已通过");
          this.resetCanvas();
          this.get2DJobDetail('current')
          return false
        }

        // 系统发题
        let { nextJobId } = res.data
        // 是没有下一题
        if (nextJobId === '-1') {
          // 系统发题
          this.$confirm('已是最后一题, 是否开始下一组任务质检?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 调完成质检 
            completeCheck({
              groupId: this.job2d.groupId,
              jobMode: this.job_mode,
            }).then((res) => {
              if (res.code === 200) {
                this.$message.success("本组任务已完成质检");
                let { nextJobId } = res.data
                if (nextJobId === '-1') {
                  this.$router.back();
                } else {
                  this.jobId = nextJobId;
                  this.resetCanvas();
                  this.get2DJobDetail('next', this.jobId)
                }

              }
            })
          }).catch(() => {
            this.resetCanvas();
            this.get2DJobDetail('current')
          });

        } else {
          // 有下一题
          this.jobId = nextJobId;
          this.resetCanvas();
          this.get2DJobDetail('next', this.jobId)

          this.showTaskReject = false;
          this.resetForm('taskRejectForm')
          this.$message({
            type: "success",
            message: "质检成功",
          });

        }
      });

    },
    //跳过
    skip() {
      checkSkip({
        groupId: this.job2d.groupId,
      }).then((res) => {
        if (res.code === 200) {
          let { nextCheckId } = res.data
          if (nextCheckId === '-1') {
            this.$confirm('已是最后一题, 是否开始下一组任务质检?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 调完成质检 
              this.completeCheck()
            }).catch(() => {
              this.$router.back();
            });
          } else {
            this.jobId = nextCheckId;
            this.resetCanvas();
            this.get2DJobDetail('', this.jobId)
          }
        }
      });
    },
    // 取消驳回
    handleCancel() {
      this.showDialog = false;
    },
    closeObjectList() {
      this.showObjectList = false;
    },
    toolsEvent(type) {
      if (type === "object") {
        this.showObjectList = !this.showObjectList;
      }
    },
    hideLine() {
      this.ox = null;
      this.oy = null;
    },
    // 右侧工具栏点击事件
    async setFrameType(action) {
      sessionStorage.removeItem('enableDrager', '0') // 关闭拖拽
      await this.$nextTick();
      if (action === "helper") {

        return
      } else if (action === 'enlarge') {
        draw.canvasScaleByBtn()
      } else if (action === 'drager') {
        draw.isCtrl = true
        sessionStorage.setItem('enableDrager', '1') // 开启拖拽模式
      }
      // 点击选取 => 去掉drager、去掉当前创建对象状态、其余保留
      draw.currentType = action;
    },
    setToolsProps(props) {
      draw.currentType = props.figureCode;
      draw.strokeColor = props.color;

      // 确定当前要画的框的属性
      this.activeObj = props;
      // this.frame.initEvent(props);
    },

    // 完成绘制
    finishDraw(details) {
      console.log(details);
    },
    // 选中
    chooseObject(obj) {
      if (!obj) return;
      // 设置激活的框
      const target = draw.canvas._objects.find(item => item.classId === obj.classId)

      if (target) {
        draw.canvas.setActiveObject(target).requestRenderAll();

        // 显示属性弹窗
        // this.activeAttribute = target;
        console.log(target);
        const _left = target.left + target.width;
        const _top = target.top;
        console.log(_left, _top);
        this.activeAttribute = {
          x: _left + draw.canvas.viewportTransform[4],
          y: _top + draw.canvas.viewportTransform[5],
        }
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
    // 完成质检
    checkComplete() {
      completeCheck({
        groupId: this.job2d.groupId,
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('质检完成')
          this.$router.back()
        }
      })
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
      }
    },
    handleDrawPre() { },
    handleDrawNext() { },
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
    switchAttrBar() {
      this.attrBarShow = !this.attrBarShow

      draw._initResizeObserve()
    },

  },
};
</script>

<style lang="scss" scoped>
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
