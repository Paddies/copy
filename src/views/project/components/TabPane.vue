<template>
  <div>
    <slot name="search"></slot>
    <el-row v-if="showHeader">
      <el-col :span="24" align="right">
        <el-button v-if="add === '新增文件'" type="primary" size="mini" plain @click="handleCreateTask">
          <i class="el-icon-s-promotion" style="margin-right: 5px"></i>生成任务
        </el-button>
        <el-button type="primary" size="mini" plain @click="handleAdd">
          <i :class="icon" style="margin-right: 5px"></i>{{
            add }}</el-button>
        <p></p>
      </el-col>
    </el-row>
    <el-table ref="table" :data="data" @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column v-if="selectable" type="selection" width="55" fixed>
      </el-table-column>
      <el-table-column v-if="showIndex" type="index" label="序号" width="50" fixed align="center"></el-table-column>
      <div v-for="(item, index) in dataConfig" :key="index">
        <el-table-column v-if="item.slot === 'image'" :label="item.label" :prop="item.key" align="center">
          <template slot-scope="scope">
            <div>
              <el-image style="width: 100px; height: 100px" :src="getImage(scope.row.fileId)"
                :preview-src-list="[getImage(scope.row.fileId)]" fit="contain">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.slot === 'operate'" label="操作" fixed="right" align="center" :width="item.width">
          <template slot-scope="scope">
            <!-- 公用任务 -->
            <el-button v-if="status !== '3' &&checkPermi(taskPermision) && isTask && !isEdit&&archive" type="text" size="mini"
              @click="jumpPage(scope.row)" icon="el-icon-notebook-1">{{ detailBtnTxt }}</el-button>

            <el-button v-if="isEdit" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>

            <!-- <component :is="currentTabComponent" :tabName="activeName" :row="scope.row" @refreshList="handleFreshList" /> -->
            <!-- OCR按钮显隐 -->
            <BtnGroupOCR v-if="projectType === '1'&&archive" :tabName="activeName" :row="scope.row" :status="status" @refreshList="handleFreshList" 
              @transfer="handleTransfer($event, scope.row)">
            </BtnGroupOCR>
            <!-- 教辅按钮显隐 -->
            <BtnGroupPDF v-if="projectType === '2'&&archive" :tabName="activeName" :row="scope.row" :status="status" @refreshList="handleFreshList"
              @transfer="handleTransfer($event, scope.row)">
            </BtnGroupPDF>
            <!-- 语音按钮显隐 -->
            <BtnGroupVoice v-if="projectType === '3'&&archive" :tabName="activeName" :row="scope.row" :status="status"
              @refreshList="handleFreshList" @transfer="handleTransfer($event, scope.row)"></BtnGroupVoice>
            <!-- 2D按钮显隐 -->
            <BtnGroup2D v-if="projectType === '4'&&archive" :tabName="activeName" :row="scope.row" :status="status" @refreshList="handleFreshList"
              @transfer="handleTransfer($event, scope.row)">
            </BtnGroup2D>
            <BtnGroup3D v-if="projectType === '5'&&archive" :tabName="activeName" :row="scope.row" :status="status" @refreshList="handleFreshList"
              @transfer="handleTransfer($event, scope.row)">
            </BtnGroup3D>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.slot === 'filter'" :label="item.label" :prop="item.key" :width="item.width"
          :fixed="item.fixed" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <FilterHeader :column="scope.column" :field-name="item.key" :field-label="item.label"
              :filter-type="item.filterType || 'text'" :customArrList="handleCustomArr(item.key)"
              @tableFilter="tableFilter" @resetFilter="tableFilterReset" />
          </template>
          <template slot-scope="scope">
            <span v-if="item.filterType === 'select'"><span :class="`status-tag-${item.key}-${scope.row[item.key]}`"
                class="status-tag">{{ getProjectDictLabel(scope.row) }}</span></span>
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="item.label" :prop="item.key" :width="item.width" :fixed="item.fixed"
          show-overflow-tooltip></el-table-column>
      </div>

    </el-table>
    <div class="table-bottom">
      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import FilterHeader from "@/views/project/components/FilterHeader.vue";
import BtnGroup2D from "@/views/project/components/BtnGroup2D.vue";
import BtnGroup3D from "@/views/project/components/BtnGroup3D.vue";
import BtnGroupPDF from './BtnGroupPDF.vue';
import BtnGroupOCR from './BtnGroupOCR.vue';
import BtnGroupVoice from './BtnGroupVoice.vue';

