<template>
  <div class="container">
    <div class="tools_warp">
      <!-- 左侧按钮区 -->
      <Tools ref="toolsRef" :toolsConfigs="toolsConfigs" :activeObj="activeObj" @toolsProps="setToolsProps"
        @hideLine="hideLine"></Tools>
    </div>
    <div class="pdf">
      <div class="header" v-if="detailData">
        <div class="header-name">
          图片名称：<span style="color: #1890ff">{{ detailData.fileName }}</span>
        </div>
        <div class="header-id">
          当前任务ID：<span style="color: #1890ff">{{ detailData.id }}</span>
        </div>
        <div class="header-btns">
          <el-button type="primary" class="prev" size="mini" :disabled="activeImgIndex === 0"
            @click="getCurrent('prev')">上一题</el-button>
          <span>
            <el-input-number v-model="topicIndex" controls-position="right" @change="handleImgIndexChange" :min="1"
              :max="projectJobList.length" size="mini"></el-input-number>
            / {{ projectJobList.length }}
          </span>
          <el-button type="primary" class="next" size="mini" :disabled="projectJobList.length === 0 || activeImgIndex === projectJobList.length - 1
            " @click="getCurrent('next')">下一题</el-button>
        </div>
      </div>
      <edit-picture v-if="!destroyCanvas" ref="editpicture" :tools="toolsLabel" :taskType="'job'" :labList="labList"
        @createTag="createTag" @tagValueChange="tagValueChange" @toolsTypeChange="toolsTypeChange"
        @del="handleDelete"></edit-picture>
    </div>
    <div class="topic">
      <el-card>
        <div class="clearfix">
          <div>
            <span> 任务状态：</span>
            <span :class="`status-tag status-tag-jobStatus-${jobStatus}`">{{
              jobStatusTxt
            }}</span>
          </div>
          <span class="btnTxt" v-if="jobCheckLogs && jobCheckLogs.length > 0" @click="showList = !showList">
            查看驳回记录
            <i class="el-icon-arrow-up" v-if="showList"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </span>
        </div>
        <div class="table" v-if="jobCheckLogs && jobCheckLogs.length > 0 && showList">
          <div style="width: 100%" class="head">
            <div style="width: 50%">日期</div>
            <div style="width: 25%">姓名</div>
            <div style="width: 25%">驳回原因</div>
          </div>
          <div v-for="(item, index) in jobCheckLogs" :key="index" class="cont" style="width: 100%">
            <div style="width: 50%">{{ item.cTime }}</div>
            <div style="width: 25%">{{ item.checkNickName }}</div>

            <el-tooltip placement="top">
              <div slot="content" class="tips_content">
                {{ item.checkNote }}
              </div>
              <div style="width: 25%; overflow: hidden">
                {{ item.checkNote | limitWords }}
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-card>
      <p></p>
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="标注框列表" name="first">
            <el-tree ref="tree" class="filter-tree" :data="treeData" node-key="id" :highlight-current="true"
              :current-node-key="currentKey" :props="{
                children: 'children',
                label: 'label',
              }" default-expand-all @current-change="getCurrentKey">
              <div class="custom-tree-node" slot-scope="{ node, data }" :class="{ active: currentKey === data.id }"
                :style="{ color: data.color }" :id="data.id">
                <span>{{ data.index }}</span>
                <span>{{ data.tagName }}</span>
                <span>
                  <div class="handlers">
                    <span>
                      <svg-icon icon-class="ocr" style="vertical-align: bottom; color: blue"
                        @click.stop="OCRRecognition(data)"></svg-icon>
                    </span>
                    <i class="el-icon-edit" @click="handleEditTag(data)"></i>
                    <el-popover placement="top" width="160" v-model="data.isShowPop" :ref="`popoverRef-${data.id}`">
                      <p>确定删除标签吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="data.isShowPop = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelTag(data)">确定</el-button>
                      </div>
                      <i class="el-icon-delete" slot="reference" @click="handlePopover(data.id)"></i>
                    </el-popover>
                  </div>
                </span>
              </div>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="驳回框列表" name="secoend">
            <el-tree ref="treeRef" class="filter-tree" :data="treeBHData" node-key="id" :highlight-current="true"
              :current-node-key="currentKey" :props="{
                children: 'children',
                label: 'label',
              }" default-expand-all @current-change="getCurrentKey">
              <div class="custom-tree-node" slot-scope="{ node, data }" :class="{ active: currentKey === data.id }"
                :style="{ color: data.color }" :id="data.id">
                <span>{{ data.index }}</span>
                <span>{{ data.tagName }}</span>
                <span>
                  <div class="handlers">
                    <el-popover placement="bottom" title="驳回原因" width="200" trigger="hover" :content="data.reasonTxt">
                      <i class="el-icon-view" slot="reference"></i>
                    </el-popover>
                    <el-popover placement="top" width="160" :ref="`popoverRef-${data.id}`" trigger="hover">
                      <p>确定修改标签吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini" @click="handleEditTag(data)">确定</el-button>
                      </div>
                      <i class="el-icon-edit" slot="reference"></i>
                    </el-popover>
                    <el-popover placement="top" width="160" :ref="`popoverRef-${data.id}`" trigger="hover">
                      <p>确定删除标注框吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini" @click="handleDelTagBH(data)">确定</el-button>
                      </div>
                      <i class="el-icon-delete" slot="reference" @click="handlePopover(data.id)"></i>
                    </el-popover>
                    <!--
                    <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' icon="el-icon-info" icon-color="red"
                      title="这是一段内容确定删除吗？">
                      <i class="el-icon-delete" slot="reference"></i>
                    </el-popconfirm> -->
                  </div>
                </span>
              </div>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <p></p>
      <el-card v-for="tree in allTreeData" :key="tree.id" v-show="currentKey === tree.id">
        <div slot="header" class="clearfix">
          <span style="float: left"> {{ tree.labelType }} </span>
        </div>
        <div class="content">
          <el-input :id="`katex_${tree.id}_text`" type="textarea" rows="5" v-model="tree.contentText" :placeholder="`请录入`"
            :spellcheck="false" @blur="(e) => blur(e, tree.id)"></el-input>
          <p>LaTex预览</p>
          <div v-katex="tree.contentText" readonly :ref="`katex_${tree.id}_dom`" style="margin-bottom: 20px" />
        </div>
      </el-card>
      <p></p>
      <el-card class="footBtn">
        <el-row>
          <el-col align="left"> </el-col>
          <el-col align="right">
            <!-- 标注中和已驳回状态显示 -->
            <el-button v-if="(jobStatus === '1' || jobStatus === '9') &&
              checkPermi(['imgJob:saveJob'])
              " size="mini" type="primary" :loading="saveLoading" plain @click="submitJobNoNext('save')"
              :disabled="allTreeData.length === 0">保存并继续</el-button>
            <el-button v-if="(jobStatus === '1' || jobStatus === '9') &&
              checkPermi(['imgJob:submitJob'])
              " size="mini" type="primary" :loading="subLoading" :disabled="allTreeData.length === 0"
              @click="submitJobNoNext('submit')">提交</el-button>
            <!--  -->
            <el-button v-if="jobStatus === '1' && checkPermi(['imgJob:cancel'])" size="mini" type="danger" plain
              @click="handleVoid()">作废</el-button>
            <el-button size="mini" @click="$router.back()">返回</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import katex from "katex";
