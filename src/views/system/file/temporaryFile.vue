<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="项目名称" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="导出标签" prop="tags">
        <el-input v-model="queryParams.tags" placeholder="导出标签" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" clearable placeholder="请选择项目类型" size="small">
          <el-option v-for="dict in dict.type.project_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="操作人员" prop="cUserName">
        <el-input v-model="queryParams.cUserName" placeholder="操作人员" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>


      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="info" plain icon="el-icon-download" size="small" @click="handleAllExport"
               v-hasPermi="['group:data:all']" style="float: right;margin: 10px;">导出
    </el-button>


    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button
        >
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="roleList" :height="'700px'">
      <el-table-column type="index" label="序列" width="55" align="center"/>
      <el-table-column label="项目名称" prop="projectName" width="200"/>
      <el-table-column label="项目类型" prop="projectType" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.project_type" :value="scope.row.projectType"/>
        </template>
      </el-table-column>
      <el-table-column label="导出标签" prop="tags" width="200"/>
      <el-table-column label="导出状态" prop="exportType" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.export_type" :value="scope.row.exportType"/>
        </template>
      </el-table-column>
      <el-table-column label="导出文件" prop="fileName" width="200"/>
      <el-table-column label="操作人" prop="cUserName" width="150"/>
      <el-table-column label="导出时间" prop="cTime" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.exportType === '2'" icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">下载
          </el-button>
          <!--          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:file:delete']"-->
          <!--            @click="handleDelete(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <el-dialog :title="'项目导出'" :visible.sync="exportCheck" width="500px" append-to-body>
      <el-form ref="exportFrom" :model="exportFrom" :rules="exportrules" label-width="80px">
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="exportFrom.projectId" type="text" placeholder="请填入项目ID" size="mini"
                    style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="导出标签" prop="tags">
          <el-input v-model="exportFrom.tags" type="text" placeholder="请填入导出标签" size="mini"
                    style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="mini" type="primary" class="cur-buttom" @click="subOkCheckForm">确 定</el-button>
        <el-button size="mini" class="cur-buttom" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-upload class="upload-demo" drag :action="this.fileUrl" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="finishUpdate">完成上传后点击此处返回
          </el-button>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  page as page,
  item as item,
  del as del,
  update as update,
  exprort as downZipFileByGroup,
} from "@/api/system/temporaryFile";
import {deleteTempFile} from '@/api/tool/gen.js'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Role",
  dicts: ['project_type', 'export_type'],
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
      // 导出表单
      exportFrom: {
        projectId: undefined,
        tags: undefined,
      },
      exportCheck: false,
      // 状态数据字典
      statusOptions: [],
      // 状态数据字典
      lcbTypeOptions: [],
      // 支付字典
      payTypeOptions: [],
      // 编码类型付字典
      lcTypeOptions: [],
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
        pageSize: 50

      },
      exportrules: {
        projectId: [
          {required: true, message: "项目ID不能为空", trigger: "blur"},
        ],
        tags: [
          {required: true, message: "导出标签不能为空", trigger: "blur"},
        ]
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
          {required: true, message: "用户名称不能为空", trigger: "blur"},
        ],
        roleKey: [
          {required: true, message: "权限字符不能为空", trigger: "blur"},
        ],
        roleSort: [
          {required: true, message: "用户顺序不能为空", trigger: "blur"},
        ],
        aa: [{required: true, message: "用户顺序不能为空", trigger: "blur"}],
      },
    };
  },
  created() {
    // this.fileUrl=this.geturl("tools/upFile");
    this.getList();
    this.getDicts("user_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
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
    handleAllExport() {
      this.exportCheck = true;
    },
    subOkCheckForm() {
      this.$refs.exportFrom.validate(valid => {
        if (valid) {
          this.exportCheck = false;
          downZipFileByGroup(this.addDateRange({...this.exportFrom}, this.dateRange)).then((response) => {
            this.exportCheck = false;
            this.$message.success("数据生成中，稍后请在临时文件中下载");
            this.resetForm("exportFrom");
            this.getList();
          });
        }
      })
    },
    closeDialog() {
      this.resetForm("exportFrom");
      this.exportCheck = false;
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 菜单状态字典翻译
    userOpenFormat(row, column) {
      return this.selectDictLabel(this.lcbTypeOptions, row.lcbType);
    }, //支付类型字典
    pyaOpenFormat(row, column) {
      return this.selectDictLabel(this.payTypeOptions, row.payType);
    }, // 菜单状态字典翻译
    // usOpenerFormat(row, column) {
    //   return this.selectDictLabel(this.userOpenOptions, row.userOpen);
    // },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then((response) => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
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
      this.title = "添加文件";
    },
    /** 下载 */
    handleUpdate(row) {
      window.open(
        process.env.VUE_APP_BASE_API + "/tools/downFile?fileId=" + row.fileId,
        "_blank"
      );
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      let that = this
      this.$confirm("是否删除该数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          deleteTempFile({id: row.id}).then(res => {

            that.$message.success("删除成功");
            that.getList()
          })
        })
    },
    /** 文件上传后返回 */
    finishUpdate() {
      this.reset();
      this.open = false;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog .el-form-item--medium .el-form-item__content {
  line-height: 28px;
  border-left: 1px solid rgb(223, 220, 220);
}

.el-form {
  border: 0px;
}

.cur-buttom {
  width: 47%;
  height: 38px;
  margin-right: 8px;
  margin-top: 20px;
}

::v-deep .el-dialog {
  border-radius: 4px;
}

::v-deep .el-upload-dragger {
  width: 460px;
  height: 250px;
  background-color: #F2F3F5;
}

::v-deep .el-dialog .el-form-item {
  color: #4e5969;
  border-radius: 2px;
  background: var(--light-fill-2, #f2f3f5);
  border-radius: 3px;
}
</style>
