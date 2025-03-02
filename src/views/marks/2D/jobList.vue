<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="文件ID" prop="fileId">
        <el-input v-model="queryParams.fileId" placeholder="请输入文件名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="当前状态" prop="jobStatus">
        <el-select v-model="queryParams.jobStatus" placeholder="请选择当前状态" size="small" clearable>
          <el-option v-for="dict in jobTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" height="700">
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="文件ID" prop="fileId" width="200" />
      <el-table-column label="文件名称" prop="fileName" width="200" />
      <el-table-column label=" 缩略图" prop="fileId">
        <template slot-scope="scope">
          <div>
            <el-image style="width: 100px; height: 100px" :src="getImage(scope.row.fileId)"
              :preview-src-list="[getImage(scope.row.fileId)]" fit="contain">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="jobStatus" :formatter="jobTypeFormat">
        <template slot-scope="scope">
          <span :class="`status-tag status-tag-jobStatus-${scope.row.jobStatus}`">{{ jobTypeFormat(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标注员" prop="jobNickName" />
      <el-table-column label="标注时间" prop="submitTime" :formatter="formatDate" />
      <el-table-column label="任务耗时" prop="jobTimeConsumingDesc" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)">查看</el-button>
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
import { get2DjobList } from "@/api/project/2d";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  name: "List",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //文件上传地址
      fileUrl: process.env.VUE_APP_BASE_API + "/tools/upFile",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 状态数据字典
      jobTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: undefined,
        jobStatus: undefined,
        jobMode: undefined
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    if (this.$route.query.groupId) {
      this.queryParams.groupId = this.$route.query.groupId;
    }
    if (this.$route.query.jobmode) {
      this.queryParams.jobMode = this.$route.query.jobmode;
    }
    this.getDicts("t_job_type").then((response) => {
      this.jobTypeOptions = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询任务清单列表 */
    getList() {
      this.loading = true;
      get2DjobList(this.queryParams).then(
        (response) => {
          this.tableData = response.data.content;
          this.total = response.data.allNum;
          this.queryParams.pageNum = response.data.page;
          this.queryParams.pageSize = response.data.size;
          this.loading = false;
        }
      ).catch(() => {
        this.loading = false;
      });
    },
    getImage(fileId) {
      return process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
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
      return this.selectDictLabel(this.jobTypeOptions, row.jobStatus);
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
    /** 详情 */
    handleUpdate(row) {
      let { groupId, groupStatus } = this.$route.query
      this.$router.push({
        path: '/marks2D/job',
        query: {
          id: row.id,
          file: row.fileId,
          proId: row.projectId,
          groupId: groupId,
          groupStatus: groupStatus,
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
          file: row.fileId,
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
  },
};
</script>