export default {
  name: 'TabPane',
  components: {
    FilterHeader,
    BtnGroup2D,
    BtnGroup3D,
    BtnGroupPDF,
    BtnGroupVoice,
    BtnGroupOCR
  },
  computed: {
    isDel() {
      return this.activeName === 'marker' || this.activeName === 'checker' || this.activeName === 'file'
    },
    isGroup() {
      return this.projectType === '2' || this.projectType === '4' || this.projectType === '5'
    },
    detailBtnTxt() {
      let txt
      // 教辅和2D 跳转各自的任务列表
      if (this.projectType === '2' || this.projectType === '4'|| this.projectType === '5') {
        txt = '任务清单'
      } else {
        if (this.taskType === 'job') {
          txt = '标注详情'
        } else {
          txt = '质检详情'
        }
      }
      return txt
    },
    // 是否为标注任务、质检任务
    isTask() {
      return this.activeName === 'task' || this.activeName === 'check'
    },
    // 是否是名单
  },
  props: {
    dataConfig: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    icon: {
      type: String,
      default: "",
    },
    add: {
      type: String,
      default: "",
    },
    pagination: {
      type: Object,
      default() {
        return {};
      },
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    projectStatus: {
      type: Array,
      default() {
        return [];
      },
    },
  status: {
    type: String,
      default: "",
    },
    customArrList: {
      type: Object,
      default() {
        return {};
      },
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    projectType: {
      type: String,
      default: "",
    },
    taskType: {
      type: String,
      default: "",
    },

    activeName: {
      type: String,
      default: "task",
    },
    archive: {
      type: Boolean ,
      default: "",
    },
  },
  data() {
    return {
      currentTabComponent: '',
      taskPermision: ['graph:job:startJob', 'graph:job:startCheck', 'ocr:job:jobTask', 'ocr:job:checkTask', 'voice:job:quickJob', 'voice:job:quickCheck', 'pdf:job:oldMyJob', 'pdf:job:item', 'pdf:check:item', 'point:cloud:startJob', 'point:cloud:startCheck']
    };
  },
  mounted() {
    this.handleBtnComponents()
  },
  methods: {
    checkPermi,
    /** 确定按钮组件 */
    handleBtnComponents(type) {
      switch (type) {
        case '1':
          this.currentTabComponent = BtnGroupOCR
          break;
        case '2':
          this.currentTabComponent = BtnGroupPDF
          break;
        case '4':
          this.currentTabComponent = BtnGroup2D
          break;
        case '5':
          this.currentTabComponent = BtnGroup3D
          break;
      }
    },
    // “标注中”、“分组已驳回”  显示标注转移按钮
    showTransJob(row) {
      if (this.projectType === '4' || this.projectType === '2' || this.projectType === '5') {
        if (row.groupStatus === '6' || row.groupStatus === '1') {
          return true
        } else {
          return false
        }
      } else {
        if (row.jobStatus === '6' || row.jobStatus === '1') {
          return true
        } else {
          return false
        }
      }
    },
    //2D  质检中显示质检转移按钮
    showTransCheck(row) {
      if (this.projectType === '4') {
        if (row.groupStatus === '7') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    handleCustomArr(key) {
      if (this.customArrList) {
        return this.customArrList[key]
      } else {
        return []
      }
    },
    handleFreshList() {
      this.$emit("refresh");
    },
    getImage(fileId) {
      return process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
    },
    getProjectDictLabel(row) {
      let target = this.projectStatus.find(
        (o) =>
          o.dictValue === row.groupStatus || o.dictValue === row.jobStatus?.toString()
      );
      return target?.dictLabel;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.$emit("paginationChange", {
        currentPage: this.pagination.currentPage,
        pageSize: val,
        total: this.pagination.total,
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit("paginationChange", {
        currentPage: val,
        pageSize: this.pagination.pageSize,
        total: this.pagination.total,
      });
    },
    handleAdd() {
      this.$emit("add", this.add);
    },
    handleDelete(row) {
      this.$emit("delete", row);
    },
    tableFilter(obj) {
      this.$emit("filter", obj);
    },
    tableFilterReset(obj) {
      this.$emit("filter", obj);
    },
    jumpPage(row) {
      this.$emit("jumpPage", row);
    },
    handleCreateTask() {
      this.$emit("createTask");
    },
    handleSelectionChange(rows) {
      this.$emit("select-change", rows);
    },
    handleTransfer(type, row) {
      if (type === 'job') {
        this.$emit("tansfer", row);
      } else {
        this.$emit("tansferCheck", row);
      }
    },
    handleDetailjob() {
      this.$emit("handleDetailjob", row);
    },
    handleDetailCheck() {
      this.$emit("handleDetailjob", row);
    },
    handleReceiveTask(row) {
      this.$emit("receiveTask", row);
    }
  },
};
</script>

<style lang="scss" scoped>
.table-bottom {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.reference {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
