<template>
  <div style="display: inline-block;margin-left: 10px;">
    <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command)">
      <el-button size="mini" type="text">...更多</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in btns" :key="index" :command="item.command">
          <el-button v-if="handleStatus(item.status) && checkPermi(item.permission)" type="text" size="mini"
            :icon="item.svgIcon">{{ item.text
            }}</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <div style="display: inline-block;margin-left: 10px;" v-for="(item, index) in btns" :key="index">
      <el-button type="text" size="mini" v-if="status !== '3' &&handleStatus(item.status) && checkPermi(item.permission)"
        :icon="item.svgIcon" @click="handleCommand(item.command)">{{ item.text
        }}</el-button>
    </div>
  </div>
</template>

<script>
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import { receiveOCRTask, receiveOCRCheck } from "@/api/project/imgTask";
import { JobOCRBtn, CheckOCRBtn, waitCheckOCRBtn, waitJobOCRBtn } from '../config/btnOcr.js'
export default {
  name: 'BtnGroupOCR',
  props: {
    tabName: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: (() => { })
    },
    status: {
    type: String,
      default: "",
    },
  },
  computed: {
    btns() {
      switch (this.tabName) {
        case 'task':
          return this.JobOCRBtn
        case 'check':
          return this.CheckOCRBtn
        case 'jobWaitTask':
          return this.waitJobOCRBtn
        case 'CheckWaitTask':
          return this.waitCheckOCRBtn
      }
    }
  },
  data() {
    return {
      waitCheckOCRBtn,
      waitJobOCRBtn,
      JobOCRBtn,
      CheckOCRBtn,
    }
  },
  methods: {
    checkPermi,
    handleStatus(arr) {
      let bol = arr.some(item => item === this.row.jobStatus)
      return bol
    },
    handleCommand(command) {
      let that = this
      let api
      switch (command) {
        case 'receiveCheck':
          api = receiveOCRCheck
          break;
        case 'receiveJob':
          api = receiveOCRTask
          break;
        case 'transferJob':
          this.$emit('transfer', 'job')
          break;
        case 'transferCheck':
          this.$emit('transfer', 'check')
          break;
      }

      api && api({ jobId: this.row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('领取成功')
          setTimeout(() => {
            that.$emit('refreshList')
          }, 1000);
        }


      })

    }
  }
}
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