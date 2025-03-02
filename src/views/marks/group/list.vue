<template>
  <div class="app-container common-buttom
">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="文件名称" prop="likeFileName">
        <el-input v-model="queryParams.likeFileName" size="small" clearable placeholder="请输入文件名称" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectId">
        <el-select v-model="queryParams.projectId" filterable clearable placeholder="请选择项目" size="small">
          <el-option v-for="dict in projectList" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="功能" prop="model">
        <el-input v-model="queryParams.versionNo" placeholder="请输入" />
      </el-form-item> -->
      <el-form-item label="任务状态" prop="groupStatus">
        <el-select v-model="queryParams.groupStatus" clearable placeholder="请选择任务状态" size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="领取者名称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入领取者名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="质检员名称" prop="checkNickName">
        <el-input v-model="queryParams.checkNickName" placeholder="请输入质检员名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="批次号" prop="batchId">
        <el-select v-model="queryParams.batchId" placeholder="请选择批次号" clearable size="small">
          <el-option v-for="item in groupLabel" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker size="small" v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>

        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQueryNull">未分配查询</el-button>

        <!-- <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button> -->

        <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd" v-hasPermi="['group:add']"
          plain>新增</el-button> -->

        <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleExport"
          v-hasPermi="['group:list:userPoi']">导出用户统计</el-button>

        <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleAllExport"
          v-hasPermi="['group:data:all']">导出全部xml数据</el-button>
      </el-form-item>
    </el-form>
    <!--      @selection-change="handleSelectionChange"-->
    <el-table :data="roleList" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序列" width="55" fixed align="center" />
      <el-table-column label="附件ID" prop="sourceId" width="200" align="center">
        <template slot-scope="scope">
          <div @click="downFile(scope.row)">
            {{ scope.row.sourceId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文件名称" prop="fileName" width="200" align="center" />
      <el-table-column label="项目名称" prop="projectName" width="200" align="center" />
      <el-table-column label="任务认领者" prop="nickName" width="200" align="center" />
      <el-table-column label="质检员" prop="checkNickName" width="200" align="center" />
      <el-table-column label="批次" prop="batchId" width="200" :formatter="labelFormat" align="center" />
      <el-table-column label="状态" prop="groupStatus" width="200" :formatter="statusFormat" align="center" />
      <el-table-column label="已创建数量" prop="jobNum" width="100" align="center" />
      <el-table-column label="已审核数量" prop="finishNum" width="100" align="center" />
      <el-table-column label="已标记的小题数量" prop="quizNum" width="150" align="center" />
      <el-table-column label="驳回订单数量" prop="backNum" width="100" align="center" />
      <!-- <el-table-column label="项目经理名称" prop="tag" :formatter="tagFormat" align="center" /> -->
      <el-table-column label="标注完成时间" prop="finishTime" :show-overflow-tooltip="true" :formatter="formatDate" width="150"
        align="center" />
      <el-table-column label="创建时间" prop="cTime" :show-overflow-tooltip="true" :formatter="formatDate" width="150"
        align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <CheckListButtons :buttons="permissionButton" :row="scope.row" @clickButton="handleUpdateStatus" type="job" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="项目" prop="projectId" required>
          <el-select v-model="form.projectId" placeholder="请选择项目" clearable>
            <el-option v-for="dict in projectList" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件ID" prop="sourceId" required>
          <el-input v-model="form.sourceId" placeholder="请输入附件ID" />
        </el-form-item>
        <el-form-item label="状态" prop="groupStatus" required>
          <el-select v-model="form.groupStatus" placeholder="请选择状态" clearable>
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次" prop="batchId" required>
          <el-select v-model="form.batchId" placeholder="请选择批次" clearable>
            <el-option v-for="dict in groupLabel" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="标签" prop="tag">-->
        <!--          <el-select v-model="form.tag"  placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="dict in tagOptions"-->
        <!--              :key="dict.dictValue"-->
        <!--              :label="dict.dictLabel"-->
        <!--              :value="dict.dictValue"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item label="任务领取者" prop="note">
          <el-input v-model="form.note" placeholder="请输入任务领取者" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 标注完成 -->
    <el-dialog :title="title" :visible.sync="okCheckOpen" width="600px" append-to-body>
      <el-form ref="okCheckForm" :model="okCheckForm" :rules="okcheckrules" label-width="80px">
        <el-form-item label="科目" prop="subject">
          <!-- <el-input size="mini" v-model="okCheckForm.subject" type="text" placeholder="请填入科目"></el-input> -->
          <el-select v-model="okCheckForm.subject" size="mini" clearable placeholder="请选择科目" style="width: 100%;">
            <el-option v-for="option in subjects" :key="option.dictValue" :label="option.dictLabel"
              :value="option.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <!-- <el-input v-model="okCheckForm.language" type="text" placeholder="请填入语言"></el-input> -->
          <el-select v-model="okCheckForm.language" size="mini" clearable placeholder="请选择语言" style="width: 100%;">
            <el-option v-for="option in languages" :key="option.dictValue" :label="option.dictLabel"
              :value="option.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份" prop="pubYear">
          <el-input v-model="okCheckForm.pubYear" type="text" placeholder="请填入年份" size="mini"
            style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="subOkCheckForm">确 定</el-button>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">

      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  pageNull,
  add,
  update,
  del,
  downZipFileByGroup,
  statusUpdate, reall, quick
} from "@/api/project/group";
import {
  page as proPage,
} from "@/api/project/project";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CheckListButtons from './CheckListButtons.vue';
import "@/assets/scss/commonButtom.scss"; //  css


export default {
  components: { CheckListButtons, },
  name: "Group",
  data() {
    return {
      mark: true,
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
      roleList: null,
      projectList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 标注完成弹出
      okCheckOpen: false,
      okCheckForm: {
        subject: '',
        language: '',
        pubYear: ''
      },
      // 标注完成前，当前点击的行
      okCheckRow: null,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      jsonOptions: [],
      tagOptions: [],
      // 状态数据字典
      statusOptions: [],
      labelOptions: [],
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

        likeFileName: '',
        nickName: '',
        projectId: '',
        groupStatus: "1",
        checkNickName: '',
        batchId: ''
      },
      // 批次号选项
      groupLabel: [],
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
        projectId: [
          { required: true, message: "项目不能为空", trigger: "blur" },
        ],
        sourceId: [
          { required: true, message: "附件ID不能为空", trigger: "blur" },
        ],
        groupStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        batchId: [
          { required: true, message: "批次不能为空", trigger: "blur" }
        ],
      },
      // 标注完成表单验证
      okcheckrules: {
        subject: [
          { required: true, message: "科目不能为空", trigger: "blur" },
        ],
        language: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ]
      },
      subjects: [],
      languages: [],
      permissionButton: []
    };
  },
  computed: {
    slicedPermissionBtns() {
      return this.permissionButton.slice(2)
    }
  },
  created() {
    if (localStorage.getItem('timu/group')) this.queryParams = JSON.parse(localStorage.getItem('timu/group'))
    if (this.$route.params.id) this.queryParams.projectId = this.$route.params.id
    this.getList();
    this.getDicts("mark_select_json").then((response) => {
      this.jsonOptions = response.data;
    });
    this.getDicts("group_label").then((response) => {
      this.groupLabel = response.data;
    });
    this.getDicts("group_status").then((response) => {
      this.statusOptions = response.data;
    });
    // 字典-科目
    this.getDicts("group_subject").then(res => {
      this.subjects = res.data
    })
    // 字典-语言
    this.getDicts("group_language").then(res => {
      this.languages = res.data
    })
    // 列表权限操作部分
    const btnText = {
      'group:getJob': '领取分组任务',
      'pdf:job:completeJob': '标注完成',
      'group:okCheck': '质检完成',
      'pdf:job:closeGroup': '关闭分组',
      'group:open': '开启分组',
      'pdf:job:invalidJob': '无效分组',
      'group:reAll': '全部驳回',
      'group:update': '修改',
      'group:del': '删除',
      'group:job': '任务',
      'group:param': '参数'
    }
    const status = {
      'group:getJob': '1',
      'pdf:job:completeJob': '2',
      'group:okCheck': '3',
      'pdf:job:closeGroup': '4',
      'group:open': '0',
      'pdf:job:invalidJob': '5',
      'group:reAll': 'reAll',
      'group:update': 'update',
      'group:del': 'del',
      'group:job': 'job',
      'group:param': 'param'
    }
    // 超级管理员
    if (this.$store.state.user.permissions.toString() === '*:*:*') {
      let keys = Object.keys(btnText)
      this.permissionButton = keys.map(p => {
        return {
          permission: p,
          icon: p.split(':')[1],
          text: btnText[p],
          status: status[p]
        }
      })
    } else {
      // 用户
      this.permissionButton = this.$store.state.user.permissions.map(p => {
        return {
          permission: p,
          icon: p.split(':')[1],
          text: btnText[p],
          status: status[p]
        }
      })
      // 过滤掉不匹配的权限
      this.permissionButton = this.permissionButton.filter(item => {
        return item.text
      })
    }

    proPage({ projectType: '2' }).then((response) => {
      this.projectList = response.data.content;
      this.projectList = this.projectList.map((item) => ({ dictValue: item.id, dictLabel: item.projectName }))
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      if (this.mark) {
        this.loading = true;
        localStorage.setItem('timu/group', JSON.stringify(this.queryParams))
        page(this.addDateRange(this.queryParams, this.dateRange)).then(
          (response) => {
            this.roleList = response.data.content;
            this.total = response.data.allNum;
            this.queryParams.pageNum = response.data.page;
            this.queryParams.pageSize = response.data.size;
            this.loading = false;
            this.mark = true;
            // if (this.queryParams.groupStatus == "1" && this.total == 0) {
            //   this.$confirm(
            //     '你已经没有标注中的任务是否快速开始任务?',
            //     "提示",
            //     {
            //       confirmButtonText: "确定",
            //       cancelButtonText: "取消",
            //       type: "warning",
            //     }
            //   ).then(() => {
            //     quick({}).then(
            //       (response) => {
            //         this.$router.push({
            //           name: "JobList",
            //           query: {
            //             groupId: response.data.id,
            //           },
            //         });
            //       })
            //   })
            // }
          }
        );
      } else {
        this.loading = true;
        pageNull(this.addDateRange(this.queryParams, this.dateRange)).then(
          (response) => {
            this.roleList = response.data.content;
            this.total = response.data.allNum;
            this.queryParams.pageNum = response.data.page;
            this.queryParams.pageSize = response.data.size;
            this.loading = false;
            this.mark = false;
          }
        );
      }
    },
    // 过滤
    // filterTask(row) {
    //   const pBtns = deepClone(this.permissionButton)
    //   // 修改slice
    //   // slicedPermissionBtns
    //   if(!row.note) {
    //     this.permissionButton = this.permissionButton.filter(item => {
    //       return item.text !== '任务'
    //     })
    //   }
    // },
    reAll(row) {
      reall({ id: row.id }).then((response) => {
        this.$message.success("驳回成功");
        this.open = false;
        this.getList();
      });
    },
    handleUpdateStatus({ row, status }) {
      if ("5" == status) {
        this.$prompt('请输入无效理由', '理由', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          statusUpdate({ id: row.id, groupStatus: status, reasonDiscard: value }).then((response) => {
            this.$message.success("修改成功");
            this.open = false;
            this.getList();
          });
        })

      } else if (status === 'reAll') {
        // 全部驳回
        this.reAll(row)
      } else if (status === 'update') {
        // 修改
        this.handleUpdate(row)
      } else if (status === 'del') {
        // 删除
        this.handleDelete(row)
      } else if (status === 'job') {
        // 任务
        this.toJob(row)
      } else if (status === 'param') {
        // 参数
        this.toContext(row)
      } else if (status === '2') {
        // 标注完成
        this.okCheckOpen = true
        // 当前点击了当前行
        this.okCheckRow = row
      } else {
        statusUpdate({ id: row.id, groupStatus: status }).then((response) => {
          this.$message.success("修改成功");
          this.open = false;
          this.getList();
        });
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
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.mark = true;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleQueryNull() {
      this.mark = false;
      this.getList();
    },
    tagFormat(row, column) {
      return this.selectDictLabel(this.tagOptions, row.projectManagerId);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.groupStatus);
    },
    labelFormat(row, column) {
      return this.selectDictLabel(this.labelOptions, row.batchId);
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
      this.title = "新增标注任务";
      this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      var newObj = JSON.parse(JSON.stringify(row));
      this.form = newObj;
      this.open = true;
      this.title = "修改标注任务";
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
    /**
     *@Description: 标注完成备注
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    subOkCheckForm() {
      this.$refs["okCheckForm"].validate((valid) => {
        if (valid) {
          statusUpdate({ id: this.okCheckRow.id, groupStatus: '2', ...this.okCheckForm }).then((response) => {
            this.$message.success("修改成功");
            this.$refs.okCheckForm.resetFields();
            this.open = false;
            this.okCheckOpen = false;
            this.getList();
          });
        }
      })
    },
    closeDialog() {
      this.$refs.okCheckForm.resetFields()
      this.okCheckOpen = false
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否删除该数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return del(row);
        })
        .then(() => {
          this.getList();
          this.$message("删除成功");
        });
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.poidownload("data:userCheck");
      });
    },
    handleAllExport() {
      this.$prompt('请输入标签内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '标签内容不能为空！';
          }
        },
      }).then(({ value }) => {
        this.allExport(value)
      }).catch(() => {

      });
    },
    allExport(value) {
      const queryParams = this.queryParams;
      //修改
      downZipFileByGroup(this.addDateRange({
        ids: this.ids.toString(),
        tags: value
      }, this.dateRange)).then((response) => {
        this.$message.success("数据生成中，稍后请在临时文件中下载");
      });
    }, // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  },
};
</script>
