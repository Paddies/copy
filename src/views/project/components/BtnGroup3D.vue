<template>
    <div style="display: inline-block">
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
      <div style="display: inline-block" v-for="(item, index) in btns" :key="index">
        <el-button type="text" size="mini" v-if="status !== '3' &&handleStatus(item.status) && checkPermi(item.permission)"
          :icon="item.svgIcon" @click="handleCommand(item.command)" style="margin-left: 5px;">{{ item.text
          }}</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import { checkPermi } from "@/utils/permission"; // 权限判断函数
  import { receiveJob, receiveCheck, completeJob, completeCheck, closeGroup, openGroup, startJob, startCheck } from "@/api/project/3d"
  import { Job3DPerBtn, Check3DPerBtn, waitCheck3DBtn, waitJob3DBtn } from '../config/btn3d.js'
  export default {
    name: 'BtnGroup3D',
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
            return this.Job3DPerBtn
          case 'check':
            return this.Check3DPerBtn
          case 'jobWaitTask':
            return this.waitJob3DBtn
          case 'CheckWaitTask':
            return this.waitCheck3DBtn
        }
      }
    },
    data() {
      return {
        Job3DPerBtn, Check3DPerBtn, waitCheck3DBtn, waitJob3DBtn
      }
    },
    methods: {
      checkPermi,
      handleStatus(arr) {
        let bol = arr.some(item => item === this.row.groupStatus)
        return bol
      },
      handleCommand(command) {
        let that = this
        console.log('command', command);
        let api, url
        switch (command) {
          case 'startJob':
            url = '/marks3d/job'
            api = startJob
            break;
          case 'startCheck':
            url = '/marks3d/check'
            api = startCheck
            break;
          case 'completeJob':
            api = completeJob
            break;
          case 'completeCheck':
            api = completeCheck
            break;
          case 'closeGroup':
            api = closeGroup
            break;
          case 'openGroup':
            api = openGroup
            break;
          case 'receiveCheck':
            api = receiveCheck
            url = '/marks3d/check'
            break;
          case 'receiveJob':
            api = receiveJob
            url = '/marks3d/job'
            break;
          case 'transferJob':
            this.$emit('transfer', 'job')
            break;
          case 'transferCheck':
            this.$emit('transfer', 'check')
            break;
        }
  
        api && api({ groupId: this.row.id }).then(res => {
          // 开始标注和开始质检会返回jobId
          if ((command === 'startJob' || command === 'startCheck' || command === 'receiveCheck' || command === 'receiveJob')) {
            if (res.data.nextJobId) {
              this.$router.push({
                path: url,
                query: {
                  id: res.data.nextJobId,
                  groupStatus: res.data.groupStatus,
                  groupId: this.row.id,
                  proId: this.$route.query.id // 项目id
                }
              })
  
            } else {
              this.$message.success('领取成功！')
            }
          } else {
            this.$message.success('操作成功')
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