<template>
  <div class="app-container common-buttom new-input
">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable @keyup.enter.native="handleQuery"
          size="small" />
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" clearable placeholder="请选择项目类型" size="small">
          <el-option v-for="dict in dict.type.project_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态" prop="projectStatus">
        <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable size="small">
          <el-option v-for="dict in dict.type.project_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" v-hasPermi="['project:list:add']" plain
          @click="handleAdd">新增项目</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="loading">
      <el-table-column type="index" label="序列"></el-table-column>
      <el-table-column label="项目类型" prop="projectType" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.project_type" :value="scope.row.projectType" />
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="项目状态" prop="projectStatus" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.projectStatus === '1'" size="small" effect="plain" type="success"
            disable-transitions>未开始</el-tag>
          <el-tag v-else-if="scope.row.projectStatus === '2'" size="small" effect="plain" type="warning"
            disable-transitions>进行中</el-tag>
          <el-tag v-else disable-transitions type="danger" size="small" effect="plain">已结束</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="项目分类" prop="projectClass" :formatter="classFormat" width="120" /> -->
      <el-table-column label="项目创建时间" prop="cTime" width="200" />
      <el-table-column label="项目预计开始时间" prop="exStartTime" width="200" />
      <el-table-column label="项目预计结束时间" prop="exEndTime" width="200" />
      <!-- <el-table-column label="项目预算" prop="projectMoneyNum" width="120" /> -->
      <!-- <el-table-column label="项目总投入人数" prop="projectManNum" width="120" /> -->
      <el-table-column label="项目经理名称" prop="projectManagerId" :formatter="managerNameFormat" width="200" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="350">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleStatic(scope.row)"
            v-hasPermi="['project:static']">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:detail']" v-if="scope.row.projectStatus !== '3'" >编辑</el-button>
          <!-- && scope.row.jobMode === '1' -->
          <el-button size="mini" type="text" v-if="checkPermi(jobPermision) && scope.row.jobMode === '1'"
            icon="el-icon-s-promotion" @click="handleMark(scope.row)">快速标注</el-button>
          <el-button size="mini" type="text" v-if="checkPermi(checkPermision) && scope.row.jobMode === '1'"
            icon="el-icon-s-promotion" @click="handleCheck(scope.row)">快速质检</el-button>

          <!-- 教辅专用 -->
          <el-button v-if="scope.row.projectType === '2'" size="mini" type="text" icon="el-icon-s-promotion"
            @click="jumpToV1Mark(scope.row)" v-hasPermi="['pdf:job:list']">V1标注</el-button>
          <el-button v-if="scope.row.projectType === '2'" size="mini" type="text" icon="el-icon-s-promotion"
            @click="jumpToV1Check(scope.row)" v-hasPermi="['pdf:check:list']">V1质检</el-button>

          <!-- v-if="scope.row.projectType !== '3'"  语音没有列表页  不做更多显示 -->
          <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
            v-if="scope.row.projectType === '1' || scope.row.projectType === '2'">
            <el-button size="mini" type="text">...更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleUpdate" v-hasPermi="['project:list:update']">
                <p class="dropbtn">
                  <i class="el-icon-edit"></i>
                  <span>修改</span>
                </p>
              </el-dropdown-item>
              <el-dropdown-item command="jumpToV1Mark" v-hasPermi="['project:list:mark']">
                <p class="dropbtn">
                  <i class="el-icon-promotion"></i>
                  <span>V1标注</span>
                </p>
              </el-dropdown-item>
              <el-dropdown-item command="jumpToV1Check" v-hasPermi="['project:list:check']">
                <p class="dropbtn">
                  <i class="el-icon-promotion"></i>
                  <span>V1质检</span>
                </p>
              </el-dropdown-item>
              <el-dropdown-item command="handleDelete" v-hasPermi="['project:list:del']">
                <p class="dropbtn">
                  <i class="el-icon-delete"></i>
                  <span>删除</span>
                </p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
import {
  page,
  del,
  getQuickJob,
  getQuickCheck,
  getPMlist,
  getOcrJob,
  getOcrCheck
} from "@/api/project/project";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { nextCheck, nextJob } from '@/api/project/voiceJob'
import "@/assets/scss/commonButtom.scss"; //  css
import { quickJob, quickCheck } from '@/api/project/2d'
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import { quick3DJob, quick3DCheck } from '@/api/project/3d'


