<template>
  <div class="container">
    <div class="pdf" id="draw_wrap">
      <div class="header" v-if="details">
        <div class="header-name">图片名称：<span style="color: #1890ff;">{{ details.fileName }}</span></div>
        <div class="header-id">当前任务ID：<span style="color: #1890ff;">{{ details.id }}</span></div>
        <div class="header-btns">
          <el-button type="primary" class="prev" size="mini" :disabled="activeImgIndex === 0"
            @click="getCurrent('prev')">上一题</el-button>
          <span>
            <el-input-number v-model="topicIndex" controls-position="right" @change="handleImgIndexChange" :min="1"
              :max="jobIds.length" size="mini"></el-input-number>
            / {{ jobIds.length }}
          </span>
          <el-button type="primary" class="next" size="mini"
            :disabled="jobIds.length === 0 || activeImgIndex === jobIds.length - 1"
            @click="getCurrent('next')">下一题</el-button>
        </div>
      </div>
      <edit-picture v-if="!destroyCanvas" ref="editpicture" :taskType="'check'" :labList="labList" @createTag="createTag"
        @tagValueChange="tagValueChange" @del="handleDelete">
      </edit-picture>
    </div>
    <div class="topic">
      <el-collapse accordion>
        <el-collapse-item title="标注员信息" name="1">
          <p>
            <span>姓名：</span>
            <span>{{ jobNickName }}</span>
          </p>
        </el-collapse-item>
        <el-collapse-item :disabled="jobCheckLogs.length === 0">
          <template slot="title">
            <div class="between">
              <div>
                <span> 当前状态：</span>
                <span :class="`status-tag status-tag-jobStatus-${jobStatus}`">{{ jobStatusTxt }}</span>
              </div>
              <span class="btnTxt" v-if="jobCheckLogs && jobCheckLogs.length > 0">
                查看驳回记录
              </span>
            </div>
          </template>
          <div class="table" v-if="jobCheckLogs && jobCheckLogs.length > 0">
            <div style="width: 100%" class="head">
              <div style="width: 50%">日期</div>
              <div style="width: 25%">姓名</div>
              <div style="width: 25%">驳回原因</div>
            </div>
            <div v-for="(item, index) in jobCheckLogs" :key="index" class="cont" style="width: 100%">
              <div style="width: 50%">{{ item.cTime }}</div>
              <div style="width: 25%">{{ item.checkNickName }}</div>

              <el-tooltip placement="top">
                <div slot="content" class="tips_content">{{ item.checkNote }}</div>
                <div style="width: 25%;overflow: hidden;">{{ item.checkNote | limitWords }}</div>
              </el-tooltip>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <p></p>
      <!-- 项目配置区 -->
      <el-card>
        <div class="between">
          <span>当前操作类型： {{ currentMarkTypeTxt }}</span>
          <el-tooltip placement="top">
            <div slot="content" class="content">
              <div class="table_tit" style="margin-bottom: 10px;">功能快捷键：</div>
              <table border="1" style="width: 100%;">
                <tr>
                  <th>快捷键</th>
                  <th>功能</th>
                </tr>
                <tr>
                  <td>Q</td>
                  <td>矩形</td>
                </tr>
                <tr>
                  <td>W</td>
                  <td>多边形</td>
                </tr>
                <tr>
                  <td>E</td>
                  <td>选中</td>
                </tr>
                <tr>
                  <td>R</td>
                  <td>多线段</td>
                </tr>
                <tr>
                  <td>选中+D</td>
                  <td>删除</td>
                </tr>
                <tr>
                  <td>ctrl + 单击或鼠标中建</td>
                  <td>移动画布</td>
                </tr>
                <tr>
                  <td>ctrl + s</td>
                  <td>保存</td>
                </tr>
                <tr>
                  <td>ctrl + shift + s</td>
                  <td>提交</td>
                </tr>
                <tr>
                  <td>鼠标滚轮</td>
                  <td>缩放画布</td>
                </tr>
              </table>
              <div class="table_tit" style="margin:10px 0;">标签快捷键：</div>
              <table border="1" style="width: 100%;">
                <tr>
                  <th>快捷键</th>
                  <th>功能</th>
                </tr>
                <tr v-for="(item, index) in labList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.dictLabel }}</td>
                </tr>
              </table>
            </div>
            <el-button type="text" icon="el-icon-question" style="font-size: 10px;">快捷键说明</el-button>
          </el-tooltip>
        </div>
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(item, index) in proConfigData" :key="index" :title="item.label" :name="item.value">
            <template slot="title">
              {{ item.label }}
              <span style="margin-left: 20px;" :style="{ color: item.color }">{{ item.radioLabel }}</span>
            </template>
            <el-form :mode="labelType">
              <el-form-item prop="titleType">
                <el-radio-group v-model="item.radioLabel" size="mini" style="margin-top: 20px"
                  @change="handleChangeRadio($event, item.value)">
                  <el-radio v-for="item in item.radios" :key="item.value" :label="item.label"
                    style="margin-right: 40px; margin-bottom: 20px" :style="{ color: item.color }">{{ item.label
                    }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <p></p>
      <el-card>
        <!-- <div class="between">
          <span>当前操作类型： {{ currentMarkType }}</span>
          <el-tooltip placement="top">
            <div slot="content" class="content">
              <div class="table_tit" style="margin-bottom: 10px;">功能快捷键：</div>
              <table border="1" style="width: 100%;">
                <tr>
                  <th>快捷键</th>
                  <th>功能</th>
                </tr>
                <tr>
                  <td>Q</td>
                  <td>矩形</td>
                </tr>
                <tr>
                  <td>W</td>
                  <td>多边形</td>
                </tr>
                <tr>
                  <td>E</td>
                  <td>选中</td>
                </tr>
                <tr>
                  <td>选中+D</td>
                  <td>删除</td>
                </tr>
                <tr>
                  <td>ctrl + 单击</td>
                  <td>移动画布</td>
                </tr>
                <tr>
                  <td>鼠标滚轮</td>
                  <td>缩放画布</td>
                </tr>
              </table>
              <div class="table_tit" style="margin:10px 0;">标签快捷键：</div>
              <table border="1" style="width: 100%;">
                <tr>
                  <th>快捷键</th>
                  <th>功能</th>
                </tr>
                <tr v-for="(item, index) in labList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.dictLabel }}</td>
                </tr>
              </table>
            </div>
            <el-button type="text" icon="el-icon-question" style="font-size: 10px;">快捷键说明</el-button>
          </el-tooltip>
        </div> -->

        <!-- <div>当前选择标签类型：</div>
        <el-form :mode="labelType">
          <el-form-item prop="titleType">
            <el-radio-group v-model="labelType.value" size="mini" style="margin-top: 20px" @change="handleChangeRadio">
              <el-radio v-for="item in labList" :key="item.dictCode" :label="item.dictLabel" :name="item.dictLabel"
                style="margin-right: 40px; margin-bottom: 20px" :style="{ color: item.remark }" :fill="currentTagColor"
                :text-color="item.remark"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form> -->

        <div style="margin-bottom: 20px;">驳回理由提交：</div>
        <el-form :model="reasonParams" ref="queryForm">
          <el-form-item prop="reasonIds">
            <el-checkbox-group v-model="reasonParams.reasonIds" size="mini">
              <el-checkbox v-for="dict in dict.type.ocr_reject_reason" :key="dict.dictCode" :label="dict.label">{{
                dict.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="reason">
            <el-input type="textarea" v-model="reasonParams.reason" placeholder="请输入其他驳回理由" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain size="mini" @click="handleResonSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <p></p>
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="标注框列表" name="first">
            <el-tree ref="tree" show-checkbox class="filter-tree" :data="treeData" node-key="id" :highlight-current="true"
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
                    <el-popover placement="top" width="160" :ref="`popoverRef-${data.id}`" trigger="hover">
                      <p>确定修改标签吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini" @click="handleEditTag(data)">确定</el-button>
                      </div>
                      <i class="el-icon-edit" slot="reference"></i>
                    </el-popover>

                    <el-popover placement="top" width="160" trigger="hover" :ref="`popoverRef-${data.id}`">
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
          <el-tab-pane label="驳回框列表" name="second">
            <el-tree ref="treeRef" class="filter-tree" :data="treeBHData" node-key="id" :highlight-current="true"
              :current-node-key="currentKey" :props="{
                children: 'children',
                label: 'label'
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
                        <el-button size="mini" type="text" @click="data.isShowPop = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleEditTag(data)">确定</el-button>
                      </div>
                      <i class="el-icon-edit" slot="reference"></i>
                    </el-popover>
                    <el-popover placement="top" width="160" :ref="`popoverRef-${data.id}`" trigger="hover">
                      <p>确定删除标注框吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="data.isShowPop = false">取消</el-button>
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
      <template v-for="tree in allTreeData">
        <el-card v-show="currentKey === tree.id">
          <div slot="header" class="clearfix">
            <span style="float: left"> {{ tree.labelType }} </span>
          </div>
          <div class="content">
            <el-input :id="`katex_${tree.id}_text`" type="textarea" rows="5" v-model="tree.contentText"
              :placeholder="`请录入`" :spellcheck="false" @blur="(e) => blur(e, tree.id)"></el-input>
            <p>LaTex预览</p>
            <div v-katex="tree.contentText ? tree.contentText : ''" readonly :ref="`katex_${tree.id}_dom`"
              style="margin-bottom: 20px" />
          </div>
        </el-card>
      </template>
      <p></p>
      <el-card class="footBtn">
        <el-row>
          <el-col align="left"> </el-col>
          <el-col align="right">
            <el-button size="mini" v-if="jobStatus === '5'" @click="handleSave()" type="primary" plain>质检修改</el-button>
            <el-button size="mini" @click="handleSubmit('4')" type="primary"
              v-if="jobStatus === '5' && checkPermi(['imgJob:passJob'])" :disabled="treeBHData.length > 0">通过</el-button>
            <el-button size="mini" @click="handleNext()" type="primary" v-if="nextId">下一题</el-button>
            <el-button size="mini" @click="openDialog()" type="danger"
              v-if="jobStatus === '5' && checkPermi(['imgJob:passJob'])">驳回</el-button>
            <el-button v-if="jobStatus === '5' && checkPermi(['imgJob:cancel'])" size="mini" type="danger" plain
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
import { deepClone } from "@/utils";
import draw from "@/views/marks/ocr/components/editpicture/draw";
import EditPicture from "@/views/marks/ocr/components/editpicture/index.vue";
import { imgDetail, saveJob, submitJob, voidJob, imgTagsCheck } from "@/api/project/imgCheck";

export default {
  name: "ocrCheckDetail",
  components: {
    EditPicture,
  },
  computed: {
    allTreeData() {
      return this.treeData.concat(this.treeBHData)
    },
    toolsLabel() {
      let arrs = this.proConfigData.find(item => item.value === 'project_tools')
      if (arrs) {
        return arrs.radios?.map(item => {
          return {
            label: item.label,
            value: item.value
          }
        })
      } else {
        return []
      }
    },
    activeImgIndex() {
      return this.topicIndex - 1
    }
  },
  dicts: ['ocr_reject_reason'],
  data() {
    return {
      activeNames: [],
      reasonOptions: [],
      checkReasonData: [],
      activeName: 'first',
      reasonParams: {
        reasonIds: [],
        reason: ''
      },
      jobId: this.$route.query.id,
      proId: this.$route.query.proId,
      nextId: null,
      jobNickName: "",
      phone: "",
      jobStatusTxt: "",
      jobStatus: '',
      showList: false,
      // 驳回原因
      checkNote: "",
      upId: null,
      imgUrl: null,
      treeBHData: [],
      treeData: [],
      checkTags: [],
      jobCheckLogs: [],
      labList: [],
      jobTypeOptions: [],
      tags: [],
      currentTagColor: '', // 当前选择标签颜色
      currentMarkType: '', // 当前绘制框的类型
      currentMarkTypeTxt: '', // 当前绘制框的类型说明
      labelType: {
        value: "",
      },
      currentKey: "", // 树列表当前选定的id
      currentIndex: 0, // 树列表当前选定的下标
      currObj: {}, // 当前选择的对象
      // 保存加载
      saveLoading: false,
      // 提交加载
      subLoading: false,
      destroyCanvas: true,
      proConfigData: [],
      proConfigForm: {},
      keyCodes: [], // 快捷键集合
      details: null,
      topicIndex: 1,
      jobIds: []  // 任务id集合
    };
  },
  watch: {
    currentKey: {
      handler: function (val) {
        if (val) {
          this.currObj = this.allTreeData.find(item => item.id === val)
        }
      }
    }
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
      str = str.length > 5 ? str.substr(0, 5) + '...' : str;
      return str;
    }
  },
  mounted() {
    this.initData();
    // if (!this.jobId && !this.proId) return this.$router.back();
    this.getDetail();
    // 监听自定义选中事件  selectObject
    document.addEventListener("selectObject", (event) => {
      this.tagSelectedChange(event.detail.classId)
    });

    // 监听快捷键事件
    window.addEventListener('keydown', this.handleKeyDown);
    this.keycodeEvent()
    // 记录页面进入详情页
    sessionStorage.setItem('markDetail', true)

    // 监听按键功能
    this.keycodeEvent()
  },
  destroyed() {
    this.$modal.closeLoading()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    // window.addEventListener('keyup', this.handlekeyup);
  },
  methods: {
    handleImgIndexChange() {
      this.jobId = this.jobIds[this.activeImgIndex];
      this.resetCanvas()
      this.getDetail()
    },
    getCurrent(type) {
      this.resetCanvas();
      if (type === 'prev') {
        this.topicIndex = this.topicIndex - 1;
      } else {
        this.topicIndex = this.topicIndex + 1;
      }
      this.jobId = this.jobIds[this.activeImgIndex];
      // 下一题
      console.log(this.jobId);
      this.getDetail()
    },
    initData(dictTypes) {
      this.getDicts("project_config").then(async (response) => {
        /* 1、根据dictTypes获取对应的字典集合 */
        let list = response.data?.filter(item => dictTypes?.indexOf(item.dictValue) > -1)

        let result = [];
        result = await Promise.all(
          list.map(async (item) => {

            return {
              label: item.dictLabel,
              value: item.dictValue,
              dictData: await this.getDicts(item.dictValue)
            }
          })
        );
        console.log('result', result);
        /* 2、根据选择的配置项回显单选框 */
        this.proConfigData = result.map(item => {

          let checks = this.proConfigForm[item.value]

          let datas = item.dictData.data.filter(o => checks.indexOf(o.dictValue) > -1)

          let radios = datas.map(radio => {

            let keyCode
            if (radio.remark) {
              keyCode = JSON.parse(radio.remark).keyCode
            }
            return {
              label: radio.dictLabel,
              value: radio.dictValue,
              color: radio.cssClass,
              keyCode
            }
          })
          let keyCodes = radios.map(code => {
            return {
              taglabel: code.label,
              tagValue: code.value,
              keycode: code.keyCode,
              tags: item.value
            }
          })
          return {
            ...item,
            dictData: datas,
            radios,
            radioLabel: '',
            radioValue: '',
            keyCodes
          }
        })

        /* 3、处理所有的快捷键 */
        let keyCodes = this.proConfigData.map(item => item.keyCodes)
        if (keyCodes.length > 0) {
          var arr2 = keyCodes?.reduce(function (a, b) { return a.concat(b) });
          this.keyCodes = arr2
        }
      });
    },
    handleChangeRadio(value, type) {
      // console.log('handleChangeRadio', value, type);
      let radios = this.proConfigData.find(item => item.value === type).radios
      let val = radios.find(k => k.label === value).value
      console.log(radios, val);
      if (type === 'project_tools') {
        this.$refs.editpicture?.handlerClick(val);

        // 配置标签类型的快捷键
      } else if (type === 'project_tag') {
        this.$refs.editpicture?.handleTagType(val);

      }
    },
    keycodeEvent() {
      this.$shortcuts.add([
        {
          shortcut: "ctrl+c", //支持大小写
          handler: (event) => {
            console.log('ctrl+c', event);
            // draw.handleCopy()
          },
        },
        {
          shortcut: "ctrl+v", //支持大小写
          handler: (event) => {
            console.log('ctrl+v', event);
            // draw.handlePase()
          },
        },
        {
          shortcut: "d", //支持大小写
          handler: (event) => {
            console.log('d', event);
            draw.handleDelete()
            this.currentIndex = 0
            // draw.handlePase()
          },
        },
        {
          shortcut: "ctrl+s", //保存
          handler: (event) => {
            event.preventDefault()
            this.handleSave()
            // console.log('ctrl+s', event);
            // draw.handlePase()
          },
        }, {
          shortcut: "ctrl+shift+s", //提交
          handler: (event) => {
            event.preventDefault()
            this.handleSubmit()
            // console.log('ctrl+v', event);
            // draw.handlePase()

            window.event.returnValue = false;
          },
        },
        {
          shortcut: "Up", //支持大小写
          handler: (event) => {
            event.preventDefault()
            this.handleKeyDownByupAndDown('up')
          },
        },
        {
          shortcut: "Down", //支持大小写
          handler: (event) => {
            event.preventDefault()
            this.handleKeyDownByupAndDown('down')

          },
        },
      ]);
    },
    // 快捷键up和down
    handleKeyDownByupAndDown(type) {
      draw.currentType = "select"
      this.changeType('select')
      let list = this.treeData
      let len = this.treeData.length - 1

      if (type === 'up') {
        if (this.currentIndex === 0 || this.currentIndex < 0) {
          return
        }
        this.currentIndex--
      } else {
        if (this.currentIndex === len || this.currentIndex > len) {
          return
        }
        this.currentIndex++
      }
      let currObj = list[this.currentIndex]

      if (currObj) {
        this.currObj = currObj
      }
      this.currentKey = this.currObj.id

      this.getCurrentKey(this.currObj, this.currentIndex)

    },
    /** 绘制类型切换 */
    changeType(type) {
      let text = ''
      switch (type) {
        case 'select':
          text = '选中元素'
          break;
        case 'rect':
          text = '绘制矩形'
          break;
        case 'polygon':
          text = '绘制多边形'
          break;
      }
      this.currentMarkType = text
    },
    // 处理气泡弹框重复的问题
    handlePopover(data) {
      console.log(data);
      if (this.activeName === 'first') {

        this.$nextTick(() => {
          this.treeData.forEach(item => {
            if (item.id === data) {
              item.isShowPop = true
            } else {
              item.isShowPop = false
            }
          })
        })
      } else {
        this.$nextTick(() => {
          this.treeData.forEach(item => {
            if (item.id === data) {
              item.isShowPop = true
            } else {
              item.isShowPop = false
            }
          })
        })
      }

    },
    handleKeyDown(event) {
      // console.log(event.keyCode);
      /** 公用快捷键设置 */
      if (event.keyCode === 27) {
        // esc 取消未完成的绘制对象
        draw.handleCancleDraw();
      } else if (event.keyCode === 32) {
        // 空格 完成绘制
        draw.handleFinishDraw();
      }

      let downTags = ''
      let downValue = ''
      this.keyCodes.forEach(item => {

        if (Number(event.keyCode) === Number(item.keycode)) {
          // 配置标注工具快捷键
          if (item.tags === 'project_tools') {
            this.$refs.editpicture?.handlerClick(item.tagValue);

            // 配置标签类型的快捷键
          } else if (item.tags === 'project_tag') {
            this.$refs.editpicture?.handleTagType(item.tagValue);
          }

          downTags = item.tags
          downValue = item.taglabel
        }

      })

      // 改变当前页面的属性选择状态
      this.proConfigData.forEach(item => {
        if (item.value === downTags) {
          item.radioLabel = downValue

        }
      })

      draw.canvas.discardActiveObject().requestRenderAll();

    },
    /**
     *@Description: 获取详情
     *@return {undefined} - 返回值描述
     */
    async getDetail() {
      this.$modal.loading('数据加载中...')
      // this.resetCanvas();
      let response = await this.getDicts("t_job_type");
      this.jobTypeOptions = response.data;
      let res = await imgDetail({ id: this.jobId, projectId: this.proId });
      let { labList, tags, fileId, id, jobStatus, jobNickName, jobCheckLogs, checkTags, dictTypes } =
        res.data;
      this.details = res.data;
      this.jobIds = res.data.projectJobList || []; // 所有任务id
      this.topicIndex = res.data.projectJobIndex + 1;
      this.jobStatus = jobStatus.toString()
      this.jobStatusTxt = this.jobTypeOptions?.find(
        (item) => item.dictValue === jobStatus.toString()
      ).dictLabel;
      this.jobNickName = jobNickName;
      this.jobCheckLogs = jobCheckLogs;
      // 驳回列表回显
      checkTags = checkTags.map((item, index) => {
        return {
          ...item,
          index: index + 1
        }
      })

      this.initData(dictTypes)
      dictTypes?.forEach(item => {
        this.proConfigForm[item] = res.data[item]
      })
      this.dictTypes = dictTypes

      this.jobId = id;
      this.labList = labList.map((item, index) => {
        return {
          ...item,
          color: item.remark,
          keyCode: index + 49
        }
      });
      this.handleTagsData(tags)
      this.handleTagsData(checkTags)
      console.log(tags);
      this.checkTags = checkTags;
      this.tags = tags;
      // 此处赋值必须深拷贝一下，不然input无法渲染双向绑定！！！
      this.treeData = deepClone(this.tags);
      this.treeBHData = deepClone(this.checkTags);

      await this.$nextTick();
      this.currentKey = this.treeData[0]?.id;
      // 当前对象默认第一个
      this.currObj = this.treeData[this.currentIndex];
      this.destroyCanvas = false;




      // 加载背景图
      this.initImg(fileId)

    },
    /** 驳回列表回显禁用 */
    disabledFn() {
      return false
    },
    /** 初始化画布数据 */
    handleTagsData(tags) {
      tags = tags.filter(item => item.tagType !== 'select')
      tags.forEach((item, index) => {

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
          item.contentText = item.tagContent === null ? '' : item.tagContent;
          item.coordinates = item.tagCoordinate;
          item.label = item.tagName + item.topicNum;
          item.labelType = item.tagName;
          item.color = this.labList.find(k => k.dictLabel === item.tagName)?.remark
          item.index = index + 1 // 新增下标
          item.isShowPop = false // 控制气泡框显示
          item.disabled = false
          if (item.reason || item.reasonIds) {
            item.reasonTxt = item.reasonIds + item.reason
          }

        }
      });
    },
    /** 背景图初始化 */
    initImg(fileId) {
      let that = this;
      // 设置画布的宽高
      const box = document.querySelector(".pdf");
      let width = box.getBoundingClientRect().width;
      let height = box.getBoundingClientRect().height;
      const img = new Image();
      img.src = process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
      img.onload = function (res) {
        if (res) {
          that.$modal.closeLoading()
          draw.init(
            "draw",
            width,
            height,
            process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId,
            async function () {
              await that.$nextTick();
              if (draw.canvas) {
                that.$refs.tree.setCurrentKey(that.treeData[0]?.id);
                let data = that.treeData.concat(that.treeBHData)
                data.forEach(item => {
                  if (item.tagType === 'rect') {
                    draw.createRectByPoints(item.coordinates, item.id, item.color)
                  } else if (item.tagType === 'polygon') {
                    draw.createPolygonByPoints(item.coordinates, item.id, item.color)
                  } else if (item.tagType === 'polyline') {
                    draw.createPolylineByPoints(item.coordinates, item.id, item.color)
                  }
                })
              }
            }
          );
        }
      };
    },
    /**
     *@Description: 新增标签
     *@param {Object} args - 回调参数,
     *@return {undefined} - 返回值描述
     */
    async createTag(args) {
      this.labelType.value = args.labelType
      this.currentTagColor = args.color
      // 判断ID是否已存在，已存在编辑，未存在新增
      let data = this.activeName === 'first' ? this.treeData : this.treeBHData
      let isEdit = data?.some(item => item.id === args.id)
      // console.log(isEdit ? '编辑' : '新增', this.tags);
      if (isEdit) {
        await this.$nextTick()
        // 标注框编辑
        if (this.activeName === 'first') {
          this.tags.forEach(item => {
            if (item.id === args.id) {
              item.labelType = args.labelType
              item.label = args.labelType
              item.tagName = args.labelType
              item.color = args.color

            }
          })

          this.treeData = deepClone(this.tags)
        } else {
          // 驳回框编辑
          this.checkTags.forEach(item => {
            if (item.id === args.id) {
              item.labelType = args.labelType
              item.label = args.labelType
              item.tagName = args.labelType
              item.color = args.color
            }
          })
          this.treeBHData = deepClone(this.checkTags)
        }
        // 重新渲染目标元素
        draw.resetObjectBorderColor(args.id, args.color)
      } else {
        let index = this.treeData.length ? this.treeData[this.treeData.length - 1].index + 1 : 1
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
          disabled: true  // 质检新增的驳回框不可选择驳回
        }
        this.labelType.value = args.labelType
        this.treeData.push(obj);
        this.tags.push(obj);

        // 回显当前新增的标签类型
        this.proConfigData.forEach(item => {
          if (item.value === 'project_tag') {
            item.radioLabel = args.labelType
            item.radioValue = args.tagType
          }
        })
      }
      this.currentKey = args.id;
      // 设置高亮选中
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(args.id);
        draw.resetObjectBorderColor(args.id, args.color)
      });
    },
    /**
     *@Description: 联动选中框，树高亮
     *@param {Number} id - 对应树节点id,
     *@return {undefined} - 返回值描述
     */
    tagSelectedChange(id) {
      this.currentKey = id;
      if (this.currentKey) {
        // 设置高亮选中
        this.$nextTick(() => {
          this.$refs.tree?.setCurrentKey(id);
        });
      }
    },
    /**
     *@Description: 联动选中框，树高亮，数据修改
     *@param { Object | Array} obj - 对应树节点信息,
     *@return {undefined} - 返回值描述
     */
    tagValueChange(obj) {
      console.log('获取的tagValueChange', obj);
      let { id, data } = obj
      this.currentKey = id
      // 设置高亮选中
      this.$nextTick(() => {
        this.$refs.tree?.setCurrentKey(id);
      });
      // 修改树结构数据attributes ...
      this.treeData.forEach((item, index) => {
        if (item.id === id) {
          item.coordinates = data[0];
        }
      });
    },
    /** 绘制类型切换 */
    changeType(type) {
      console.log(type);
      let text = ''
      switch (type) {
        case 'select':
          text = '选中元素'
          break;
        case 'rect':
          text = '绘制矩形'
          break;
        case 'polygon':
          text = '绘制多边形'
          break;
      }
      this.currentMarkType = text
    },
    /** 删除 */
    handleDelete(classId) {
      this.currentIndex = 0
      let index = this.treeData.findIndex(item => item.id == classId)
      this.treeData.splice(index, 1)
      this.tags.splice(index, 1)
    },
    /**驳回列表删除 */
    handleBHDelete(classId) {
      let index = this.treeBHData.findIndex(item => item.id == classId)
      this.treeBHData.splice(index, 1)
      this.checkTags.splice(index, 1)
    },
    /**
     *@Description: 点击标签，回显表单
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    getCurrentKey(args) {
      let index = this.treeData.findIndex(item => item.id === args.id)
      this.currentIndex = index
      this.currentKey = args.id;
      draw.currentType = "select";
      this.changeType('select')
      this.currentKey = args.id;
      // 滚动条设置
      // 回显中间的位置
      const node = document.getElementById(args.id) // 通过Id获取到对应的dom元素
      if (node) {
        this.$nextTick(() => {
          node.scrollIntoView({ block: 'center' }) // 通过scrollIntoView方法将对应的dom元素定位到可见区域 【block: 'center'】这个属性是在垂直方向居中显示
        })
      }
      // 复现画框
      const target = draw.canvas._objects.find(item => item.classId === args.id)
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
     *@Description: 编辑标签
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    handleEditTag(data) {
      this.currentKey = data.id
      this.$refs.editpicture.open(data);
    },
    /**
     *@Description: 失去焦点，出发latex预览
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
     */
    blur(e, id) {
      katex?.render(e.target.value, this.$refs[`katex_${id}_dom`][0], {
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
      this.getDetail();
      this.upId = "";
    },
    /** 处理tags传参 */
    handleTagsQuery(data) {
      return data.map((item, index) => {
        var coordinatesStr = JSON.stringify(item.coordinates);
        return {
          tagName: item.labelType,
          tagCoordinate: coordinatesStr,
          tagContent: item.contentText,
          topicNum: index + 1,
          tagType: item.tagType || "polygon",
          reason: item.reason,
          reasonIds: item.reasonIds
        };
      });

    },
    /** 质检修改 */
    handleSave() {
      this.saveLoading = true;
      const tags = this.handleTagsQuery(this.treeData)
      const checkTags = this.handleTagsQuery(this.treeBHData)
      let params = {
        jobId: this.jobId,
        tags,
        checkTags
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
            this.$message.success("修改成功！");
            // this.destroyCanvas = true;
            // this.getDetail();
          }
        })
        .catch((err) => {
          this.saveLoading = false;
        });
    },
    /**
     *@Description: 提交
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
    /** 清空画布和数据 */
    resetCanvas() {
      this.treeData = [];
      if (draw && draw.canvas) {
        draw.coordinates = {};
        draw.canvas.clear();
        // this.destroyCanvas = true;
        draw.canvas.dispose();
      }
    },
    handleSubmit(status) {
      this.upId = null;
      this.nextId = null;
      this.subLoading = true;
      let params = {
        jobId: this.jobId,
        jobStatus: status, //4通过 9驳回
        checkNote: this.checkNote,
      };
      if (this.allTreeData.length === 0) {
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
            // this.nextId = res.data.nextId;
            // this.proId = "";
            // this.checkNote = "";
            // this.upId = res.data.upId;
            // this.resetCanvas();
            this.getDetail();
          }
        })
        .catch((err) => {
          this.subLoading = false;
        });
    },
    /** 下一题 */
    handleNext() {
      this.jobId = this.nextId;
      this.proId = "";
      this.nextId = null;
      this.checkNote = "";

      this.resetCanvas();
      this.getDetail();
    },
    /** 驳回原因弹框 */
    openDialog() {
      this.$prompt("请输入驳回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (value) => {
          if (!value) {
            return "驳回原因不能为空！";
          }
        },
      })
        .then(({ value }) => {
          this.checkNote = value;
          this.handleSubmit('9');
        })
        .catch(() => { });
    },
    // 提交驳回原因
    handleResonSubmit() {
      // 获取选择的框
      let classIds = this.$refs.tree.getCheckedKeys() || []

      let { reason, reasonIds } = this.reasonParams
      if (classIds.length === 0) {
        this.$modal.msgWarning('请至少选择一个框')
      } else if (reason === '' && reasonIds.length === 0) {
        this.$modal.msgWarning('请至少选择一个驳回理由')
      } else {

        let params = {
          id: this.jobId,
          classIds: classIds.join(','),
          reasonIds: reasonIds.join(','),
          reason,
        }

        imgTagsCheck(params).then(res => {
          this.reasonParams.reasonIds = []
          this.reasonParams.reason = ''

          this.resetCanvas();
          this.destroyCanvas = true;
          this.getDetail();
        })
      }

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
            cancelDes: value
          }).then(res => {
            this.$message.success('作废成功！')
            // this.nextId = res.data.nextId;
            // this.proId = "";
            // this.checkNote = "";
            // this.upId = res.data.upId;
            this.resetCanvas();
            this.getDetail();
          })
        })
        .catch(() => { });

    }
  },
};
</script>

<style lang="scss" scoped>
// .content {
//   width: 200px;
// }

.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card__body {
  padding: 10px;
}

.table_tit {
  margin: 10px 0;
}

.header {
  display: flex;
  gap: 30px;
  padding: 5px 10px 0 10px;
  line-height: 30px;
  align-items: center;

  .header-name,
  .header-id {
    font-size: 14px;
    color: #666
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
    background: #BEDFFF;
  }
}

.tips_content {
  width: 200px;
}

.container {
  width: 100%;
  height: inherit;
  display: flex;
  gap: 10px;
}

.pdf {
  width: 70%;
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

.el-collapse {
  border: none;
}

.footBtn {
  position: sticky;
  bottom: 0px;
  z-index: 99;
  // left: 0;
  // right: 0;
}

.card_title {
  padding-bottom: 10px;
  clear: both;
  height: 30px
}

.card_cont {
  height: 240px;
  overflow-y: scroll;
}

.table {
  margin-top: 10px;

  .head {
    // font-weight: 600;
    display: flex;
    padding: 5px 0;

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
  margin-left: 20px;
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

.between {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
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
</style>