import "katex/dist/katex.min.css";
import EditPicture from "@/views/components/marks/editpicture";
import Tools from "@/views/components/marktools/tools";

import {
  getOCRJobDetail,
  saveJob,
  submitJob,
  voidJob,
  submitJobNoNext,
} from "@/api/project/imgTask";
import { latexImage, uploadImg } from "@/api/tool/gen";
import draw from "@/views/components/marks/editpicture/draw";
import { deepClone, base64ToFile } from "@/utils";

export default {
  name: "ocrJobDetail",
  components: {
    EditPicture,
    Tools
  },
  computed: {
    allTreeData() {
      return this.treeData.concat(this.treeBHData);
    },
    toolsLabel() {
      let arrs = this.proConfigData.find(
        (item) => item.value === "project_tools"
      );
      if (arrs) {
        return arrs.radios?.map((item) => {
          return {
            label: item.label,
            value: item.value,
          };
        });
      } else {
        return [];
      }
    },
    activeImgIndex() {
      return this.topicIndex - 1;
    }
  },
  data() {
    return {
      initDicts: ['ocr_reject_reason', 't_job_type', 'project_attribute', 'project_tools', 'project_tag'],
      configDits: ['job_extends', 'extends_content', 'auto_save'],
      dictData: {},// 所有字典的初始化
      configData: {},
      configTools: [],
      toolsConfigs: [],
      keyCodesConfigs: [],
      configs: [],
      activeObj: {},

      rectTools: [],
      polygonTools: [],
      polylineTools: [],
      activeNames: [],
      reasonParams: {},
      treeScrollTop: 0,
      jobId: this.$route.query.id,
      proId: this.$route.query.proId,
      jobStatus: "",
      jobStatusTxt: "",
      upId: null,
      showList: false,
      imgUrl: null,
      treeData: [],
      treeBHData: [],
      checkTags: [],
      labList: [],
      jobCheckLogs: [],
      jobTypeOptions: [],
      jobCheckLogs: [],
      jobNickName: "",
      showList: false,
      tags: [],
      currentTagColor: "", // 当前选择标签颜色
      currentMarkType: "", // 当前绘制框的类型
      currentMarkTypeTxt: "", // 当前绘制框的类型说明
      labelType: {
        value: "", // 当前选择标签类型
      },
      noidNodes: "", // 作废原因
      currentKey: "",
      currentIndex: 0, // 树列表当前选定的下标
      currObj: {}, // 当前选择的对象
      // 保存加载
      saveLoading: false,
      // 提交加载
      subLoading: false,
      destroyCanvas: true,
      activeName: "first",
      proConfigData: [],
      proConfigForm: {},
      keyCodes: [], // 快捷键集合
      detailData: null,
      topicIndex: 1,
      // 任务id集合
      projectJobList: [],
    };
  },
  beforeRouteLeave(to, from, next) {
    if (draw && draw.canvas) {
      draw.coordinates = {};
      draw.canvas.clear();
    }
    next();
  },
  filters: {
    limitWords(txt) {
      var str = txt;
      str = str.length > 5 ? str.substr(0, 5) + "..." : str;
      return str;
    },
  },
  mounted() {
    this.initData()
    // 监听自定义选中事件  selectObject
    document.addEventListener("selectObject", (event) => {
      this.tagSelectedChange(event.detail.classId);
    });


    // 记录页面进入详情页
    sessionStorage.setItem("markDetail", true);

    let that = this;
    setTimeout(function () {
      // 绑定快捷键
      that.handlebindKeyCodes();
    }, 1000);
  },
  destroyed() {
    this.$modal.closeLoading();
  },
  methods: {
    /** 初始化 */
    initData() {
      let datas = [...this.initDicts, ...this.configDits]
      Promise.all(
        datas.map(async (item) => {
          return {
            key: item,
            options: await this.$store.dispatch("dicts/GET_DIC", { key: item }),
          };
        })
      ).then(res => {
        console.log(res);
        let obj = {}
        res.forEach((k) => {
          obj[k.key] = k.options;
        });

        this.dictData = obj
        console.log(this.dictData);
        this.getOCRJobDetail()
      })
    },
    handleImgIndexChange() {
      this.jobId = this.projectJobList[this.activeImgIndex];
      this.resetCanvas();
      this.getOCRJobDetail();
    },

    getCurrent(type) {
      this.resetCanvas();
      if (type === "prev") {
        this.topicIndex = this.topicIndex - 1;
      } else {
        this.topicIndex = this.topicIndex + 1;
      }
      this.jobId = this.projectJobList[this.activeImgIndex];
      // 下一题
      this.getOCRJobDetail();
    },
    // 保存并提交、提交
    submitJobNoNext(type) {
      if (type == "save") {
        this.saveLoading = true;
      } else {
        this.subLoading = true;
      }

      const tags = this.handleTagsQuery(this.treeData);
      const checkTags = this.handleTagsQuery(this.treeBHData);

      let params = {
        jobId: this.jobId,
        tags,
        checkTags,
      };
      if (params.tags.length === 0 && params.checkTags.length === 0) {
        this.$message.error("请标注至少一条数据");
        this.saveLoading = false;
        this.subLoading = false;
        return;
      }
      // 调保存接口
      submitJobNoNext(params)
        .then((res) => {
          if (res.code === 200) {
            if (type === "save") {
              this.$message.success("保存成功！");
              // 保存并继续
              this.topicIndex += 1;
              this.jobId = this.projectJobList[this.activeImgIndex];
              this.resetCanvas();
              this.getOCRJobDetail();
            } else {
              // 提交
              this.$message.success("提交成功！");
            }
          }
          this.activeName = "first";
        })
        .finally((err) => {
          this.saveLoading = false;
          this.subLoading = false;
        });
    },


    /**
     *@Description: 获取详情
     *@return {undefined} - 返回值描述
     */
    getOCRJobDetail() {
      this.$modal.loading("数据加载中...");

      // await this.getDicts("t_job_type").then((response) => {
      //   this.jobTypeOptions = response.data;
      // });
      getOCRJobDetail({ id: this.jobId, projectId: this.proId }).then(response => {

        let { labList, tags, fileId, id, jobStatus, jobCheckLogs, checkTags, configs, projectJobList, projectJobIndex } = response.data;
        // 配置信息
        this.configData = configs
        this.configTools = configs.tools
        this.handleConfigData()

        // 初始化配置信息
        this.initConfig(configs);
        // 赋值
        this.jobId = id;
        this.detailData = response.data;
        this.jobCheckLogs = jobCheckLogs;
        this.projectJobList = projectJobList; // 所有任务id
        this.topicIndex = projectJobIndex + 1;
        this.jobStatus = jobStatus.toString();
        console.log(this.dictData['t_job_type']);
        this.jobStatusTxt = this.dictData['t_job_type']?.find(item => item.dictValue === jobStatus.toString()).dictLabel

        // 回显框处理数据
        this.handleDetailTagsData(tags, checkTags)

        // 处理配置数据


        let dictTypes = configs.dictTypes
        // this.initData(dictTypes)

        dictTypes?.forEach(item => {
          this.proConfigForm[item] = configs[item]
        })

        this.dictTypes = dictTypes

        this.labList = labList.map((item, index) => {
          return {
            ...item,
            color: item.remark,
            keyCode: index + 49
          }
        });







        this.destroyCanvas = false;

        // 加载背景图
        this.initDrawCanvas(fileId);
      }).finally(() => { })

    },
    /** 处理配置信息 */
    handleConfigData() {
      let tools = this.configData?.tools || [];
      let configTools = ['rect', 'polygon', 'polyline'];
      let textArr = this.dictData["project_tag"];
      let textTool = this.dictData['project_tools']

      console.log(textTool, textArr);
      if (textArr) {
        let configs = tools.map((item, index) => {
          console.log(item.toolTag);
          return {
            toolConfigId: item.id,
            tools: item.tool,
            toolTxt: textTool?.find((o) => o.dictValue === item.tool)?.dictLabel,
            text: item.toolTag,
            tagCode: item.toolTag,
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
              color: k.toolColour,
              figureCode: k.tool,
              figureName: textTool?.find((o) => o.dictValue === k.tool)?.dictLabel,
              tagName: k.toolTag,
              tagCode: k.toolTag,
              keyCode: k.shortcutKeys
            };
          })
        }
      })
      console.log(toolsProps);
      this.toolsConfigs = toolsProps

      // 处理快捷键数据渲染
      this.keyCodesConfigs = tools.map(k => {
        console.log(k.shortcutKeys);
        return {
          toolConfigId: k.id,
          color: k.toolColour,
          figureCode: k.tool,
          figureName: textTool?.find((o) => o.dictValue === k.tool)?.dictLabel,
          tagName: k.toolTag,
          tagCode: k.toolTag,
          keyCode: k.shortcutKeys
        };
      })
    },
    /** 初始配置化信息 */
    initConfig(configs) {
      const { tools } = configs;
      console.log('initConfig', tools);
    },
    /** 回显标注框和驳回框的数据 */
    handleDetailTagsData(tags, checkTags) {
      // 驳回列表回显
      checkTags = checkTags.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });

      this.checkTags = this.handleTagsData(checkTags);
      this.tags = this.handleTagsData(tags);
      // 此处赋值必须深拷贝一下，不然input无法渲染双向绑定！！！
      this.treeData = deepClone(this.tags);
      this.treeBHData = deepClone(this.checkTags);
    },
    /** 背景图初始化 */
    initDrawCanvas(fileId) {
      let that = this;
      // 设置画布的宽高
      const box = document.querySelector(".pdf");
      let width = box.getBoundingClientRect().width;
      let height = box.getBoundingClientRect().height;
      const img = new Image();
      img.src = process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
      img.onload = function (res) {
        if (res) {
          that.$modal.closeLoading();
          draw.init(
            "draw",
            width,
            height,
            process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId,
            async function () {
              await that.$nextTick();
              if (draw.canvas) {
                that.$refs.tree.setCurrentKey(that.treeData[0]?.id);
                let data = that.treeData.concat(that.treeBHData);
                data.forEach((item) => {
                  if (item.tagType === "rect") {
                    draw.createRectByPoints(
                      item.coordinates,
                      item.id,
                      item.color
                    );
                  } else if (item.tagType === "polygon") {
                    draw.createPolygonByPoints(
                      item.coordinates,
                      item.id,
                      item.color
                    );
                  } else if (item.tagType === "polyline") {
                    draw.createPolylineByPoints(
                      item.coordinates,
                      item.id,
                      item.color
                    );
                  }
                });
              }
            }
          );
        }
      };
    },
    /** 选择快捷键 */
    setToolsProps(props) {
      console.log("index 页面接收到的选择属性", props);
      draw.currentType = props.figureCode;
      draw.strokeColor = props.color;

      this.$refs.editpicture?.handlerClick(props.figureCode);
      this.$refs.editpicture?.handleTagType(props.tagCode);
      // 确定当前要画的框的属性
      this.activeObj = props;
      // 保存当前的框类型属性
      this.currentDrawType = props.figureCode;
      //  当前的obj存入缓存

      if (this.iSinheritAttrs || this.iSinheritTools) {
        console.log('存入缓存的2Dobj', this.activeObj);
        localStorage.setItem('2dObj', JSON.stringify(this.activeObj))
      }
    },
    handlebindKeyCodes() {
      this.$shortcuts.add([
        {
          shortcut: "d", //支持大小写
          handler: (event) => {
            draw.handleDelete();
            this.currentIndex = 0;
            return true
          },
        },
        {
          shortcut: "Up", //支持大小写
          handler: (event) => {
            event.preventDefault();
            this.handleKeyDownByupAndDown("up");
            return true
          },
        },
        {
          shortcut: "Down", //支持大小写
          handler: (event) => {
            event.preventDefault();
            this.handleKeyDownByupAndDown("down");
            return true
          },
        },
        {
          shortcut: "ctrl+s", //保存
          handler: (event) => {
            event.preventDefault();
            this.handleSave();
            return true
          },
        },
        {
          shortcut: "ctrl+shift+s", //提交
          handler: (event) => {
            event.preventDefault();
            this.handleSubmit();
            return true
          },
        },
        this.setToolsKeyCodes()
      ]);
    },
    // 快捷键up和down
    handleKeyDownByupAndDown(type) {
      this.$nextTick(() => {
        this.treeScrollTop = 20;
      });
      draw.currentType = "select";

      let list = this.treeData;
      let len = this.treeData.length - 1;

      if (type === "up") {
        if (this.currentIndex === 0 || this.currentIndex < 0) {
          return;
        }
        this.currentIndex--;
      } else {
        if (this.currentIndex === len || this.currentIndex > len) {
          return;
        }
        this.currentIndex++;
      }
      let currObj = list[this.currentIndex];

      if (currObj) {
        this.currObj = currObj;
      }
      this.currentKey = this.currObj.id;

      this.getCurrentKey(this.currObj, this.currentIndex);
    },
    // 工具选择快捷键添加
    setToolsKeyCodes() {
      this.activeObj = {};
      let arr = this.keyCodesConfigs.map((item) => {
        return {
          shortcut: item.keyCode,
          handler: (event) => {
            this.setToolsProps(item)

            return true;
          },
        };
      });

      this.$shortcuts.add(arr);
    },
    // 处理气泡弹框重复的问题
    handlePopover(data) {
      this.treeData.forEach((item) => {
        if (item.id === data.id) {
          item.isShowPop = true;
        } else {
          item.isShowPop = false;
        }
      });
    },

    /** 初始化画布数据 */
    handleTagsData(tags) {
      tags = tags.filter((item) => item.tagType !== "select");
      tags.forEach((item, index) => {
        let tools = this.configs.filter(k => k.tools === item.tagType)[0]
        console.log('tools', tools);

        if (item.tagCoordinate && typeof item.tagCoordinate === "string") {
          let validJSON = item.tagCoordinate.replace(/=/g, ":");
          // 将属性名的双引号替换为单引号
          let str = validJSON.replace(
            /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
            '"$2":'
          );
          // 使用 JSON.parse() 将字符串解析为数组
          const jsonArray = JSON.parse(str);
          item.tagCoordinate = jsonArray;
          item.contentText = item.tagContent === null ? "" : item.tagContent;
          item.coordinates = item.tagCoordinate;
          item.label = item.tagName + item.topicNum;
          item.labelType = item.tagName;
          item.color = tools.color;
          item.index = index + 1; // 新增下标
          item.isShowPop = false; // 控制气泡框显示
          item.disabled = false;
          if (item.reason || item.reasonIds) {
            item.reasonTxt = item.reasonIds + item.reason;
          }
        }
      });

      return tags
    },
    /**
     *@Description: 新增标签
     *@param {Object} args - 回调参数,
     *@return {undefined} - 返回值描述
     */
    async createTag(args) {
      console.log('createTag', args);
      // 判断ID是否已存在，已存在编辑，未存在新增
      let data = this.activeName === "first" ? this.treeData : this.treeBHData;
      let isEdit = data?.some((item) => item.id === args.id);
      // console.log(isEdit ? '编辑' : '新增', this.tags);
      if (isEdit) {
        await this.$nextTick();
        // 标注框编辑
        if (this.activeName === "first") {
          this.tags.forEach((item) => {
            if (item.id === args.id) {
              item.labelType = args.labelType;
              item.label = args.labelType;
              item.tagName = args.labelType;
              item.color = args.color;
            }
          });

          this.treeData = deepClone(this.tags);
        } else {
          // 驳回框编辑
          this.checkTags.forEach((item) => {
            if (item.id === args.id) {
              item.labelType = args.labelType;
              item.label = args.labelType;
              item.tagName = args.labelType;
              item.color = args.color;
            }
          });
          this.treeBHData = deepClone(this.checkTags);
        }
        // 重新渲染目标元素
        draw.resetObjectBorderColor(args.id, args.color);
      } else {
        let index = this.treeData.length
          ? this.treeData[this.treeData.length - 1].index + 1
          : 1;
        let obj = {
          color: args.color,
          labelType: args.labelType,
          id: args.id,
          label: args.labelType,
          tagType: args.tagType,
          tagName: args.labelType,
          name: "标签" + args.id,
          coordinates: args.coordinates,
          contentText: args.contentText,
          index,
        };
        console.log(obj);
        // 回显当前新增的标签类型
        this.proConfigData.forEach((item) => {
          if (item.value === "project_tag") {
            item.radioLabel = args.labelType;
            item.radioValue = args.tagType;
          }
        });

        this.labelType.value = args.labelType;
        this.treeData.push(obj);
        this.tags.push(obj);
        this.currentIndex = this.treeData.length - 1;
      }
      this.currentKey = args.id;
      // 设置高亮选中
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(args.id);
        draw.resetObjectBorderColor(args.id, args.color);
      });
    },

    /**
     *@Description: 联动选中框，树高亮
     *@param {Number} id - 对应树节点id,
     *@return {undefined} - 返回值描述
     */
    tagSelectedChange(id) {
      this.currentKey = id;
      // 设置高亮选中
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(id);
      });
    },
    /**
     *@Description: 联动选中框，树高亮，数据修改
     *@param { Object | Array} obj - 对应树节点信息,
     *@return {undefined} - 返回值描述
     */
    tagValueChange(obj) {
      // console.log('获取的tagValueChange', obj);
      let { id, data } = obj;
      this.currentKey = id;
      // 设置高亮选中
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(id);
      });
      // 修改树结构数据attributes ...
      this.treeData.forEach((item, index) => {
        if (item.id === id) {
          item.coordinates = data[0];
        }
      });
    },
    /** 画布修改标签工具 */
    toolsTypeChange(label) {
      this.proConfigData.forEach((item) => {
        if (item.value === "project_tools") {
          item.radioLabel = label;
        }
      });
    },
    /** 删除 */
    handleDelete(classId) {
      let index = this.treeData.findIndex((item) => item.id == classId);
      this.treeData.splice(index, 1);
      this.tags.splice(index, 1);
    },

    /**
     *@Description: 点击标签，回显表单
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    getCurrentKey(args) {
      let index = this.treeData.findIndex((item) => item.id === args.id);
      this.currentIndex = index;
      this.currentKey = args.id;
      draw.currentType = "select";
      this.currentKey = args.id;

      // 回显中间的位置
      const node = document.getElementById(args.id); // 通过Id获取到对应的dom元素
      if (node) {
        this.$nextTick(() => {
          node.scrollIntoView({ block: "center" }); // 通过scrollIntoView方法将对应的dom元素定位到可见区域 【block: 'center'】这个属性是在垂直方向居中显示
        });
      }
      // 复现画框
      const target = draw.canvas._objects.find(
        (item) => item.classId === args.id
      );
      draw.canvas.setActiveObject(target).requestRenderAll();
    },
    /**
     *@Description: 删除标签
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    handleDelTag(data) {
      let index = this.treeData.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        this.treeData.splice(index, 1);
        this.tags.splice(index, 1);
        // 删除对应标注框
        const target = draw.canvas._objects.find(
          (item) => item.classId === data.id
        );
        draw.canvas.remove(target);
      }
      // 重新设置currentKey
      this.currentKey = this.treeData[0]?.id || "";
      this.$nextTick(() => {
        if (this.currentKey) {
          this.$refs.tree.setCurrentKey(this.currentKey);
        }
      });
    },

    /** 驳回列表删除 */
    handleDelTagBH(data) {
      let index = this.treeBHData.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        this.treeBHData.splice(index, 1);
        this.checkTags.splice(index, 1);
        // 删除对应标注框
        const target = draw.canvas._objects.find(
          (item) => item.classId === data.id
        );
        draw.canvas.remove(target);
      }
      // 重新设置currentKey
      this.currentKey = this.treeBHData[0]?.id || "";
      this.$nextTick(() => {
        if (this.currentKey) {
          this.$refs.tree.setCurrentKey(this.currentKey);
        }
      });
    },
    /**
     *@Description: OCR识别
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    OCRRecognition(data) {
      let stateImg = draw.cutRectToStateImg(data);
      this.$modal.loading("正在OCR识别，请稍候...");
      let formData = new FormData();
      formData.append("file", base64ToFile(stateImg));
      uploadImg(formData)
        .then((res) => {
          if (res.code === 200) {
            // 成功上传，获取id
            latexImage({ fileId: res.data })
              .then((res) => {
                this.$modal.closeLoading();
                if (res.code === 200) {
                  // OCR识别成功
                  data.contentText = res.data.data;
                }
              })
              .catch((err) => {
                this.$modal.closeLoading();
              });
          }
        })
        .catch((err) => {
          this.$modal.closeLoading();
        });
    },
    /**
     *@Description: 编辑标签
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    handleEditTag(data) {
      // console.log('编辑标签 data', data);
      this.currentKey = data.id;
      this.$refs.editpicture.open(data);
    },
    /**
     *@Description: 失去焦点，出发latex预览
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    blur(e, id) {
      katex.render(e.target.value, this.$refs[`katex_${id}_dom`][0], {
        throwOnError: false,
      });
    },
    /**
     *@Description: 插入Latex标签
     *@param {String} latexString - latex符号,
     *@param {Number} sortId - 索引,
     *@return {undefined} - 返回值描述
     */
    insetSymbol(latexString, id) {
      const _dom = document.getElementById(`katex_${id}_text`);
      const tree = this.treeData.find((item) => item.id === id);
      tree.contentText = `${tree.contentText.slice(
        0,
        _dom.selectionStart
      )}${latexString}${tree.contentText.slice(
        _dom.selectionEnd,
        tree.length
      )}`;
      this.blur({ target: { value: tree.contentText } }, id);
    },
    /**
     *@Description: 插入XML标签
     *@param {String} tag - 标签字符串,
     *@param {Number} sortId - 索引,
     *@return {undefined} - 返回值描述
     */
    insetTag(tag, id) {
      const _dom = document.getElementById(`katex_${id}_text`);
      // 字符串截取
      const tree = this.treeData.find((item) => item.id === id);
      const str = tree.contentText.slice(
        _dom.selectionStart,
        _dom.selectionEnd
      );
      tree.contentText = `${tree.contentText.slice(
        0,
        _dom.selectionStart
      )}<${tag}>${str}</${tag}>${tree.contentText.slice(
        _dom.selectionEnd,
        tree.contentText.length
      )}`;
      this.blur({ target: { value: tree.contentText } }, id);
    },
    /**
     *@Description: 保存
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     * 入参格式
     * let params = {
     *   jobId: 111,
     *   tags: [
     *     {
     *       tagName: '123',
     *       tagCoordinate: [{x: 11, y: 11}, {x: 22, y: 22}, ... ],
     *       tagContent: 'asdsad',
     *       topicNum: 1
     *     }
     *   ]
     * }
     */
    /** 上一题 */
    handlePre() {
      this.resetCanvas();
      this.jobId = this.upId;
      this.proId = "";
      this.getOCRJobDetail();
      this.upId = "";
    },
    /** 处理提交和保存参数 */
    handleTagsQuery(data) {
      return data.map((item, index) => {
        var coordinatesStr = JSON.stringify(item.coordinates);
        return {
          color: item.color,
          tagName: item.labelType,
          tagCoordinate: coordinatesStr,
          tagContent: item.contentText,
          topicNum: index + 1,
          tagType: item.tagType || "polygon",
          reason: item.reason,
          reasonIds: item.reasonIds,
        };
      });
    },
    // 保存
    handleSave() {
      this.saveLoading = true;
      const tags = this.handleTagsQuery(this.treeData);
      const checkTags = this.handleTagsQuery(this.treeBHData);

      let params = {
        jobId: this.jobId,
        tags,
        checkTags,
      };
      if (params.tags.length === 0 && params.checkTags.length === 0) {
        this.$message.error("请标注至少一条数据");
        this.saveLoading = false;
        return;
      }
      // 调保存接口
      saveJob(params)
        .then((res) => {
          this.saveLoading = false;
          if (res.code === 200) {
            this.$message.success("保存成功！");
          }
          this.activeName = "first";
        })
        .catch((err) => {
          this.saveLoading = false;
        });
    },
    /**
     *@Description: 提交
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    /** 清空画布和数据 */
    resetCanvas() {
      this.treeData = [];
      this.treeBHData = [];
      if (draw && draw.canvas) {
        draw.coordinates = {};
        draw.canvas.clear();
        draw.canvas.dispose();
      }
    },
    handleSubmit() {
      this.upId = null;
      this.subLoading = true;
      const tags = this.handleTagsQuery(this.allTreeData);
      // 清空驳回列表，全部都做标注框提交
      this.treeBHData = [];
      this.activeName = "first";
      let params = {
        jobId: this.jobId,
        tags,
      };

      if (params.tags.length === 0) {
        this.$message.error("请标注至少一条数据");
        this.subLoading = false;
        return;
      }
      // 调保存接口
      submitJob(params)
        .then((res) => {
          this.subLoading = false;
          if (res.code === 200) {
            this.$message.success("提交成功！");
            // 有下一题
            if (res.data.nextId) {
              this.jobId = res.data.nextId;
              this.$router.replace({
                path: "/marks/ocr/checkDetail",
                query: {
                  id: this.jobId,
                },
              });
              this.proId = "";
              this.upId = res.data.upId;

              this.resetCanvas();
              this.destroyCanvas = true;
              this.getOCRJobDetail();
            }
          }
        })
        .catch((err) => {
          this.subLoading = false;
        });
    },

    // 作废
    handleVoid() {
      this.$prompt("请输入作废原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (value) => {
          if (!value) {
            return "作废原因不能为空！";
          }
        },
      })
        .then(({ value }) => {
          voidJob({
            id: this.jobId,
            cancelDes: value,
          }).then((res) => {
            this.$message.success("作废成功！");

            // 有下一题
            if (res.data.nextId) {
              this.jobId = res.data.nextId;
              this.$router.replace({
                path: "/marks/ocr/jobDetail",
                query: {
                  id: this.jobId,
                },
              });
              this.proId = "";
              this.upId = res.data.upId;

              this.resetCanvas();
              this.destroyCanvas = true;
              this.getOCRJobDetail();
            }
          });
        })
        .catch(() => { });
    },
    hideLine() {
      this.ox = null;
      this.oy = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  gap: 30px;
  padding: 5px 10px 0 10px;
  line-height: 30px;
  align-items: center;

  .header-name,
  .header-id {
    font-size: 14px;
    color: #666;
  }

  .header-btns {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-left: auto;
  }
}

