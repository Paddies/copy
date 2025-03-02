<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="任务id" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入任务id" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="文件名称" prop="likeFileName">
        <el-input v-model="queryParams.likeFileName" placeholder="请输入文件名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="当前状态" prop="jobType">
        <el-select v-model="queryParams.jobType" placeholder="请选择" size="small" clearable>
          <el-option v-for="dict in jobTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标注员" prop="likeJobNickName">
        <el-input v-model="queryParams.likeJobNickName" placeholder="请输入" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="审核员" prop="likeCheckNickName">
        <el-input v-model="queryParams.likeCheckNickName" placeholder="请输入审核员" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="handleExportCheckUserList"
          v-hasPermi="['group:list:userCheckPoi']">全部质检员统计数据</el-button> -->
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="roleList" height="600">
      <el-table-column type="index" label="序列" width="55" align="center" />
      <el-table-column label="任务id" prop="id" width="200" />
      <el-table-column label="页码" prop="titlePage" />
      <el-table-column label="题号" prop="titleNumber" />
      <el-table-column label="题目类型" prop="titleType" />
      <el-table-column label="文件名称" prop="fileName" width="300">
        <template slot-scope="scope">
          <div @click="handleUpdate(scope.row)">{{ scope.row.fileName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tags" width="100"/>

      <el-table-column label="当前状态" prop="jobType" :formatter="jobTypeFormat" />
      <el-table-column label="标注员" prop="jobNickName" />
      <el-table-column label="审核员" prop="checkNickName" />
      <el-table-column label="驳回次数" prop="checkNumber" />
      <el-table-column label="提交时间" prop="jobTime" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="质检时间" prop="chectTime" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="源文件" prop="fileId">
        <template slot-scope="scope">
          <div @click="downFile(scope.row)">{{ scope.row.fileId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="cTime" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleExport(scope.row)">导出</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-upload class="upload-demo" drag :action="this.fileUrl" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <el-button type="primary" icon="el-icon-plus" size="mini">完成上传后点击此处返回</el-button>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { roleDeptTreeselect } from "@/api/system/dept";
import { page, add, update, poiXml } from "@/api/project/job";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ListCheck",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      //文件上传地址
      fileUrl: process.env.VUE_APP_BASE_API + "/tools/upFile",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 状态数据字典
      jobTypeOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限",
        },
        {
          value: "2",
          label: "自定数据权限",
        },
        {
          value: "3",
          label: "本部门数据权限",
        },
        {
          value: "4",
          label: "本部门及以下数据权限",
        },
        {
          value: "5",
          label: "仅本人数据权限",
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        jobType: "2",
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" },
        ],
        roleSort: [
          { required: true, message: "用户顺序不能为空", trigger: "blur" },
        ],
        aa: [{ required: true, message: "用户顺序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    // this.handlePage()

    this.getDicts("user_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("t_job_type").then((response) => {
      this.jobTypeOptions = response.data;
      console.log(this.jobTypeOptions);
    });
  },
  mounted() {
    this.getList();
  },
  destroyed() {
    // sessionStorage.removeItem("topicDetail");
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      // 存入当前页码
      sessionStorage.setItem('topicPage', this.queryParams.pageNum)

      this.loading = true;
      page({ ...this.addDateRange(this.queryParams, this.dateRange), groupId: this.$route.query.groupId }).then(
        (response) => {
          this.roleList = response.data.content;
          this.total = response.data.allNum;
          this.queryParams.pageNum = response.data.page;
          this.queryParams.pageSize = response.data.size;
          this.loading = false;
        }
      );
    },
    /** 处理页面 */
    handlePage() {
      if (sessionStorage.getItem('topicDetail')) {
        //如果有这个就读取缓存里面的数据
        this.queryParams.pageNum = Number(sessionStorage.getItem("topicPage"));
      } else {
        this.queryParams.pageNum = 1;
        //这个主要是从其他页面第一次进入列表页，清掉缓存里面的数据
        sessionStorage.removeItem("topicPage");
      }
    },
    jobTypeFormat(row, column) {
      return this.selectDictLabel(this.jobTypeOptions, row.jobType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      (this.form = {
      });
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      window.localStorage.setItem("checkZj", JSON.stringify(this.queryParams));
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 质检审批 */
    handleUpdate(row) {
      // 新老版本区分
      if (row.versionNo) {
        this.$router.push({
          path: '/marks/pdfDetail',
          query: {
            id: row.id,
            file: row.fileId,
            checker: true
          }
        });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      const THIS = this;
      this.$confirm("是否确认导出所选任务的XML文件吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          window.open(
            process.env.VUE_APP_BASE_API + "/tools/poiXml?ids=" + THIS.ids,
            "_blank"
          );
          // poiXml({"ids":THIS.ids}).then((response) => {
          //   this.msgSuccess("导出成功");
          //   this.open = false;
          // });
        })
        .then((response) => {
          this.download(response.msg);
        });
    },

    downFile(row) {
      window.open(
        process.env.VUE_APP_BASE_API + "/tools/downFile?fileId=" + row.fileId,
        "_blank"
      );
    },
    allExport() {
      window.open(process.env.VUE_APP_BASE_API + "/tools/poiXmlAll", "_blank");
    },
    handleExportCheckUserList() {
      const queryParams = this.queryParams;
      this.$confirm("是否导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.poidownload("data:userCheckUser");
      });
    },
  },
};
</script>
