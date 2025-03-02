<template>
  <div class="app-container common-buttom
">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="文件名称" prop="likeFileName">
        <el-input v-model="queryParams.likeFileName" placeholder="请输入文件名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="审核员" prop="likeCheckNickName">
        <el-input v-model="queryParams.likeCheckNickName" placeholder="请输入审核员" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="当前状态" prop="jobType">
        <el-select v-model="queryParams.jobType" placeholder="请选择当前状态" size="small" clearable>
          <el-option v-for="dict in jobTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="newHandleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="roleList" height="700">
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="任务id" prop="id" width="200" />
      <el-table-column label="页码" prop="titlePage" width="100" />
      <el-table-column label="题号" prop="titleNumber" width="100" />
      <el-table-column label="题目类型" prop="titleType" width="100" />
      <el-table-column label="文件名称" prop="fileName" width="200">
        <template slot-scope="scope">
          <div @click="handleUpdate(scope.row)">{{ scope.row.fileName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tags" width="100" />

      <!-- <el-table-column label="当前状态" prop="jobType" :formatter="jobTypeFormat" width="100" /> -->
      <el-table-column label="当前状态" prop="jobType" :formatter="jobTypeFormat">
        <template slot-scope="scope">
          <span  :class="`status-tag status-tag-jobStatus-${scope.row.jobType}`">{{jobTypeFormat(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标注员" prop="jobNickName" width="200" />
      <el-table-column label="审核员" prop="checkNickName" width="200" />
      <el-table-column label="源文件" prop="fileId" width="200">
        <template slot-scope="scope">
          <div @click="downFile(scope.row)">{{ scope.row.fileId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="jobTime" :show-overflow-tooltip="true" width="200" :formatter="formatDate" />
      <el-table-column label="质检时间" prop="chectTime" :show-overflow-tooltip="true" width="200" :formatter="formatDate" />
      <el-table-column label="创建时间" prop="cTime" :show-overflow-tooltip="true" width="200" :formatter="formatDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['pdf:job:detail']">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-upload class="upload-demo" drag :action="this.fileUrl" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip"><el-button type="primary" icon="el-icon-plus" size="mini"
            @click="finishUpdate">完成上传后点击此处返回</el-button></div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
import { jobUserPage as page, add, update, deleteJob } from "@/api/project/job";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "@/assets/scss/commonButtom.scss"; //  css


export default {
  name: "List",
  data() {
    return {
      // 遮罩层
      loading: true,
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
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
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
    // this.fileUrl=this.geturl("tools/upFile ");
    if (sessionStorage.getItem('topic_list')) {
      this.queryParams = JSON.parse(sessionStorage.getItem('topic_list'))
    }

    if (this.$route.query.groupId) {
      this.queryParams.groupId = this.$route.query.groupId;
    }

    this.getDicts("user_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("t_job_type").then((response) => {
      this.jobTypeOptions = response.data;
      // console.log(this.jobTypeOptions)
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
      //sessionStorage.setItem('topicListPage', this.queryParams.pageNum)
      sessionStorage.setItem('topic_list', JSON.stringify(this.queryParams))
      this.loading = true;
      page(this.addDateRange(this.queryParams, this.dateRange)).then(
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
      console.log('topicDetail', sessionStorage.getItem('topicDetail'));
      //if (sessionStorage.getItem('topicDetail')) {
      //如果有这个就读取缓存里面的数据
      //this.queryParams.pageNum = Number(sessionStorage.getItem("topicListPage"));
      //} else {
      //this.queryParams.pageNum = 1;
      //这个主要是从其他页面第一次进入列表页，清掉缓存里面的数据
      //sessionStorage.removeItem("topicListPage");
      //}
    },
    // 删除任务
    deleteJob(row) {
      deleteJob({
        id: row.id
      }).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功！")
          this.getList()
        }
      })
    },
    // 菜单状态字典翻译
    userOpenFormat(row, column) {
      return this.selectDictLabel(this.lcbTypeOptions, row.lcbType);
    },
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property]
      if (data == null) {
        return null
      }
      let dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    jobTypeFormat(row, column) {
      // console.log(row.jobType)
      // console.log(this.selectDictLabel(this.jobTypeOptions, row.jobType))
      return this.selectDictLabel(this.jobTypeOptions, row.jobType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    downFile(row) {
      window.open(process.env.VUE_APP_BASE_API + "/tools/downFile?fileId=" + row.fileId, '_blank')
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      add({ "groupId": this.$route.query.groupId,}).then((response) => {
        this.open = false;
        if (response.data.mark == "1") {
          this.$message('您有未完成的任务');
        }
        // this.$router.push({path: '/marks/pdfDetail?id='+response.data.id+'&file='+response.data.fileId+'&groupId='+this.$route.query.groupId});
        this.$router.push({
          path: '/marks/pdfDetail',
          query: {
            id: response.data.id,
            fileId: response.data.fileId,
            groupId: this.$route.query.groupId,
            proId: this.$route.query.proId
          }
        })
      });
    },
    /**
     *@Description: 新版新增
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    newHandleAdd() {
      add({ "groupId": this.$route.query.groupId, versionNo: '1' }).then((response) => {
        this.open = false;
        if (response.data.mark == "1") {
          this.$message('您有未完成的任务');
        }
        this.$router.push({
          path: '/marks/pdfDetail',
          query: {
            id: response.data.id,
            fileId: response.data.fileId,
            groupId: this.$route.query.groupId,
            proId: this.$route.query.proId
          }
        })
      });
    },

    /** 详情 */
    handleUpdate(row) {
      // this.$router.push({path: '/marks/topic?id='+row.id+'&file='+row.fileId+'&groupId='+this.$route.query.groupId})
      // this.$router.push({path: `/marks/${row.versionNo ? 'pdfDetail' : 'topic'}?id=`+row.id+'&file='+row.fileId+'&groupId='+this.$route.query.groupId})
      this.$router.push({
        path: '/marks/pdfDetail',
        query: {
          id: row.id,
          fileId: row.fileId,
          groupId: this.$route.query.groupId,
          checker: this.$route.query.checker,
          proId: this.$route.query.proId,

        }
      })
    },
    /* 新详情 */
    newHandleUpdate(row) {
      // this.$router.push({path: '/marks/pdfDetail?id='+row.id+'&file='+row.fileId+'&groupId='+this.$route.query.groupId})
      this.$router.push({
        path: '/marks/pdfDetail',
        query: {
          id: row.id,
          fileId: row.fileId,
          groupId: this.$route.query.groupId
        }
      })
    },
    /** 文件上传后返回 */
    finishUpdate() {
      this.reset();
      this.open = false;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //修改
            update(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            //新增
            add({}).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function () {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then((response) => {
          this.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有角色数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRole(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-button--text {
  border-color: transparent;
  color: #1890ff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
</style>