/* 点击树结构项的选中颜色 */
::v-deep .el-tree-node__content {
  .active {
    background: #bedfff;
  }
}

.container {
  width: 100%;
  height: inherit;
  display: flex;
  gap: 10px;
}

.tools_warp {
  width: 10%;
}

.pdf {
  width: 60%;
  height: 100vh;
  overflow: hidden;
}

.topic {
  width: 30%;
  height: 100vh;
  overflow-y: auto;
  padding: 10px;
  // padding-bottom: 200px;
  position: relative;
}

.footBtn {
  position: sticky;
  bottom: 0px;
  // left: 0;
  // right: 0;
}

.card_title {
  padding-bottom: 10px;
  clear: both;
  height: 30px;
}

.card_cont {
  height: 240px;
  overflow-y: scroll;
}

.table {
  margin-top: 10px;

  .head {
    // font-weight: 600;
    padding: 5px 0;
    display: flex;

    span {
      display: inline-block;
    }
  }

  .cont {
    display: flex;
    line-height: 2.5;
    color: #606266;
    font-size: 10px;
    border-bottom: 1px solid #f1f1f1;
    padding: 0 5px;
  }
}

.btnTxt {
  color: #1890ff;
  font-size: 10px;
  cursor: pointer;
  float: right;
}

.symbol {
  display: flex;
  align-items: center;
  gap: 10px;

  >span {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    cursor: pointer;
    text-align: center;
    background-color: #f4f4f4;
  }
}

.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.between {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.handlers {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.filter-tree {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
