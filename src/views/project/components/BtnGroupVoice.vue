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
import { JobVoiceBtn, CheckVoiceBtn } from '../config/btnVoice.js'
export default {
  name: 'BtnGroupVoice',
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
          return this.JobVoiceBtn
        case 'check':
          return this.CheckVoiceBtn
      }
    }
  },
  data() {
    return {
      JobVoiceBtn
    }
  },
  methods: {
    checkPermi,
    handleStatus(arr) {
      let bol = arr.some(item => item === this.row.jobStatus)
      return bol
    },
    handleCommand(command) {
      switch (command) {
        // 转移
        case 'transferJob':
          this.$emit('transfer', 'job')
          break;
        case 'transferCheck':
          this.$emit('transfer', 'check')
          break;
      }

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