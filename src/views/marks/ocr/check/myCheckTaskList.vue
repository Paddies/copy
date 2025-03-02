<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="图片ID" prop="fileId">
        <el-input v-model="queryParams.fileId" size="small" clearable placeholder="请输入图片ID" />
      </el-form-item>
      <el-form-item label="标签" prop="tagName">
        <el-input v-model="queryParams.tagName" size="small" clearable placeholder="请输入标签名称" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectId">
        <el-select v-model="queryParams.projectId" filterable clearable placeholder="请选择项目" size="small">
          <el-option v-for="dict in projectList" :key="dict.id" :label="dict.projectName" :value="dict.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标注员" prop="jobNickName">
        <el-input v-model="queryParams.jobNickName" placeholder="请输入标注员" clearable size="small" />
      </el-form-item>
      <el-form-item label="质检员" prop="checkNickName">
        <el-input v-model="queryParams.checkNickName" placeholder="请输入质检员" clearable size="small" />
      </el-form-item>
      <el-form-item label="状态" prop="jobStatus">
        <el-select v-model="queryParams.jobStatus" placeholder="请选择任务状态" clearable  size="small">
          <el-option v-for="dict in dict.type.t_job_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" @click="handleQuery" size="small">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%">
      <el-table-column type="index" width="55" fixed align="center" label="序列" />
      <el-table-column label="图片ID" prop="fileId" width="200" align="center" />
      <el-table-column label="项目名称" prop="projectName" width="200" align="center" />
      <el-table-column label="任务状态" prop="jobStatus" width="100" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_job_type" :value="scope.row.jobStatus" />
        </template>
      </el-table-column>
      <el-table-column label="标注员" prop="jobNickName" width="200" align="center" />
      <el-table-column label="标签" prop="tags" width="200" align="center" />
      <el-table-column label="提交时间" prop="submitTime" width="200" align="center" />
      <el-table-column label="质检员" prop="checkNickName" width="100" align="center" />
      <el-table-column label="质检时间" prop="checkTime" width="200" align="center" />
      <el-table-column label="驳回原因" prop="checkNote" width="200" align="center" show-overflow-tooltip />
      <el-table-column label="数据类型（字典）" prop="imageTypeName" width="200" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleTag(scope.row)">标签</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="附件ID" prop="model">
          <el-input v-model="form.sourceId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="json定制数据" prop="note">
          <el-input v-model="form.note" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 标签弹框 -->
    <el-dialog :title="title" :visible.sync="open1" width="800px" append-to-body>
      <el-radio-group v-model="labelType.value">
        <el-radio v-for="dict in dict.type.group_label" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTag" size="small">确 定</el-button>
        <el-button @click="cancel" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page as proPage } from "@/api/project/project";
import { page, submitTag } from "@/api/project/imgCheck";

export default {
  name: "imgCheck",
  dicts: ["t_job_type", "group_label"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      listData: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      // 标签
      labelType: {
        value: "",
      },
      // 打标签的id
      tagById: null,
      projectList: [],
      jsonOptions: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        fileId: undefined,
        jobNickName: undefined,
        checkNickName: undefined,
        jobStatus: '',
        projectName: undefined,
        tagName: "",
      },
      // 表单参数
      form: {
        note: {},
      },
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
    this.getProjectList();
    this.getDicts("mark_select_json").then((response) => {
      this.jsonOptions = response.data;
      this.jsonOptions.forEach((dict) => {
        this.form.note[dict.dictValue] = "";
      });
    });
  },
  mounted() {
    if (localStorage.getItem("imgCheck")) {
      this.queryParams = JSON.parse(localStorage.getItem("imgCheck"));
    }
    if(this.$route.params.id) this.queryParams.projectId = this.$route.params.id
    this.getList();
  },
  destroyed() {
    sessionStorage.removeItem("markDetail");
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      localStorage.setItem("imgCheck", JSON.stringify(this.queryParams));
      sessionStorage.setItem("imgCheckPage", this.queryParams.pageNum);

      page(this.queryParams).then((response) => {
        this.listData = response.data.content;
        this.total = response.data.allNum;
        this.queryParams.pageNum = response.data.page;
        this.queryParams.pageSize = response.data.size;
        this.loading = false;
        this.mark = true;
      });
    },
    /** 获取项目列表 */
    async getProjectList() {
      let res = await proPage({ projectType: "1" });
      this.projectList = res.data.content;
    },

    /** 处理页面 */
    handlePage() {
      if (sessionStorage.getItem("markDetail")) {
        //如果有这个就读取缓存里面的数据
        this.queryParams.pageNum = Number(
          sessionStorage.getItem("imgCheckPage")
        );
      } else {
        this.queryParams.pageNum = 1;
        //这个主要是从其他页面第一次进入列表页，清掉缓存里面的数据
        sessionStorage.removeItem("imgCheckPage");
      }
    },
    /** 获取项目列表 */
    async getProjectList() {
      let res = await proPage({ projectType: '1' })
      this.projectList = res.data.content;
    },

    /** 处理页面 */
    handlePage() {
      if (sessionStorage.getItem('markDetail')) {
        //如果有这个就读取缓存里面的数据
        this.queryParams.pageNum = Number(sessionStorage.getItem("imgCheckPage"));
      } else {
        this.queryParams.pageNum = 1;
        //这个主要是从其他页面第一次进入列表页，清掉缓存里面的数据
        sessionStorage.removeItem("imgCheckPage");
      }
    },
    toJob(row) {
      this.$router.push({
        name: "JobList",
        query: {
          groupId: row.id,
        },
      });
    },
    toContext(row) {
      this.$router.push({
        name: "Content",
        query: {
          groupId: row.id,
        },
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.open1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.labelType.value = "";
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加表单数据";
      this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.id);
      this.$router.push({
        name: "ocrCheckDetail",
        query: {
          id: row.id,
        },
      });
    },
    /** 打标签 */
    handleTag(row) {
      this.labelType.value = row.tags || "";
      this.tagById = row.id;
      this.open1 = true;
      this.title = "请选择标签类型";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //修改
            update(this.form).then((response) => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            //新增
            add(this.form).then((response) => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交标签 */
    submitTag() {
      console.log("this.labelType.value", this.labelType.value);
      if (this.labelType.value === "") {
        this.$message.warning("请选择标签类型");
        return;
      }

      submitTag({
        id: this.tagById,
        tags: this.labelType.value,
      }).then((res) => {
        this.$message.success("操作成功");
        this.open1 = false;
        this.getList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-radio {
  margin-bottom: 20px;
}
</style>
