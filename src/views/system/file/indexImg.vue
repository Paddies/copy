<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="ID" prop="fileId">
        <el-input v-model="queryParams.fileId" placeholder="请输入文件ID" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="文件名称" prop="likeFileName">
        <el-input v-model="queryParams.likeFileName" placeholder="请输入文件名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="roleList" height="600">
      <el-table-column type="index" label="序列" width="55" align="center" />
      <el-table-column label="文件ID" prop="fileId" width="240" />
      <el-table-column label="文件名称" prop="fileName" width="240" />
      <el-table-column label="MD5码" prop="md5" width="360" />
      <el-table-column label="标签管理" prop="tags" />
      <el-table-column label="创建时间" prop="cTime" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="openTag" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog title="新增标签" :visible.sync="tagFormOpen" width="800px" append-to-body>

      <el-form ref="tagForm" :model="tagForm" :rules="tagFormRules" size="mini" label-width="80px" label-position="left"
        class="cur-input">
        <el-form-item label="标签：" prop="tags">
          <el-input v-model="tagForm.tags" placeholder="请输入标签" />
        </el-form-item>
        <p>
          标签注意事项描述：<span>标签格式为人名+上传时间</span>
        </p>
        <el-button type="primary" size="mini" @click="handleClose" class="cur-buttom"
          style="background-color: #F2F3F5; border: 0px;color: black;">取消</el-button>
        <el-button type="primary" size="mini" @click="submitUpload" class="cur-buttom">提交</el-button>
      </el-form>
    </el-dialog>
    <!-- 上传弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <p>标签：{{ tagForm.tags }}</p>
      <el-upload class="upload-demo" drag :data="{tags: tagForm.tags}"  :action="this.fileUrl" accept=".zip" multiple :on-success="uploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finishUpdate" size="small" class="buttom-primary">确 定</el-button>
        <el-button @click="open = false" size="small" class="buttom-primary">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect,
  file,
} from "@/api/system/dept";
import {
  page, add, update, del
} from "@/api/system/fileUpImg";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "fileImg",
  data() {
    return {
      tagFormOpen: false,
      tagForm: {
        tags: ''
      },
      tagFormRules: {
        tags: [
          { required: true, message: '请输入标签名称' }
        ]
      },
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
      openTag: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      //文件上传地址
      fileUrl: process.env.VUE_APP_BASE_API + "/tools/upFileImg",
      // 日期范围
      dateRange: [],
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
    // this.fileUrl=this.geturl("tools/upFile");
    this.getList();
    this.getDicts("user_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    handleClose() {
      this.tagFormOpen = false;
    },
    submitUpload() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.open = true
        }
      })
    },
    uploadSuccess(response) {
      if (response.code === '500') {
        this.$message.error(response.msg)
        return
      }
      this.$message.success(response.msg)
        this.getList();
    },
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
      this.openTag = false;
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
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == "dept") {
        this.form.deptCheckStrictly = value ? true : false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.tagFormOpen = true
      this.reset();
      // this.open = true;
      this.title = "添加文件";
    },
    handleEdit(row) {
      var newObj = JSON.parse(JSON.stringify(row));
      this.form = newObj;
      this.open = true;
      this.title = "修改表单数据";
    },
    /** 下载 */
    handleUpdate(row) {
      window.open(
        process.env.VUE_APP_BASE_API + "/tools/downFile?fileId=" + row.fileId,
        "_blank"
      );
    },
    /** 文件上传后返回 */
    finishUpdate() {
      this.getList();
      this.reset();
      this.open = false;
      this.$refs.tagForm.resetFields()
      this.$nextTick(() => {
        this.tagFormOpen = false;
      })
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
              this.openTag = false;
              this.getList();
            });
          } else {
            //新增
            add(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.openTag = false;
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
::v-deep.el-form-item--mini .el-form-item__label {
  line-height: 28px;
  border-right: 1px solid rgb(223, 220, 220);
  padding: 3px;
}

.el-form {
  border: 0px;
}

.cur-buttom {
  width: 46%;
  height: 38px;
  margin-right: 24px;
  margin-top: 20px;
}

.buttom-primary {
  width: 43%;
  height: 38px;
  margin-right: 15px;
}

::v-deep .el-dialog {
  border-radius: 4px;
}

::v-deep .el-upload-dragger {
  width: 460px;
  height: 250px;
  background-color: #F2F3F5;
}
</style>

