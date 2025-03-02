<template>
  <div class="container">
    <p class="pagetitle">
      <span class="line">|</span>
      <span>{{ pagetitle }}</span>
    </p>
    <el-row>
      <el-col :span="24">
        <el-form :model="form" ref="projectDetails" size="mini" statu-icon label-width="120px" :rules="rules"
          label-position="right">
          <el-row :gutter="100">
            <el-col :span="12" v-for="conf in formConfig" :key="conf.key">
              <el-form-item :prop="conf.key" :label="conf.label">
                <el-input v-if="conf.type === 'input'" type="text" v-model="form[conf.key]"
                  :placeholder="conf.placeholder">
                  <b v-if="conf.unit" slot="suffix">{{ conf.unit }}</b>
                </el-input>
                <el-upload v-if="conf.type === 'file'" class="upload-demo" :action="uploadUrl" multiple
                  :file-list="form.projectFile" :on-success="uploadSuccess">
                  <el-button size="mini" type="primary">
                    <span>点击上传</span>
                    <i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </el-upload>
                <el-select v-else-if="conf.type === 'select'" type="text" 
                  :disabled="id && conf.key === 'projectType' || conf.disabled ? true : false" v-model="form[conf.key]"
                  :placeholder="conf.placeholder">
                  <el-option v-for="option in conf.options" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
                </el-select>
                <el-date-picker v-if="conf.type === 'date'" v-model="form[conf.key]" type="date" value-format="yyyy-MM-dd"
                  :placeholder="conf.placeholder"></el-date-picker>
                <!-- 2d ocr用 -->
                <el-button type="primary" v-if="conf.type === 'button'" @click="handleShowProDialog">{{
                  conf.placeholder }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div class="edit-wrap" v-if="id">
      <p class="pagetitle">
        <span class="line">|</span>
        <span>项目关联信息</span>
      </p>
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="标注员名单" name="marker">
          <el-card shadow="hover" v-if="tabSHow">
            <TabPane :showHeader="true" :pagination="markerPage" :isEdit="true" :data="markersData" :archive="true"
              :dataConfig="markersDataConfig" icon="el-icon-plus" add="新增标注员" @add="addUsers"
              @delete="row => deleteRow(row, 'markersData')" @paginationChange="markerPaginationChange"
              @filter="markersDataFilter"></TabPane>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="质检员名单" name="checker">
          <el-card shadow="hover" v-if="tabSHow">
            <TabPane :showHeader="true" :pagination="checkerPage" :isEdit="true" :data="checkersData" :archive="true"
              :dataConfig="checkersDataConfig" icon="el-icon-plus" add="新增质检员" @add="addUsers"
              @delete="row => deleteRow(row, 'checkersData')" @paginationChange="checkerPaginationChange"
              @filter="checkersDataFilter"></TabPane>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="文件管理" name="file">
          <el-card shadow="hover" v-if="tabSHow">
            <TabPane :showHeader="true" ref="fileTable" :selectable="true" :isEdit="true" :data="filesData" :archive="true"
              :pagination="filePage" :dataConfig="filesDataConfig" icon="el-icon-folder-add" add="新增文件" @add="addUsers"
              @delete="row => deleteRow(row, 'filesData')" @paginationChange="filePaginationChange"
              @filter="searchProjectFiles" @select-change="taskSelectChange" @createTask="createTask">
            </TabPane>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
    <p></p>
    <el-form>
      <el-form-item align="right">
        <el-button type="default" size="mini" @click="back">返回</el-button>
        <el-button v-if="id" type="primary" size="mini" :loading="saveLoading" @click="saveForm">保存</el-button>
        <el-button v-else type="primary" size="mini" :loading="subLoading" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹框区 -->
    <el-dialog :visible.sync="showAddCheckers" :title="title" @close="cancelSelection" width="70%">
      <!-- 表单区 -->
      <el-row v-if="activeName === 'file'">
        <el-form :model="searchFileCondition" ref="searchForm" inline>
          <el-form-item prop="likeCheckNickName" label="文件名">
            <el-input v-model="searchFileCondition.likeFileName" placeholder="输入用户名搜索" size="mini" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item prop="batchNumber" label="批次号">
            <el-select size="mini" v-model="searchFileCondition.groupLabel" placeholder="请选择批次号">
              <el-option v-for="dict in groupLabels" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" size="mini" @click="searchNewFile" icon="el-icon-search">搜索</el-button>
            <el-button type="default" size="mini" @click="resetSearchNewFile" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-else>
        <el-form :model="searchUserCondition" ref="searchForm" inline>
          <el-col :span="8">
            <el-form-item prop="userName" label="用户名">
              <el-input v-model="searchUserCondition.userName" placeholder="输入用户名搜索" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item prop="phonenumber" label="手机号">
              <el-input v-model="searchUserCondition.phonenumber" placeholder="输入手机号搜索" size="mini"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="16" align="right">
            <el-form-item>
              <el-button type="primary" size="mini" @click="getAllFiles" icon="el-icon-search">搜索</el-button>
              <el-button type="default" size="mini" @click="resetSearch" icon="el-icon-refresh">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <!-- 表格区 -->
      <el-table v-if="activeName === 'file'" ref="selectionTable" v-loading="userLoading" :data="files"
        :row-key="getRowKey" @selection-change="handleSelectionChange" height="500">
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable" width="55" fixed>
        </el-table-column>
        <el-table-column prop="fileId" label="文件ID"></el-table-column>
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column prop="tags" label="标签"></el-table-column>
        <!-- <el-table-column prop="groupLabel" label="批次"></el-table-column> -->
        <el-table-column prop="cTime" label="创建时间" width="200"></el-table-column>
      </el-table>
      <el-table v-else ref="selectionTable" v-loading="userLoading" :data="users" :row-key="getRowKey"
        @selection-change="handleSelectionChange" height="500">
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable" width="55"
          fixed></el-table-column>
        <el-table-column prop="userId" label="用户编号"></el-table-column>
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="deptId" label="部门"></el-table-column>
        <el-table-column prop="phonenumber" label="手机号码"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
      </el-table>

      <p></p>
      <el-row>
        <el-col align="right">
          <el-pagination @size-change="handleUsersSizeChange" @current-change="handleUsersCurrentChange"
            :current-page="currentUsersPage" :page-sizes="[5, 10, 20, 50]" :page-size="usersPageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="usersTotal">
          </el-pagination>
        </el-col>
      </el-row>
      <p></p>
      <el-row>
        <el-col align="right">
          <el-button type="primary" size="mini" @click="confirmSelection">确定</el-button>
          <el-button type="default" size="mini" @click="cancelSelection">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 项目配置弹框 -->
    <ProDialogconfig ref="proDialogRef" :visible.sync="showProDialog" :config="projectDialogData"
      :projectType="form.projectType" :proDetail="proDetailConfig" :loading="dialogLoading" @confirm="handleProConfig">
    </ProDialogconfig>
  </div>
</template>

<script>
import { baseConfig, tables2D, tablsOCR } from "./components/Dialog/config";
import TabPane from "@/views/project/components/TabPane.vue"
import ProDialogconfig from './components/Dialog/ProDialog.vue'
import { deepClone } from "@/utils"
import moment from 'moment'
import { page } from "@/api/system/fileUpImg"
import { page as voicePage } from "@/api/system/fileUpVoice";
import { page as twoPage } from "@/api/system/fileUp2D";
import { page as threePage } from "@/api/system/fileUp3D";
import { markersDataConfig, checkersDataConfig, filesDataConfig } from './config/tableColumnDetail.js'
import {
  add,
  update,
  detail,
  getProjectChekers,
  addProjectCheckers,
  delProjectCheckers,
  getProjectMarkers,
  addProjectMarkers,
  delProjectMarkers,
  getProjectFiles,
  addProjectFile,
  delProjectFile,
  getUserRoleList,
  pdfpage,
  createImgTask,
  createvoiceTask,
  create2DTask,
  create3DTask,
  createPDFTask,
  getRoleUser,
  getProjectConfig
} from "@/api/project/project"
import _ from 'lodash'
export default {
  name: 'Detail',
  components: {
    TabPane,
    ProDialogconfig,
  },
  watch: {
    // 监听项目类型，配置不同的项目经理options
    'form.projectType': {
      handler: function (newval) {
        // 必须要先选择项目类型，才可以选择项目经理
        if (newval) {
          this.formConfig[3].disabled = false
          // 判断项目经理属于ocr还是pdf
          this.formConfig[3].options = this.optionsMap[newval] || []
        } else {
          this.formConfig[3].disabled = true

        }
        this.form.projectManagerId = ''

      },
      immediate: true,
      deep: true
    },
    'optionsMap': {
      handler: function (newval) {
        /*
          判断optionsMap已经存在值，且项目经理没有赋值 且项目类型有值
        */
        if (newval && this.formConfig[3].options.length === 0 && this.form.projectType) {
          this.formConfig[3].options = newval[this.form.projectType] || []
        }

      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      baseConfig,
      tables2D,
      tablsOCR,
      dialogLoading: false,
      tabSHow: true,
      // 项目id
      id: null,
      // 上传文件链接
      uploadUrl: process.env.VUE_APP_BASE_API + "/tools/upFile",
      addPeopleStatus: 'checker', // checker 添加质检员 job 添加标注员 file 添加文件
      // 项目详情表单
      form: {
        projectName: '',
        projectType: '',
        projectStatus: '1',
        projectManagerId: '',
        // projectMoneyNum: '',
        // projectMoney: '',
        exStartTime: null,
        exEndTime: null,
        realStartTime: null,
        realEndTime: null,
        // projectClass: '',
        projectFile: []
      },
      // tab标签
      activeName: 'marker',
      // 质检人员名单
      checkers: [],
      // 标注员名单
      markers: [],
      optionsMap: {},
      // 上传文件
      // files: [],
      // 表单配置
      formConfig: [
        {
          key: 'projectName',
          label: '项目名称',
          type: 'input',
          required: true,
          placeholder: "请输入项目名称"
        },
        {
          key: 'projectType',
          label: '项目类型',
          type: 'select',
          required: true,
          placeholder: '请选择项目类型',
          options: []
        },
        {
          key: 'projectStatus',
          label: '项目状态',
          type: 'select',
          required: true,
          placeholder: '请选择项目状态',
          options: [
            {
              label: '未开始',
              value: '1'
            },
            {
              label: '进行中',
              value: '2'
            },
            {
              label: '已结束',
              value: '3'
            }

          ],
          disabled: true, // 设置为禁用

        },
        {
          key: 'projectManagerId',
          label: '项目经理',
          type: 'select',
          required: true,
          placeholder: '请选择项目经理',
          options: [],
          disabled: true
        },
        // {
        //   key: 'projectMoneyNum',
        //   label: '项目预算',
        //   type: 'input',
        //   required: true,
        //   placeholder: '请输入项目预算',
        //   unit: '元'
        // },
        // {
        //   key: 'projectMoney',
        //   label: '项目金额',
        //   type: 'input',
        //   required: true,
        //   placeholder: '请输入项目金额',
        //   unit: '元'
        // },
        {
          key: 'exStartTime',
          label: '预计开始时间',
          type: 'date',
          required: true,
          placeholder: '请选择项目预计开始时间'
        },
        {
          key: 'exEndTime',
          label: '预计结束时间',
          type: 'date',
          required: true,
          placeholder: '请选择项目预计结束时间'
        },
        {
          key: 'realStartTime',
          label: '实际开始时间',
          type: 'date',
          required: true,
          placeholder: '请选择项目实际开始时间'
        },
        {
          key: 'realEndTime',
          label: '实际结束时间',
          type: 'date',
          required: true,
          placeholder: '请选择项目实际结束时间',
        },
        // {
        //   key: 'projectClass',
        //   label: '项目分类',
        //   type: 'select',
        //   required: true,
        //   placeholder: '请选择项目分类'
        // },
        {
          key: 'projectFile',
          label: '项目文件',
          type: 'file',
          placeholder: '上传项目文件',
          icon: 'el-icon-plus'
        },
        {
          key: 'projectEdit',
          label: '项目配置信息',
          type: 'button',
          placeholder: '项目配置',
          required: true,
          icon: 'el-icon-edit'
        }
      ],
      rules: {
        projectName: [
          { required: true, message: '项目名称为必填', trigger: 'blur' }
        ],
        projectType: [
          { required: true, message: '项目类型为必选项', trigger: 'change' }
        ],
        projectStatus: [
          { required: true, message: '项目状态为必选项', trigger: 'change' }
        ],
        projectManagerId: [
          { required: true, message: '项目经理为必选项', trigger: 'change' }
        ],
        projectMoneyNum: [
          { required: true, message: '项目预算为必填', trigger: 'blur' }
        ],
        projectMoney: [
          { required: true, message: '项目金额为必填', trigger: 'blur' }
        ],
        exStartTime: [
          { required: true, message: '请选择项目预计开始时间', trigger: 'blur' }
        ],
        exEndTime: [
          { required: true, message: '请选择项目预计结束时间', trigger: 'blur' }
        ],
        // realStartTime: [
        //   { required: true, message: '请选择项目实际开始时间', trigger: 'blur'}
        // ],
        // realEndTime: [
        //   { required: true, message: '请选择项目实际结束时间', trigger: 'blur'}
        // ],
        projectClass: [
          { required: true, message: '请选择项目分类' }
        ],
      },
      proConfigForm: {},
      // 新增质检员
      checkersData: [],
      checkersDataConfig,
      showAddCheckers: false,
      // 标注员名单
      markersData: [],
      markersDataConfig,
      showAddMarkers: false,
      showProDialog: false,
      // 文件
      filesData: [],
      filesDataConfig,
      // 所有用户
      users: [],
      // 所有文件
      files: [],
      // 选择类型
      title: '',
      // 用户搜索条件
      searchUserCondition: {
        userName: '',
        phonenumber: ''
      },
      // 文件搜索条件
      searchFileCondition: {},
      // 编辑页面文件搜索
      searchFile: {
        fileName: ''
      },
      // 新增标   注员或质检员列表loading
      userLoading: false,
      // users分页
      currentUsersPage: 1,
      usersPageSize: 10,
      usersTotal: 0,
      // 用户角色类id PDF质检员4, PDF标注员5, ocr_质检员13, ocr_标注员12,
      roleId: null,
      // 待增加的分组
      selections: [],
      selectID: [],
      // 保存loading
      saveLoading: false,
      // 提交loading
      subLoading: false,
      // 项目质检员分页
      checkerPage: {
        userName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 项目标注员分页
      markerPage: {
        userName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 项目文件分页
      filePage: {
        fileName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 文件批次字典
      groupLabels: [],
      // 选中的文件，可生成任务
      selectedTask: [],
      pdfUserOption: [],
      OcrUserOption: [],
      // 项目配置的字典集合
      dictTypes: [],
      proConfigFormData: {},
      proConfigToolData: {},
      // 获取的项目配置信息
      proDetailConfig: {},
    }
  },
  computed: {
    pagetitle() {
      return this.$route.query.id ? '编辑项目详情' : '新增项目详情'
    },
    projectDialogData() {
      let { proToolsData, proFromData } = this.$store.state.proConfig
      console.log(proToolsData, proFromData);
      let tools = proToolsData.filter(item => item.projectType.includes(this.form.projectType))
      return {
        toolsConfig: tools,
        formConfig: proFromData
      }
    },
    projectDialogForm() {

    }
  },
  mounted() {
    this.getUserList()
    this.getProjectTypeOptions()

    // 批次号
    this.getDicts("group_label").then((response) => {
      this.groupLabels = response.data;
    });
    // 初始化字典数据
    this.initData()
    // 编辑
    let id = this.$route.query.id
    if (id) {
      this.id = id
      this.getProjectDetail(this.id)
      // 获取质检员、标注员、项目文件
      this.getAllTables()
      /** 获取项目配置 */
      // this.getProjectConfig()
    }

    this.$refs.proDialogRef.resetUpdateForm()

  },
  methods: {
    /** 初始化项目配置字典库 */
    initData() {
      this.$store.dispatch("proConfig/GET_PRO_CONFIG", { key: this.form.projectType })

    },
    /** 处理字典数据 */
    async handleDictData(result) {
      let res = await Promise.all(

        result.map(async (item) => {

          return {
            disabled: false,
            label: item.dictLabel,
            value: item.dictValue,
            remark: item.remark, // 单选 radio or 多选 checkbox
            dictData: await this.$store.dispatch("dicts/GET_DIC", { key: item.dictValue })
          };
        })
      )
      return res
    },
    /** tab切换事件 */
    async tabChange() {
      this.tabSHow = false;

      setTimeout(() => {
        this.tabSHow = true;
      }, 100);
    },
    // 根据项目经理id 获取项目经理
    async getUserList(pmIDS = []) {
      // 6 题目标注项目经理 11 OCR标注项目经理

      pmIDS.forEach(async pid => {
        const res2 = await getRoleUser({ roleId: pid })

        const key = this.formConfig[1].options.find(item => item.pm == pid)
        this.optionsMap = {
          ...this.optionsMap,
          [key.value]: res2.data.map(item => ({
            label: item.nickName,
            value: item.userId
          })),
        }
      })


    },

    // 打开项目配置弹框
    handleShowProDialog() {

      this.showProDialog = true

    },
    // 获取项目配置信息
    handleProConfig(proConfig) {
      this.proConfigForm = proConfig
      console.log(proConfig);
    },
    // todo 获取
    async getProjectTypeOptions() {
      const res = await this.getDicts("project_type")

      if (!res.data) {
        return
      }

      const options = res.data.map(item => {
        let remark = {}
        try {
          remark = JSON.parse(item.remark)
        } catch (error) {
        }
        return {
          value: item.dictValue,
          label: item.dictLabel,
          remark,
          ...remark,
        }
      })

      // 获取所有项目类型的项目经理列表 OCR 
      this.getUserList(options.map(item => item.pm))

      this.formConfig[1].options = options
    },
    getProjectDetail(id) {
      detail({ id }).then(async res => {
        if (res.code === 200) {
          let { projectName, projectType, projectStatus, projectManagerId, exStartTime, exEndTime, realStartTime, realEndTime, projectFile, dictTypes, configs } = res.data
          // 基础表单
          this.form['projectName'] = projectName;
          this.form['projectType'] = projectType;
          this.form['projectStatus'] = projectStatus;
          setTimeout(() => {
            this.form.projectManagerId = projectManagerId;
          }, 500);
          this.form['exStartTime'] = exStartTime;
          this.form['exEndTime'] = exEndTime;
          this.form['realStartTime'] = realStartTime;
          this.form['realEndTime'] = realEndTime;
          this.form['projectFile'] = projectFile && typeof projectFile === 'array' ? projectFile : [];

          // 获取项目配置信息
          this.proDetailConfig = configs
          this.handleProConfig(configs)
          // 更新缓存信息
          this.$store.dispatch("localPro/UPDATE_PRO", {
            projectId: id,
            data: configs,
          });

          dictTypes?.forEach(item => {
            this.proConfigForm[item] = res.data[item]
          })
          console.log(this.proConfigForm);
          this.dictTypes = dictTypes

        }
      })

    },
    getAllTables() {
      Promise.all([
        getProjectChekers({ projectId: this.id }),
        getProjectMarkers({ projectId: this.id }),
        getProjectFiles({ projectId: this.id })
      ]).then(results => {
        this.checkersData = results[0].data.content
        this.checkerPage.total = results[0].data.allNum
        this.markersData = results[1].data.content
        this.markerPage.total = results[1].data.allNum
        this.filesData = results[2].data.content
        this.filePage.total = results[2].data.allNum
      })
    },
    checkerPaginationChange(obj) {
      this.checkerPage.currentPage = obj?.currentPage ||

        this.checkerPage.currentPage
      this.checkerPage.pageSize = obj?.pageSize || this.checkerPage.pageSize
      getProjectChekers({
        userName: this.checkerPage.userName,
        projectId: this.id,
        pageNum: this.checkerPage.currentPage,
        pageSize: this.checkerPage.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.checkerPage.total = res.data.allNum
          this.checkersData = res.data.content
        }
      })
    },
    markerPaginationChange(obj) {
      this.markerPage.currentPage = obj?.currentPage || this.markerPage.currentPage
      this.markerPage.pageSize = obj?.pageSize || this.markerPage.pageSize
      getProjectMarkers({
        userName: this.markerPage.userName,
        projectId: this.id,
        pageNum: this.markerPage.currentPage,
        pageSize: this.markerPage.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.markersData = res.data.content
          this.markerPage.total = res.data.allNum
        }
      })
    },
    filePaginationChange(obj) {
      this.filePage.currentPage = obj?.currentPage || this.filePage.currentPage
      this.filePage.pageSize = obj?.pageSize || this.filePage.pageSize
      getProjectFiles({
        projectId: this.id,
        pageNum: this.filePage.currentPage,
        pageSize: this.filePage.pageSize,
        fileName: this.filePage.fileName
        // ...this.searchFile
      }).then(res => {
        if (res.code === 200) {
          this.filesData = res.data.content
          this.filePage.total = res.data.allNum
        }
      })
    },
    handleUsersSizeChange(val) {
      this.usersPageSize = val ? val : this.usersPageSize
      this.getAllFiles()
    },
    getRowKey(row) {
      return row.id;
    },

    // 多选回显
    handleSelectionChange(selection) {
      this.selections = selection
      // 将选择的id存入
      this.selectID = [];
      if (selection) {
        selection.forEach(row => {
          if (row) {
            let id = this.activeName === 'file' ? row.fileId : row.userId
            this.selectID.push(id);
          }
        });
      }

      let arr = deepClone(this.selections)
      // 防止重复添加
      let _map = new Map()
      for (let item of arr) {
        if (!_map.has(this.activeName === 'file' ? item.fileId : item.userId)) {
          _map.set(this.activeName === 'file' ? item.fileId : item.userId, item);
        };
      };
      arr = [..._map.values()]
      this.selections = arr


    },
    toggleRowSelect(rows) {
      const _this = this
      if (rows.length > 0) {
        this.$nextTick(() => {
          rows.forEach(row => {
            _this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleUsersCurrentChange(val) {
      this.currentUsersPage = val
      this.getAllFiles()
    },
    // 通过名字搜索标注员
    checkersDataFilter(obj) {
      this.checkerPage.userName = obj.conditions.text
      this.checkerPaginationChange()
    },
    // 通过名字搜索标注员
    markersDataFilter(obj) {
      this.markerPage.userName = obj.conditions.text
      this.markerPaginationChange()
    },
    // 搜索项目文件
    searchProjectFiles(obj) {
      this.filePage.fileName = obj.conditions.text
      this.filePaginationChange()
    },
    // 生成项目
    createTask() {
      // 1. OCR, 2.PDF,3.voice,4.2D, 5.3D
      if (this.selectedTask.length === 0) {
        this.$refs.fileTable.loading = false
        return this.$message.warning('请先选择要生成任务的文件！')
      }
      let methodsArr = [createImgTask, createPDFTask, createvoiceTask, create2DTask, create3DTask]
      let typeArr = this.formConfig[1].options.map(item => item.value)
      let index = typeArr.findIndex(k => k === this.form.projectType)
      console.log('index', index);
      methodsArr[index]({
        projectId: this.id,
        list: this.selectedTask
      }).then(res => {
        this.$refs.fileTable.loading = false
        if (res.code === 200) {
          this.$message.success(res.data)
        }
      }).catch(() => {
        this.$refs.fileTable.loading = false
      })
    },
    taskSelectChange(rows) {
      this.selectedTask = rows.map(item => item.id)
    },
    // 文件列表可选
    fileManagerSelectable(row) {
      console.log(row);
    },
    // 文件名、批次号搜索文件
    searchNewFile() {
      this.handleUsersSizeChange()
    },
    // 重置文件名、批次号搜索文件
    resetSearchNewFile() {
      this.$refs.searchForm.resetFields()
      this.currentUsersPage = 1
      this.searchFileCondition.groupLabel = ''
      this.searchFileCondition.likeFileName = ''
      this.handleUsersSizeChange()
    },
    // 上传文件回调
    uploadSuccess(response, file, fileList) {
      this.form.projectFile.push({
        name: file.name,
        url: response.data,
        id: response.uid
      })
    },
    addUsers(type) {
      this.title = type
      this.showAddCheckers = true

      if (type === '新增文件') {
        this.roleId = 6
        this.addPeopleStatus = 'file'
      } else {

        const options = this.formConfig[1].options

        const target = options.find(item => this.form.projectType == item.value)

        if (!target) {
          return
        }
        if (type === '新增质检员') {
          this.addPeopleStatus = 'checker'
          this.roleId = target['check']
        } else {
          this.addPeopleStatus = 'job'
          this.roleId = target['job']
        }

      }
      this.getAllFiles()
    },
    // 删除
    deleteRow(row, type) {
      this.$modal.loading('删除中...')
      // 根据type删除对应数据
      if (type === 'checkersData') {
        // 删除质检员
        delProjectCheckers({ id: row.id }).then(res => {
          if (res.code === 200) {
            // 删除成功
            getProjectChekers({ projectId: this.id }).then(results => {
              this.$modal.closeLoading()
              if (results.code === 200) {
                this.checkersData = results.data.content
                this.checkerPage.total = results.data.allNum
              }
            }).catch(() => {
              this.$modal.closeLoading()
            })
          }
        }).catch(() => {
          this.$modal.closeLoading()
        })
      } else if (type === 'markersData') {
        // 删除标注员
        delProjectMarkers({ id: row.id }).then(res => {
          if (res.code === 200) {
            // 删除成功
            getProjectMarkers({ projectId: this.id }).then(results => {
              this.$modal.closeLoading()
              if (results.code === 200) {
                this.markersData = results.data.content
                this.markerPage.total = results.data.allNum
              }
            }).catch(() => {
              this.$modal.closeLoading()
            })
          }
        }).catch(() => {
          this.$modal.closeLoading()
        })
      } else if (type === 'filesData') {
        // 删除文件
        delProjectFile({ id: row.id }).then(res => {
          if (res.code === 200) {
            // 删除成功
            getProjectFiles({ projectId: this.id }).then(results => {
              this.$modal.closeLoading()
              if (results.code === 200) {
                this.filesData = results.data.content
                this.filePage.total = results.data.allNum
              }
            }).catch(() => {
              this.$modal.closeLoading()
            })
          }
        }).catch(() => {
          this.$modal.closeLoading()
        })
      }
    },
    confirmSelection() {
      // pdf质检员5, pdf标注员4，ocr质检员13, ocr标注员12
      const roles = {
        '5': 'checkersData',
        '13': 'checkersData',
        '4': 'markersData',
        '12': 'markersData',
        '6': 'filesData'
      }

      const { addPeopleStatus } = this

      if (addPeopleStatus === 'checker') {
        // 添加质检员
        addProjectCheckers({
          projectId: this.id,
          list: this.selections.map(item => item.userId)
        }).then(res => {
          this.selections = []
          this.currentUsersPage = 1
          this.showAddCheckers = false
          // 更新质检员列表
          getProjectChekers({ projectId: this.id }).then(res => {
            if (res.code === 200) {
              this.checkersData = res.data.content
              this.checkerPage.total = res.data.allNum
            }
          })
        })
      } else if (addPeopleStatus === 'job') {
        let ids = this.selections?.map(item => item.userId)
        if (ids.length === 0) {
          this.$message.warning('请至少选择一个标注员')
          return
        }
        // 添加标注员
        addProjectMarkers({
          projectId: this.id,
          list: this.selections?.map(item => item.userId)
        }).then(res => {
          this.selections = []
          this.currentUsersPage = 1
          this.showAddCheckers = false
          // 更新标注员列表
          getProjectMarkers({ projectId: this.id }).then(res => {
            if (res.code === 200) {
              this.markersData = res.data.content
              this.markerPage.total = res.data.allNum
            }
          })
        })
      } else {
        // 添加项目文件
        let ids = this.selections?.map(item => item.fileId)
        if (ids.length === 0) {
          this.$message.warning('请至少选择一个文件')
          return
        }
        addProjectFile({
          projectId: this.id,
          list: ids
        }).then(res => {
          this.selections = []
          this.currentUsersPage = 1
          this.showAddCheckers = false
          // 更新项目文件列表
          getProjectFiles({ projectId: this.id }).then(res => {
            if (res.code === 200) {
              this.filesData = res.data.content
              this.filePage.total = res.data.allNum
            }
          })
        })
      }
      this[roles[this.roleId]] = deepClone(this.selections)
      this.selections = []
      this.currentUsersPage = 1
      this.showAddCheckers = false
    },
    cancelSelection() {
      this.$refs.selectionTable.clearSelection();
      this.showAddCheckers = false
    },
    getAllFiles() {
      this.userLoading = true
      if (this.activeName === 'file') {
        let params = {
          projectId: this.id,
          pageNum: this.currentUsersPage,
          pageSize: this.usersPageSize,
          likeFileName: this.searchFileCondition.likeFileName
        }
        let api, query
        if (this.form.projectType === '1') {  // OCR
          query = {
            ...params,
            ...this.searchFileCondition
          }
          api = page
        } else if (this.form.projectType === '2') { // 标注
          query = params
          api = pdfpage
        } else if (this.form.projectType === '3') { // 语音
          api = voicePage
          query = {
            ...params,
            ...this.searchFileCondition
          }
        } else if (this.form.projectType === '4') { //2D
          api = twoPage
          query = {
            ...params,
            ...this.searchFileCondition
          }
        } else if (this.form.projectType === '5') { //3D
          api = threePage
          query = {
            ...params,
            ...this.searchFileCondition
          }
        }
        api(query).then(res => {
          this.userLoading = false
          if (res.code === 200) {
            this.files = res.data.content
            this.usersTotal = res.data.allNum
            this.setDefaultChecked()
          }
        }).catch(err => {
          this.userLoading = false
        })
      } else {
        // 获取用户
        getUserRoleList({
          roleId: this.roleId,
          projectId: this.id,
          pageNum: this.currentUsersPage,
          pageSize: this.usersPageSize,
          ...this.searchUserCondition
        }).then(res => {
          this.userLoading = false
          if (res.code === 200) {
            this.users = res.data.content
            this.usersTotal = res.data.allNum
            this.setDefaultChecked()
          }
        }).catch(err => {
          this.userLoading = false
        })
      }

    },
    // 设置默认选中
    setDefaultChecked() {
      let data = this.activeName === 'file' ? this.files : this.users
      data.files.forEach(item => {
        if (item.projectId) {
          this.$refs.selectionTable.toggleRowSelection(item, true)
        }
      })
    },
    // 禁止选中
    checkSelectable(row) {
      // 判断row.projectId是否与项目id一样，一样的话说明已经选中了，不可再操作
      if (row.projectId === this.id) {
        return false
      } else {
        return true
      }
    },
    // 重置搜索
    async resetSearch() {
      this.searchUserCondition = {
        userName: '',
        phonenumber: ''
      }
      await this.$nextTick()
      this.$refs.searchForm.resetFields()
      this.getAllFiles()
    },
    // 返回
    back() {
      this.$router.back()
    },
    // 保存
    saveForm() {
      this.$refs.projectDetails.validate(valid => {

        if (valid) {

          let { exStartTime, exEndTime, realStartTime, realEndTime } = this.form
          let moment1 = moment(exStartTime).valueOf()
          let moment2 = moment(exEndTime).valueOf()
          if (moment1 > moment2) {
            this.$message.warning('项目预计结束时间不得早于预计项目开始时间')
            return
          }
          let moment3 = realStartTime && moment(realStartTime).valueOf()
          let moment4 = realEndTime && moment(realEndTime).valueOf()
          if (realStartTime && realEndTime && moment3 > moment4) {
            this.$message.warning('项目实际结束时间不得早于项目实际开始时间')
            return
          }

          this.saveLoading = true
          update({
            id: this.id,
            ...this.form,
            fileList: this.filesData,
            checkList: this.checkersData,
            userList: this.markersData,
            configs: this.proConfigForm
          }).then(res => {
            this.saveLoading = false
            if (res.code === 200) {
              this.$message.success('保存成功！')
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.back();
              this.$refs.proDialogRef.resetUpdateForm()
            }
          }).catch(err => {
            this.saveLoading = false
          })


        }
      })
    },
    // 提交-新建项目
    submitForm() {

      this.$refs.projectDetails.validate(valid => {

        if (valid) {
          // 验证时间
          let { exStartTime, exEndTime, realStartTime, realEndTime } = this.form
          let moment1 = moment(exStartTime).valueOf()
          let moment2 = moment(exEndTime).valueOf()
          if (moment1 > moment2) {
            this.$message.warning('项目预计结束时间不得早于预计项目开始时间')
            return
          }
          let moment3 = realStartTime && moment(realStartTime).valueOf()
          let moment4 = realEndTime && moment(realEndTime).valueOf()
          if (realStartTime && realEndTime && moment3 > moment4) {
            this.$message.warning('项目实际结束时间不得早于项目实际开始时间')
            return
          }
          this.subLoading = true
          // 验证项目配置
          add({
            ...this.form,
            fileList: this.filesData,
            checkList: this.checkersData,
            userList: this.markersData,
            configs: this.proConfigForm
          }).then(res => {
            this.subLoading = false
            if (res.code === 200) {
              if (this.id) {
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.back();
                this.$message.success('提交成功！')
              } else {
                if (res.data) {
                  this.$message.success('项目新建成功，请继续完善项目信息')
                  this.id = res.data
                  this.getProjectDetail(this.id)
                  // 获取质检员、标注员、项目文件
                  this.getAllTables()
                  this.$refs.proDialogRef.resetUpdateForm()
                  this.$router.replace({
                    path: '/project/detail',
                    query: {
                      id: this.id
                    }
                  })
                }
              }

            }
          }).catch(err => {
            this.subLoading = false
          })
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .cell-disabled .cell {
  visibility: hidden;
}

::v-deep .el-select,
.el-date-editor {
  width: 100%;
}

.container {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.pagetitle {
  font-size: 16px;
  display: flex;
  align-items: center;
  // background: #e8f4ff;
  padding: 5px;
  font-weight: 600;

  .line {
    margin-right: 10px;
    font-weight: 600;
    color: #1890ff;
  }
}
</style>
