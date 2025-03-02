<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" size="small" />
      </el-form-item>
      <el-form-item label="文件ID" prop="fileId">
        <el-input v-model="queryParams.fileId" placeholder="请输入文件ID" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" size="small" />
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="请选择项目类型" clearable style="width: 240px" size="small">
          <el-option v-for="dict in dict.type.project_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人" prop="cByName">
        <el-input v-model="queryParams.cByName" placeholder="请输入操作人" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" size="small" />
      </el-form-item>
      <el-form-item label="接收人" prop="newJobNickName">
        <el-input v-model="queryParams.newJobNickName" placeholder="请输入接收人" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" size="small" />
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" height="600">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="projectName" label="项目名称"> </el-table-column>
      <el-table-column prop="projectType" label="项目类型" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.project_type" :value="scope.row.projectType" />
        </template>
      </el-table-column>
      <el-table-column prop="fileId" label="文件ID"> </el-table-column>
      <el-table-column prop="cByName" label="操作人" width="100"> </el-table-column>
      <el-table-column prop="newJobNickName" label="任务接收人" width="100"> </el-table-column>
      <el-table-column prop="cTime" label="转移时间"> </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { getJobTransferRecord } from '@/api/project/imgTask'
export default {
  dicts: ["project_type"],
  data() {
    return {
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        fileId: '',
        projectType: '',
        cByName: '',
        newJobNickName: ''
      },
      total: 0,
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      getJobTransferRecord(this.queryParams).then(res => {
        this.total = res.data.allNum
        this.tableData = res.data.content
      })
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>

<style></style>
