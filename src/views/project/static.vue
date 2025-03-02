<template>
  <div class="app-container">
    <!-- <p class="pagetitle">
      <span class="line">|</span>
      <span>项目基础信息</span>
    </p> -->
    <div style="width: 100%;height: 80px;">
      <div style="width: 150px;float: left;font-size: 20px;">
        <svg-icon icon-class="Project-details" style="font-size: 23px;" />基本信息
      </div>
      <div style="width:200px;float: right;">
        <el-button type="primary" icon="el-icon-folder"  v-if="form.projectStatus === '2'"  @click="closeProject()"    v-hasPermi="['project:list:close']" 
           >结束</el-button>
        <el-button type="primary" icon="el-icon-folder"    v-if="form.projectStatus === '3'"
           >归档</el-button>
           <el-button type="primary" icon="el-icon-folder"    v-if="form.projectStatus === '3'"
           >开启</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleUpdate()"
          v-hasPermi="['project:detail']"  v-if="form.projectStatus === '1'||form.projectStatus === '2'">编辑</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="project-new">
      <el-col :span="12"><span class="label">项目名称：</span><span class="content">{{
        form.projectName
      }}</span></el-col>
      <el-col :span="12"><span class="label">项目类型：</span><span class="content">{{
        projectTypeText(form.projectType)
      }}</span></el-col>
      <el-col :span="12"><span class="label">项目状态：</span><span class="content">{{
        projectStatusText(form.projectStatus)
      }}</span></el-col>
      <el-col :span="12"><span class="label">项目经理：</span><span class="content">{{
        getProjectManager(form.projectManagerId)
      }}</span></el-col>
      <el-col :span="12"><span class="label">期望开始时间：</span><span class="content">{{ form.exStartTime }}</span></el-col>
      <el-col :span="12"><span class="label">期望结束时间：</span><span class="content">{{ form.exEndTime }}</span></el-col>
      <el-col :span="12"><span class="label">实际开始时间：</span><span class="content">{{ form.realStartTime || '-'
      }}</span></el-col>
      <el-col :span="12"><span class="label">实际结束时间：</span><span class="content">{{ form.realEndTime ||
        '-' }}</span></el-col>
      <el-col :span="24" style="width: 100%;" v-if="form.fileId">
        <span class="label">项目文件：</span>
        <span class="content">
          <a :href="form.fileId" style="color: #409eff;">验收标准</a>
        </span>
      </el-col>
    </el-row>
    <!-- <p class="pagetitle">
      <span class="line">|</span>
      <span>项目关联信息</span>
    </p> -->

    <el-tabs v-model="activeName" @tab-click="tabChange">
      <!-- 标注任务 -->
      <el-tab-pane v-if="checkPermi(taskPermision)" label="标注任务" name="task" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" ref="taskTable" :projectType="form.projectType" :data="tasksData" :archive="true"   :status="form.projectStatus"
            :pagination="taskPage" :dataConfig="tasksDataConfig" :projectStatus="TaskStatusOptions"
            :customArrList="customArrList" :taskType="'job'" :activeName="activeName" icon="el-icon-folder-add"
            @paginationChange="taskPaginationChange" @refresh="handleRefresh" @filter="tasksDataFilter"
            @jumpPage="jumpPage" @tansfer="getTransferList($event, 'job')">
          </TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 质检任务 -->
      <el-tab-pane v-if="checkPermi(checkPermision)" label="质检任务" name="check" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" ref="taskCheckTable" :projectType="form.projectType" :data="checkTaskData" :archive="true" :status="form.projectStatus"
            :taskType="'check'" :pagination="checktaskPage" :dataConfig="tasksDataConfig"
            :projectStatus="TaskStatusOptions" :customArrList="customArrList" :activeName="activeName"
            icon="el-icon-folder-add" @paginationChange="checkTaskPaginationChange" @refresh="handleRefresh"
            @filter="checktasksDataFilter" @jumpPage="jumpPage" @tansferCheck="getTransferList($event, 'check')">
          </TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 标注待领取 -->
      <el-tab-pane v-if="checkPermi(waitTaskPermision) &&
        tasksWaitJobConfig.length > 0 && tabFlag
        " :label="'待领取标注任务(' + jobWaitPage.total + ')'" name="jobWaitTask" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" ref="waittaskTable" :projectType="form.projectType" :activeName="activeName" :archive="true" :status="form.projectStatus"
            :data="jobWaitData" :pagination="jobWaitPage" :dataConfig="tasksWaitJobConfig"
            :projectStatus="TaskStatusOptions" :customArrList="customArrList" :taskType="'job'" icon="el-icon-folder-add"
            @paginationChange="jobWaitPaginationChange" @refresh="handleRefresh" @filter="jobWaitDataFilter"
            @jumpPage="jumpPage">
          </TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 质检待领取 -->
      <el-tab-pane v-if="checkPermi(waitCheckPermision) &&
        tasksWaitCheckConfig.length > 0 && tabFlag
        " :label="'待领取质检任务(' + checkWaitPage.total + ')'" name="CheckWaitTask" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" ref="waitChecktaskTable" :projectType="form.projectType" :archive="true" :status="form.projectStatus"
            :activeName="activeName" :data="checkWaitData" :taskType="'check'" :pagination="checkWaitPage"
            :dataConfig="tasksWaitCheckConfig" :projectStatus="TaskStatusOptions" :customArrList="customArrList"
            @paginationChange="checkWaitPaginationChange" @refresh="handleRefresh" @filter="checkWaitDataFilter"
            @jumpPage="jumpPage">
          </TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 标注员名单 -->
      <el-tab-pane label="标注员名单" name="marker" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" :pagination="markerPage" :data="markersData" :isEdit="true" :archive="true"
            :activeName="activeName" :dataConfig="markersDataConfig" icon="filter" add="新增标注员"
            @paginationChange="markerPaginationChange" @refresh="handleRefresh" @filter="markersDataFilter"></TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 质检员名单 -->
      <el-tab-pane label="质检员名单" name="checker" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" :pagination="checkerPage" :data="checkersData" :isEdit="true" :archive="true"
            :activeName="activeName" :dataConfig="checkersDataConfig" icon="el-icon-plus" add="新增质检员"
            @paginationChange="checkerPaginationChange" @refresh="handleRefresh" @filter="checkersDataFilter">
          </TabPane>
        </el-card>
      </el-tab-pane>
      <!-- 文件管理 -->
      <el-tab-pane label="文件管理" name="file" lazy>
        <el-card shadow="hover" v-if="tabSHow">
          <TabPane :loading="tableLoading" :data="filesData" :pagination="filePage" :isEdit="true" :archive="true"
            :activeName="activeName" :dataConfig="filesDataConfig" icon="el-icon-folder-add"
            @paginationChange="filePaginationChange" @refresh="handleRefresh" @filter="searchProjectFiles">
          </TabPane>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 转移人弹框 -->
    <transfer-dialog :visible.sync="transferOpen" :loading="transLoading" :data="transfersData" :total="transTotal"
      @list="handleSearch" @row="handleRowChange" @confirm="handlejobTransfer"></transfer-dialog>
  </div>