export default {
  name: "projectList",
  dicts: ['project_type', 'project_status'],
  data() {
    return {
      jobPermision: ['pdf:job:quick', 'ocr:job:jobTask', 'voice:job:quickJob','graph:job:quickJob','point:cloud:quickJob',],
      checkPermision: ['pdf:check:quick', 'ocr:job:checkTask', 'voice:job:quickCheck','graph:job:quickCheck','point:cloud:quickCheck'],
      // 遮罩层
      loadingUser: true,
      loading: true,
      // 总条数
      total: 0,
      // 项目表格数据
      listData: [],
      // 项目经理列表数据
      projectPMList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openUser: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      typeOptions: [],
      classOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        projectName: undefined,
        // projectType: '2',
        projectStatus: undefined,
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
    // this.getDicts("project_type").then((response) => {
    //   this.typeOptions = response.data;
    // });
    // this.getDicts("project_class").then((response) => {
    //   this.classOptions = response.data;
    // });
    /** 拿所有项目类型的项目经理 */
    getPMlist({}).then((response) => {
      this.projectPMList = response.data.map((item) => ({ dictValue: item.userId, dictLabel: item.nickName }))
    });

    console.log(this.checkPermi(this.jobPermision));

  },
  methods: {
    checkPermi,
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleMark":
          this.handleMark(row);
          break;
        case "handleCheck":
          this.handleCheck(row);
          break;
        case "handleBZ":
          this.handleBZ(row);
          break;
        case "handleZJ":
          this.handleZJ(row);
          break;
        case "handleDelete":
          this.handleDelete(row);
          break;
        case "handleUpdate":
          this.handleUpdate(row);
          break;
        case "jumpToV1Mark":
          this.jumpToV1Mark(row);
          break;
        case "jumpToV1Check":
          this.jumpToV1Check(row);
          break;
      }
    },
    /** 获取项目列表数据 */
    getList() {
      this.loading = true;
      page(this.queryParams).then(
        (response) => {
          this.listData = response.data.content;
          this.total = response.data.allNum;
          this.queryParams.pageNum = response.data.page;
          this.queryParams.pageSize = response.data.size;
          this.loading = false;
        }
      );
    },
    /** 回显项目分类 */
    classFormat(row, column) {
      return this.selectDictLabel(this.classOptions, row.projectClass);
    },
    /** 回显项目经理名称 */
    managerNameFormat(row, column) {
      return this.selectDictLabel(this.projectPMList, row.projectManagerId);
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
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/project/detail',
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        name: 'Detail',
        query: {
          id: row.id,
          type: row.projectType
        }
      })
    },
    // 跳转V1标注
    jumpToV1Mark(row) {
      console.log('jumpToV1Mark', row);
      const jumpPage = {
        '1': 'ImgTask',
        '2': 'Group'
      }
      this.$router.push({
        name: jumpPage[row.projectType],
        params: {
          id: row.id
        }
      })
    },
    // 跳转V1质检
    jumpToV1Check(row) {
      const jumpPage = {
        '1': 'ImgCheck',
        '2': 'Checklist'
      }
      this.$router.push({
        name: jumpPage[row.projectType],
        params: {
          id: row.id
        }
      })
    },
    // 快速标注
    handleMark(row) {
      let { id, projectType, projectId } = row
      let url, api
      switch (projectType) {
        case '1':
          url = '/marks/ocr/jobDetail'
          api = getOcrJob
          break;
        case '2':
          url = '/marks/pdfDetail'
          api = getQuickJob
          break;
        case '3':
          url = '/marks/voice/detailVoiceJob'
          api = nextJob
          break;
        case '4':
          url = '/marks2d/job'
          api = quickJob
          break;
        case '5':
          url = '/marks3d/job'
          api = quick3DJob
          break;

      }
      api({ projectId: id }).then(res => {
        if (res.code === 200) {
          // 语音 验证是否有任务
          if (projectType === '3') {
            if (res.data.nextId) {
              this.$router.push({
                path: url,
                query: {
                  id: res.data.nextId,
                }
              })
            } else {
              this.$modal.msgWarning('暂无新任务')
            }
          } else {
            if (res.data.code === 9999) {
              this.$message.warning(res.data.msg)
            } else {
              console.log('教辅快速标注', res.data);
              let query
              switch (projectType) {
                // 教辅
                case '2':
                  query = {
                    id: res.data.id,
                    fileId: res.data.fileId,
                    proId: id
                  }
                  break;
                // 2D
                case '4':
                  query = {
                    id: res.data.jobId,
                    groupStatus: res.data.groupStatus,
                    proId: id
                  }
                  break;
                // 3D
                case '5':
                  query = {
                    id: res.data.nextJobId,
                    groupStatus: res.data.groupStatus,
                    proId: id
                  }
                  break;
              }
              this.$router.push({
                path: url,
                query
              })
            }
          }
        }
      })

    },
    // 快速质检
    handleCheck(row) {

      let { id, projectType } = row
      let url, api
      switch (projectType) {
        case '1':
          url = '/marks/ocr/checkDetail'
          api = getOcrCheck
          break;
        case '2':
          url = '/marks/pdfDetail'
          api = getQuickCheck
          break;
        case '3':
          url = '/marks/voice/detailVoiceCheck'
          api = nextCheck
          break;
        case '4':
          url = '/marks2d/check'
          api = quickCheck
          break;
        case '5':
          url = '/marks3d/check'
          api = quick3DCheck
          break;
      }
      api({ projectId: id }).then(res => {
        if (res.code === 200) {
          // 语音 验证是否有任务
          if (projectType === '3') {
            if (res.data.nextId) {
              this.$router.push({
                path: url,
                query: {
                  id: res.data.nextId
                }
              })
            } else {
              this.$modal.msgWarning('暂无新任务')
            }

          } else {
            if (res.data.code === 9999) {
              this.$message.warning(res.msg)
            } else {
              let query
              switch (projectType) {
                // 教辅
                case '2':
                  query = {
                    id: res.data.id,
                    fileId: res.data.fileId,
                    proId: id,
                    checker: true,
                  }
                  break;
                // 2D
                case '4':
                  query = {
                    id: res.data.jobId,
                    groupStatus: res.data.groupStatus,
                    proId: id
                  }
                  break;
                // 3D
                case '5':
                  query = {
                    id: res.data.nextJobId,
                    groupStatus: res.data.groupStatus,
                    proId: id
                  }
                  break;
              }
              this.$router.push({
                path: url,
                query
              })
            }
          }
        }
      })
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
          this.$message.success("删除成功");
        });
    },
    // 项目详情
    handleStatic(row) {
      this.$router.push({
        name: 'Static',
        query: {
          id: row.id
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.dropbtn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #1890ff;
  margin: 0;
}
</style>