</template>


<script>
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import { taskPermision, checkPermision, waitCheckPermision, waitTaskPermision } from "./config/permision.js";

import {
  checkersDataEdit,
  markersDataEdit,
  filesDataEdit,
  checkersDataStatic,
  markersDataStatic,
  filesDataStatic,

  tasksOCRDataConfig,
  tasksPDFDataConfig,
  tasksVoiceDataConfig,
  tasks2DDataConfig,
  tasks2DWaitJobConfig,
  tasksPDFWaitJobConfig,
  tasks3DWaitJobConfig,
  tasks3DWaitCheckConfig,
  tasks3DDataConfig,
  tasksPDFWaitCheckConfig,
  tasks2DWaitCheckConfig,
  tasksOCRWaitJobConfig,
  tasksOCRWaitCheckConfig,
} from "./config/tableColumn.js";

import {
  detail,
  getProjectChekers,
  getProjectMarkers,
  getProjectFiles,
  getVoiceJobTask,
  getVoiceCheckTask,
  getPdfJobTask,
  getPdfCheckTask,
  getOcrJobTask,
  getOcrCheckTask,
  getPDFWaitJobTask,
  getPDFWaitCheckTask,
  getCloseProject
} from "@/api/project/project";
import {
  get2DJobTask,
  get2DCheckTask,
  get2DWaitJobTask,
  get2DWaitCheckTask,
  checkTransfer2D,
  JobTransfer2D,
} from "@/api/project/2d";
import {
  get3DJobTask,
  get3DCheckTask,
  get3DWaitJobTask,
  get3DWaitCheckTask,
  checkTransfer3D,
  JobTransfer3D,
} from "@/api/project/3d";
import {
  ocrJobTransfer,
  pdfJobTransfer,
  voiceCheckTransfer,
  voiceJobTransfer,
  pdfCheckTransfer,
  ocrCheckTransfer,
  getOCRWaitCheckTask,
  getOCRWaitJobTask,
} from "@/api/project/imgTask";
import { getRoleUser } from "@/api/project/project";
import { bus } from "../../main";
import TransferDialog from "@/views/project/components/TransferDialog.vue";
import TabPane from "@/views/project/components/TabPane.vue";
export default {
  name: "Static",
  components: {
    TabPane,
    TransferDialog,
  },
  data() {
    return {
      tabFlag: false,
      job_mode: '',
      tabSHow: true,
      md5: null,
      // 项目id
      id: null,
      transTotal: 0,
      taskPermision,
      checkPermision,
      waitCheckPermision,
      waitTaskPermision,
      title: "",
      form: {
        projectName: "",
        projectType: "",
        projectStatus: "",
        projectManagerId: "",
        exStartTime: "",
        exStartTime: "",
        realStartTime: "",
        realEndTime: "",
        projectFile: [],
        fileId: ""
      },
      // 项目状态
      projectStatusOptions: [],
      // 项目类型
      projectType: [],
      // 项目经理
      projectManagers: [],
      activeName: "task",
      // 项目质检员分页
      checkerPage: {
        nickName: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 项目标注员分页
      markerPage: {
        nickName: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 项目文件分页
      filePage: {
        fileName: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 标注任务分页
      taskPage: {
        fileName: "",
        fileId: "",
        groupStatus: "",
        jobUserId: "",
        checkUserId: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 质检任务分页
      checktaskPage: {
        fileName: "",
        fileId: "",
        groupStatus: "",
        jobUserId: "",
        checkUserId: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },

      checkersData: [],
      checkersDataEdit,
      checkersDataStatic,
      markersData: [],
      markersDataEdit,
      markersDataStatic,
      filesData: [],
      filesDataEdit,
      filesDataStatic,
      tasksData: [],
      checkTaskData: [],
      // 任务待领取
      jobWaitPage: {
        fileName: "", //文件名称
        groupStatus: "", //任务状态（参照分组任务状态字典）
        jobNickName: "", //标注员名称
        checkNickName: "", // 质检员名称
        loadTag: "", //导入标签
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      OCR_Wait_Task_Data: [],
      OCR_Wait_Check_Data: [],
      tasksPDFDataConfig,
      tasksOCRDataConfig,
      tasksVoiceDataConfig,
      tasks2DDataConfig,
      tasks2DWaitJobConfig,
      tasksPDFWaitJobConfig,
      tasksPDFWaitCheckConfig,
      tasks2DWaitCheckConfig,
      tasksPDFWaitJobConfig,
      tasksPDFWaitCheckConfig,
      tasks3DWaitCheckConfig,
      tasks3DWaitJobConfig,
      tasks3DDataConfig,
      tasksOCRWaitJobConfig,
      tasksOCRWaitCheckConfig,
      // 任务待领取
      jobWaitPage: {
        fileName: "", //文件名称
        groupStatus: "", //任务状态（参照分组任务状态字典）
        jobNickName: "", //标注员名称
        checkNickName: "", // 质检员名称
        loadTag: "", //导入标签
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      jobWaitData: [],
      checkWaitPage: {
        fileName: "", //文件名称
        groupStatus: "", //任务状态（参照分组任务状态字典）
        jobNickName: "", //标注员名称
        checkNickName: "", // 质检员名称
        loadTag: "", //导入标签
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      checkWaitData: [],
      // 转移弹框
      transferOpen: false,
      // 转移标注员
      transferForm: {
        userLabel: "",
      },
      // 规则
      rules: {
        userLabel: [{ required: true, message: "标注员为必选项" }],
      },
      // 可转移人员
      userListOptions: [],
      // 加载
      transferLoading: false,
      transLoading: false,
      // 当前选中行
      transferRow: null,
      taskNum: 0,
      tableLoading: false,
      transfersData: [],
      userId: "",
      selectedRow: null,
      transferType: "job", // 转移类型 标注员转移 job 质检员转移 check
      TaskStatusOptions: [], // 任务状态
    };
  },
  computed: {
    // 该项目类型是否有分组  true ： groupStatus false： jobStatus
    isGroup() {
      let { projectType } = this.form; // 1 OCR 2 标注 3 语音 4 2D
      return projectType === "2" || projectType === "4"|| projectType === "5";
    },
    /* 标注任务和质检任务 列表数据 */
    tasksDataConfig() {
      let tasksDataConfig = [];
      let { projectType } = this.form; // 1 OCR 2 标注 3 语音 4 2D
      if (projectType === "1") {
        tasksDataConfig = this.tasksOCRDataConfig;
      } else if (projectType === "2") {
        tasksDataConfig = this.tasksPDFDataConfig;
      } else if (projectType === "3") {
        tasksDataConfig = this.tasksVoiceDataConfig;
      } else if (projectType === "4") {
        tasksDataConfig = this.tasks2DDataConfig;
      } else if (projectType === "5") {
        tasksDataConfig = this.tasks3DDataConfig;
      }
      return tasksDataConfig;
    },
    /** 待领取标注任务列表  只有语音没有 */
    tasksWaitJobConfig() {
      let projectType = this.form.projectType;
      if (projectType === "1") {
        return this.tasksOCRWaitJobConfig;
      } else if (projectType === "4") {
        return this.tasks2DWaitJobConfig;
      } else if (projectType === "2") {
        return this.tasksPDFWaitJobConfig;
      } else if (projectType === "5") {
        return this.tasks3DWaitJobConfig;
      } else {
        return [];
      }
    },
    /** 待领取质检任务列表  只有语音没有 */
    tasksWaitCheckConfig() {
      let { projectType } = this.form; // 1 OCR 2 标注 3 语音 4 2D
      if (projectType === "1") {
        return this.tasksOCRWaitCheckConfig;
      } else if (projectType === "4") {
        return this.tasks2DWaitCheckConfig;
      } else if (projectType === "2") {
        return this.tasksPDFWaitCheckConfig;
      } else if (projectType === "5") {
        return this.tasks3DWaitCheckConfig;
      } else {
        return [];
      }
    },
    /** 标注员名单 */
    markersDataConfig() {
      if (this.isEdit) {
        return this.markersDataEdit
      } else {
        return this.markersDataStatic
      }
    },
    /** 质检员名单*/
    checkersDataConfig(){
      if (this.isEdit) {
        return this.checkersDataEdit
      } else {
        return this.checkersDataStatic
      }
    },
    /** 文件管理 */
    filesDataConfig(){
      if (this.isEdit) {
        return this.filesDataEdit
      } else {
        return this.filesDataStatic
      }
    },
    projectTypeText() {
      return function (type) {
        let target = this.projectType.find((item) => item.dictValue === type);
        return target?.dictLabel;
      };
    },
    projectStatusText() {
      return function (status) {
        let target = this.projectStatusOptions.find(
          (item) => item.dictValue === status
        );
        return target?.dictLabel;
      };
    },
    customArrList() {
      let arr = this.TaskStatusOptions.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
        };
      });

      if (this.form.projectType === "1" || this.form.projectType === "3") {
        return {
          jobStatus: arr,
        };
      } else {
        return {
          groupStatus: arr,
        };
      }
    },

    /** 待领取任务列表数据 */
    handleWaitTaskConfig() { },
    /** 确定身份 */
    permissionStatus() {
      if (
        this.checkPermi(this.taskPermision) &&
        this.checkPermi(this.checkPermision)
      ) {
        return 1; // '项目经理 admin'
      } else if (this.checkPermi(this.taskPermision)) {
        return 2; // '标注员'
      } else if (this.checkPermi(this.checkPermision)) {
        return 3; // '质检员'
      }
    },
    transferListApi() {
      let api;
      switch (this.activeName) {
        case "task":
          api = getProjectMarkers;
          break;
        case "check":
          api = getProjectChekers;
          break;
      }
      return api;
    },
    dialogTitle() {
      return this.activeName === "task" ? "标注员列表" : "质检员列表";
    },
  },
  mounted() {
    this.initStatic();
    bus.$on("refreshList", async () => {
      this.initStatic();
    });
  },
  methods: {
    checkPermi,
    async initStatic() {
      let id = this.$route.query.id;
      this.id = id;

      if (!this.id) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$message.warning("缺少项目id，请从项目列表进入");
        setTimeout(() => {
          this.$router.back();
        }, 1000);
        return;
      }

      this.getProjectDetail();
    },
    /** 获取项目详情 */
    getProjectDetail() {
      let params = { id: this.id, md5: this.md5 };
      detail(params).then((res) => {
        if (res.code === 200) {
          // 基础表单
          let {
            projectName,
            projectType,
            projectStatus,
            projectManagerId,
            exStartTime,
            exEndTime,
            realStartTime,
            realEndTime,
            projectFile,
            tabFlag,
            fileId
          } = res.data;
          // tabFlag 控制待领取标注任务和待领取质检任务显隐
          this.tabFlag = tabFlag

          this.form["projectName"] = projectName;
          this.form["projectType"] = projectType;
          this.form["projectStatus"] = projectStatus;
          this.form["projectManagerId"] = projectManagerId;
          this.form["exStartTime"] = exStartTime;
          this.form["exEndTime"] = exEndTime;
          this.form["realStartTime"] = realStartTime;
          this.form["realEndTime"] = realEndTime;
          this.form["projectFile"] = projectFile && typeof projectFile === "array" ? projectFile : [];
          this.form["fileId"] = `${process.env.VUE_APP_BASE_API }/tools/view?fileId=${fileId}`;
          this.job_mode = res.data.configs?.job_mode[0];
          // 获取项目类型返显
          this.getDicts("project_status").then((response) => {
            this.projectStatusOptions = response.data;
          });

          //  质检员进入第一次调用质检任务接口，标注员和项目经理进入调用标注列表接口
          if (this.permissionStatus === 3) {
            this.checkTaskPaginationChange();
            this.activeName = "check";
          } else {
            this.taskPaginationChange();
            this.activeName = "task";
          }

          this.initData();
        }
      });
    },
    // 获取详情初始化字典库
    initData() {
      // 回显项目经理
      this.getDicts("project_type").then((response) => {
        this.projectType = response.data;

        let remark = response.data.find(
          (item) => item.dictValue === this.form.projectType
        )?.remark;
        let roleId = JSON.parse(remark).pm;
        // 获取所有项目经理人
        getRoleUser({ roleId }).then((res) => {
          if (res.code === 200) {
            this.projectManagers = res.data;
          }
        });
      });

      // 进2D页面和OCR 页面需要调用待领取两个列表接口
      if (this.form.projectType !== '3') {
        // 质检员进入第一次调用 质检任务，待领取质检
        if (this.permissionStatus === 3) {
          this.checkTaskPaginationChange();
          this.checkWaitPaginationChange();
          this.activeName = "check";
        } else if (this.permissionStatus === 2) {
          // 标注员进入 第一次调用 标注任务、待领取标注
          this.taskPaginationChange();
          this.jobWaitPaginationChange();
          this.activeName = "task";
        } else {
          // 项目经理  标注任务、待领取质检、待领取标注
          this.taskPaginationChange();
          this.checkWaitPaginationChange();
          this.jobWaitPaginationChange();
          this.activeName = "task";
        }
      }

      // 获取任务状态反显
      let dict;
      if (this.isGroup) {
        dict = "group_status";
      } else {
        dict = "t_job_type";
      }
      this.getDicts(dict).then((res) => {
        this.TaskStatusOptions = res.data;
      });
    },
    // 刷新
    handleRefresh(page) {
      switch (this.activeName) {
        case "marker":
          this.markerPage.pageNum = page ? page : this.markerPage.pageNum;
          this.markerPaginationChange();
          break;
        case "checker":
          this.checkerPage.pageNum = page ? page : this.checkerPage.pageNum;
          this.checkerPaginationChange();
          break;
        case "file":
          this.filePage.pageNum = page ? page : this.filePage.pageNum;
          this.filePaginationChange();
          break;
        case "task":
          this.taskPage.pageNum = page ? page : this.taskPage.pageNum;
          this.taskPaginationChange();
          break;
        case "check":
          this.checktaskPage.pageNum = page ? page : this.checktaskPage.pageNum;
          this.checkTaskPaginationChange();
          break;
        case "jobWaitTask":
          this.jobWaitPage.pageNum = page ? page : this.jobWaitPage.pageNum;
          this.jobWaitPaginationChange();
          break;
        case "CheckWaitTask":
          this.checkWaitPage.pageNum = page ? page : this.checkWaitPage.pageNum;
          this.checkWaitPaginationChange();
          break;
      }
    },
    /** tab切换事件 */
    async tabChange() {
      this.tabSHow = false;

      setTimeout(() => {
        this.tabSHow = true;
      }, 100);
      switch (this.activeName) {
        case "marker":
          this.markerPaginationChange();
          break;
        case "checker":
          this.checkerPaginationChange();
          break;
        case "file":
          this.filePaginationChange();
          break;
        case "task":
          this.taskPaginationChange();
          break;
        case "check":
          this.checkTaskPaginationChange();
          break;
        case "jobWaitTask":
          this.jobWaitPaginationChange();
          break;
        case "CheckWaitTask":
          this.checkWaitPaginationChange();
          break;
      }
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      this.$router.push({
        name: 'Detail',
        query: {
          id: this.id,
          type: this.form.projectType
        }
      })
    },
    /** 结束按钮操作 */
    closeProject(){
      getCloseProject({
        projectId: this.id,
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('项目关闭成功！')
        }
      })

    },
    // 点击跳转
    jumpPage(row) {
      let projectType = this.form.projectType;
      let isJob =
        this.activeName === "task" || this.activeName === "jobWaitTask";
      let isCheck =
        this.activeName === "check" || this.activeName === "jobWaitTask";
      let url;
      let checkpamars = {};
      console.log("projectType", this.form);
      if (projectType === "1") {
        if (isJob) {
          url = "/marks/ocr/jobDetail";
        } else if (isCheck) {
          url = "/marks/ocr/checkDetail";
        }
      }
      if (projectType === "2") {
        if (isJob) {
          url = "/timu/jobList";
        } else if (isCheck) {
          url = "/timu/jobList";
          checkpamars = { checker: true };
        }
      } else if (projectType === "3") {
        if (isJob) {
          url = "/marks/voice/detailVoiceJob";
        } else if (isCheck) {
          url = "/marks/voice/detailVoiceCheck";
        }
      } else if (projectType === "4") {
        // 标注任务、质检任务、待领取标注、待领取质检 都可以跳转
        if (isJob) {
          url = "/marks2d/2d/jobList";
        } else if (isCheck) {
          url = "/marks2d/2d/checkList";
        }
      } else if (projectType === "5") {
        // 标注任务、质检任务、待领取标注、待领取质检 都可以跳转
        if (isJob) {
          url = "/marks3d/job";
        } else if (isCheck) {
          url = "/marks3d/check";
        }
      }
      console.log('this.isGroup', this.isGroup);
      let query = this.isGroup
        ? { proId: this.id, groupId: row.id, groupStatus: row.groupStatus, ...checkpamars, jobmode: this.job_mode }
        : { id: row.id, proId: this.id };
      console.log(url, query);
      this.$router.push({
        path: url,
        query,
      });
    },
    // 取消选择
    cancelSelection() {
      this.selectedRow = null;
      this.transferOpen = false;
    },
    handleRowChange(row) {
      this.selectedRow = row;
    },
    /** 任务转移弹框搜索 */
    handleSearch(transferParams) {
      console.log("handleSearch");
      this.transferListApi({
        ...transferParams,
        projectId: this.id,
      }).then((res) => {
        if (res.code === 200) {
          this.transfersData = res.data.content;
          this.transTotal = res.data.allNum;
        }
      });
    },

    /** 任务转移确认转移 */
    handlejobTransfer() {
      // console.log(this.selectedRow);
      if (!this.selectedRow) {
        this.$message.warning("请至少选择一个");
        return;
      }

      let projectType = this.form.projectType;
      let { nickName, userId } = this.selectedRow;
      this.transferLoading = true;
      let isJob = this.activeName === "task";
      let baseParams = {
        newJobNickName: nickName,
        newJobUserId: userId,
      };
      let api;
      let params;
      switch (projectType) {
        case "1":
          api = isJob ? ocrJobTransfer : ocrCheckTransfer;
          params = {
            jobId: this.transferRow.id,
            ...baseParams,
          };
          break;
        case "2":
          api = isJob ? pdfJobTransfer : pdfCheckTransfer;
          params = {
            groupId: this.transferRow.id,
            ...baseParams,
          };
          break;
        case "3":
          api = isJob ? voiceJobTransfer : voiceCheckTransfer;
          params = {
            jobId: this.transferRow.id,
            ...baseParams,
          };
          break;
        case "4":
          api = isJob ? JobTransfer2D : checkTransfer2D;
          params = {
            groupId: this.transferRow.id,
            ...baseParams,
          };
          break;
        case "5":
          api = isJob ? JobTransfer3D : checkTransfer3D;
          params = {
            groupId: this.transferRow.id,
            ...baseParams,
          };
          break;
      }

      // console.log(this.transferRow, params, api);
      api(params)
        .then((res) => {
          this.transferLoading = false;
          this.$refs.transferForm?.resetFields();
          this.transferOpen = false;
          this.transferRow = null;

          this.userId = "";
          // 转移成功，重新刷新任务列表
          if (this.activeName === "task") {
            this.taskPaginationChange();
          } else {
            this.checkTaskPaginationChange();
          }
          this.$message.success("转移成功");
        })
        .catch(() => {
          this.transferLoading = false;
        });
    },
    // 打开标注转移弹框
    getTransferList(row) {
      this.transLoading = true;
      this.userId = "";
      this.resetForm("searchForm");
      this.transferOpen = true;
      this.transferRow = row ? row : this.transferRow;

      this.transferListApi({
        ...this.transferParams,
        projectId: this.id,
      })
        .then((res) => {
          if (res.code === 200) {
            this.transfersData = res.data.content;
            this.transferParams.total = res.data.allNum;
          }
        })
        .catch(() => {
          this.transLoading = false;
        });
    },
    // 取消标注转移弹框
    handleTransferCancel() {
      this.transferOpen = false;
      this.$refs.transferForm.resetFields();
    },
    // 回显项目经理
    getProjectManager(userId) {
      let target = this.projectManagers?.find((item) => item.userId === userId);
      return target?.nickName;
    },

    // 质检员名单
    checkerPaginationChange(obj) {
      this.tableLoading = true;
      this.checkerPage.currentPage =
        obj?.currentPage || this.checkerPage.currentPage;
      this.checkerPage.pageSize = obj?.pageSize || this.checkerPage.pageSize;
      getProjectChekers({
        nickName: this.checkerPage.nickName,
        projectId: this.id,
        pageNum: this.checkerPage.currentPage,
        pageSize: this.checkerPage.pageSize,
      })
        .then((res) => {
          if (res.code === 200) {
            this.checkerPage.total = res.data.allNum;
            this.checkersData = res.data.content;
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.transLoading = false;
        });
    },
    // 标注员名单
    markerPaginationChange(obj) {
      this.tableLoading = true;
      this.markerPage.currentPage =
        obj?.currentPage || this.markerPage.currentPage;
      this.markerPage.pageSize = obj?.pageSize || this.markerPage.pageSize;
      getProjectMarkers({
        nickName: this.markerPage.nickName,
        projectId: this.id,
        pageNum: this.markerPage.currentPage,
        pageSize: this.markerPage.pageSize,
      })
        .then((res) => {
          if (res.code === 200) {
            this.markersData = res.data.content;
            this.markerPage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.transLoading = false;
        });
    },
    // 文件管理
    filePaginationChange(obj) {
      this.tableLoading = true;
      this.filePage.currentPage = obj?.currentPage || this.filePage.currentPage;
      this.filePage.pageSize = obj?.pageSize || this.filePage.pageSize;
      getProjectFiles({
        projectId: this.id,
        pageNum: this.filePage.currentPage,
        pageSize: this.filePage.pageSize,
        fileName: this.filePage.fileName,
        // ...this.searchFile
      })
        .then((res) => {
          if (res.code === 200) {
            this.filesData = res.data.content;
            this.filePage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.transLoading = false;
        });
    },
    // 标注任务
    taskPaginationChange(obj) {
      this.tableLoading = true;
      this.taskNum++;
      this.taskPage.currentPage = obj?.currentPage || this.taskPage.currentPage;
      this.taskPage.pageSize = obj?.pageSize || this.taskPage.pageSize;
      const requests = {
        1: getOcrJobTask,
        2: getPdfJobTask,
        3: getVoiceJobTask,
        4: get2DJobTask,
        5: get3DJobTask,
      };
      // console.log(this.form.projectType);
      requests[this.form.projectType]({
        projectId: this.id,
        pageNum: this.taskPage.currentPage,
        pageSize: this.taskPage.pageSize,
        fileName: this.taskPage.fileName,
        ...this.taskPage,
      })
        .then((res) => {
          if (res.code === 200) {
            this.tasksData = res.data.content;
            this.taskPage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 质检任务
    checkTaskPaginationChange(obj) {
      this.tableLoading = true;
      this.checktaskPage.currentPage =
        obj?.currentPage || this.checktaskPage.currentPage;
      this.checktaskPage.pageSize =
        obj?.pageSize || this.checktaskPage.pageSize;
      const requests = {
        1: getOcrCheckTask,
        2: getPdfCheckTask,
        3: getVoiceCheckTask,
        4: get2DCheckTask,
        5: get3DCheckTask,
      };
      // console.log(this.form.projectType);
      requests[this.form.projectType]({
        projectId: this.id,
        pageNum: this.checktaskPage.currentPage,
        pageSize: this.checktaskPage.pageSize,
        fileName: this.checktaskPage.fileName,
        ...this.checktaskPage,
      })
        .then((res) => {
          if (res.code === 200) {
            this.checkTaskData = res.data.content;
            this.checktaskPage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 待领取标注任务
    jobWaitPaginationChange(obj) {
      console.log("getOCRWaitCheckTask");
      this.tableLoading = true;
      this.jobWaitPage.currentPage =
        obj?.currentPage || this.jobWaitPage.currentPage;
      this.jobWaitPage.pageSize = obj?.pageSize || this.jobWaitPage.pageSize;
      const requests = {
        1: getOCRWaitJobTask,
        4: get2DWaitJobTask,
        5: get3DWaitJobTask,
        2: getPDFWaitJobTask
      };
      // console.log(this.form.projectType);
      requests[this.form.projectType]({
        projectId: this.id,
        pageNum: this.jobWaitPage.currentPage,
        pageSize: this.jobWaitPage.pageSize,
        fileName: this.jobWaitPage.fileName,
        ...this.jobWaitPage,
      })
        .then((res) => {
          if (res.code === 200) {
            this.jobWaitData = res.data.content;
            this.jobWaitPage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 待领取质检任务
    checkWaitPaginationChange(obj) {
      console.log("checkWaitPaginationChange");
      this.tableLoading = true;
      this.checkWaitPage.currentPage =
        obj?.currentPage || this.checkWaitPage.currentPage;
      this.checkWaitPage.pageSize =
        obj?.pageSize || this.checkWaitPage.pageSize;
      const requests = {
        1: getOCRWaitCheckTask,
        4: get2DWaitCheckTask,
        5: get3DWaitCheckTask,
        2: getPDFWaitCheckTask
      };
      // console.log(this.form.projectType);
      requests[this.form.projectType]({
        projectId: this.id,
        pageNum: this.checkWaitPage.currentPage,
        pageSize: this.checkWaitPage.pageSize,
        fileName: this.checkWaitPage.fileName,
        ...this.checkWaitPage,
      })
        .then((res) => {
          if (res.code === 200) {
            this.checkWaitData = res.data.content;
            this.checkWaitPage.total = res.data.allNum;
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 通过名字搜索质检员
    checkersDataFilter(obj) {
      this.checkerPage.nickName = obj.conditions.text;
      this.checkerPage.currentPage = 1;
      this.checkerPaginationChange();
    },
    // 通过名字搜索标注员
    markersDataFilter(obj) {
      this.markerPage.nickName = obj.conditions.text;
      this.markerPage.currentPage = 1;
      this.markerPaginationChange();
    },
    // 搜索项目文件
    searchProjectFiles(obj) {
      this.filePage.fileName = obj.conditions.text;
      this.filePage.currentPage = 1;
      this.filePaginationChange();
    },
    // 标注任务搜索
    tasksDataFilter(obj) {
      this.taskPage[obj.fieldName] = obj.conditions[obj.filterType];
      this.taskPage.currentPage = 1;
      this.taskPaginationChange();
    },
    // 质检任务搜索
    checktasksDataFilter(obj) {
      this.checktaskPage[obj.fieldName] = obj.conditions[obj.filterType];
      this.checktaskPage.currentPage = 1;
      this.checkTaskPaginationChange();
    },
    // 待领取标注任务搜索
    jobWaitDataFilter(obj) {
      this.jobWaitPage[obj.fieldName] = obj.conditions[obj.filterType];
      this.jobWaitPage.currentPage = 1;
      this.jobWaitPaginationChange();
    },
    // 待领取质检任务搜索
    checkWaitDataFilter(obj) {
      this.checkWaitPage[obj.fieldName] = obj.conditions[obj.filterType];
      this.checkWaitPage.currentPage = 1;
      this.checkWaitPaginationChange();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.pagetitle {
  font-size: 16px;
  display: flex;
  align-items: center;
  background: #e8f4ff;
  padding: 5px;
  font-weight: 600;

  .line {
    margin-right: 10px;
    font-weight: 600;
    color: #1890ff;
  }
}

.label {
  display: inline-block;
  width: 120px;
  text-align: right;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  // color: #1D2129;
}

.content {
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  color: #909398;
}

.project-new {
  display: flex;
  flex-wrap: wrap;

  .el-col {
    width: 25%;
    border-bottom: 1px solid #ebecf0;
    margin-bottom: 20px;

    .label {
      display: block;
      text-align: left;
      color: #86909c;
    }

    .content {
      color: #1d2129;
      font-size: 16px;
    }
  }
}
</style>
