<template>
  <div class="wrap">
    <el-row class="header">
      <el-col :span="2" class="logo-wrap">
        <svg-icon class="logo" icon-class="logo"></svg-icon>
      </el-col>
      <el-col :span="22" class="tools-wrap">
        <div class="block" v-if="job2d && job2d.jobNum">
          <p>
            <span class="block-label">图片序号：<b>{{ job2d.jobNum }}</b></span>
          </p>
        </div>
        <div class="block" v-if="job2d && JSON.stringify(job2d) != '{}' && jobStatusOptions && jobStatusOptions.length !== 0
          ">
          <p>
            <span class="block-label">图片状态：<b>{{ jobStatusTxt }}</b></span>
          </p>
          <!-- <p>
          <span class="block-label" >状态：</span>
          <el-select v-model="statu" placeholder="请选择状态" @change="changeStatus">
            <el-option v-for="item in jobStatus" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
          </el-select>
          </p> -->
        </div>

        <div class="block" v-if="job2d && job2d.maxNum && job_mode === '2'">
          <p style="width: 100px; margin: 0">
            <el-select v-model="statu" placeholder="请选择状态" @change="changeStatus" size="mini">
              <el-option label="全部" :value="''"></el-option>
              <el-option v-for="item in jobStatusFilter" :key="item.dictValue" :label="item.dictLabel"
                :value="item.dictValue"></el-option>
            </el-select>
          </p>
          <p>
            <span class="block-label">总任务数：{{ job2d.maxNum }} 张</span>
          </p>
        </div>
        <div class="block" v-if="job2d && job2d.markCount && !isCheck">
          <p>
            <span class="block-label">已标注：{{ job2d.markCount }} 张</span>
          </p>
        </div>
        <div class="block" v-if="job2d && job2d.unMarkCount && !isCheck">
          <p>
            <span class="block-label">未标注：{{ job2d.unMarkCount }} 张</span>
          </p>
        </div>
        <div class="block" v-if="job2d && job2d.unMarkCount && isCheck">
          <p>
            <span class="block-label">已质检：{{ job2d.checkCount }} 张</span>
          </p>
        </div>
        <div class="block" v-if="job2d && job2d.unMarkCount && isCheck">
          <p>
            <span class="block-label">未质检：{{ job2d.unCheckCount }} 张</span>
          </p>
        </div>
        <!-- <div class="block">
          <span class="tool">
            <svg-icon icon-class="2d-settings"></svg-icon>
            <span>设置</span>
          </span>
        </div>
        <div class="block">
          <span class="tool">
            <svg-icon icon-class="2d-revoke"></svg-icon>
            <span>撤销</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="2d-remake"></svg-icon>
            <span>重做</span>
          </span>
        </div> -->
        <!-- <div class="block block-text">
            <p><svg-icon icon-class="2d-dot"></svg-icon><span>当前状态：<span>标注中</span></span></p>
            <p>提交：0/1/1</p>
        </div> -->
        <div class="block block-text" v-if="job2d && job2d.cancelDes && job2d.jobStatus === '-1'">
          <p style="display: flex;align-items: center;">
            <svg-icon icon-class="2d-dot"></svg-icon>
            <span style="margin-left: 5px;">作废原因：<span>{{ job2d.cancelDes }}</span></span>
          </p>
        </div>
        <div class="block block-save" v-if="job2d && JSON.stringify(job2d) != '{}' && jobStatusOptions && jobStatusOptions.length !== 0
          ">
          <!-- <div class="text">
                <p><span>状态：<b :style="{ color: jobStatus.find(item => item.dictValue === job2d.jobStatus).cssClass }">{{ jobStatus.find(item => item.dictValue === job2d.jobStatus).dictLabel }}</b></span></p>
                <p><b>序号：{{ job2d.jobNum }}</b><b>总计：{{ job2d.maxNum }}</b></p>
            </div> -->
          <div>

            <!-- v-if="groupStatus === '1' || groupStatus === '6'" -->
            <el-button v-if="(groupStatus === '1' || groupStatus === '6') && checkPermi(['graph:job:saveGraphTags'])"
              type="primary" :disabled="isCheck" @click="save">
              <svg-icon icon-class="2d-save" :loading="loading" class="save"></svg-icon><span
                style="margin-left: 5px">保存</span></el-button>
            <el-button
              v-if="(groupStatus === '1' || groupStatus === '6') && checkPermi(['graph:job:submitNext']) && job_mode === '1'"
              type="primary" :disabled="isCheck" @click="saveAndNext"><svg-icon icon-class="2d-save" :loading="loading"
                class="save"></svg-icon><span style="margin-left: 5px">保存并继续</span></el-button>

            <el-button type="primary" v-hasPermi="['graph:job:checkSkip']" plain @click="skip"
              v-if="isCheck && job_mode === '1' && job2d.jobStatus === '-1'">跳过</el-button>

            <el-button type="primary" plain @click="backToProject">返回</el-button>
          </div>
        </div>
        <!-- <div class="block">
          <span class="tool">
            <svg-icon icon-class="2d-hotkey"></svg-icon>
            <span>热键</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="2d-help"></svg-icon>
            <span>帮助</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="2d-query"></svg-icon>
            <span>查询</span>
          </span>
        </div> -->
        <!-- <div :span="1" class="block" @click="handleBlockTab">
          <span class="tool">
            <svg-icon icon-class="2d-obj"></svg-icon>
            <span>对象</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="2d-global"></svg-icon>
            <span>全局</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="2d-history"></svg-icon>
            <span>历史</span>
          </span>
        </div> -->
        <!-- <div :span="2" class="block right">
          <span class="tool">
            <svg-icon icon-class="2d-coordination"></svg-icon>
            <span>协同</span>
          </span>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    job2d: {
      type: Object,
      default: {},
    },
    // 标注模式：'1' ： 系统派题  '2': 手动派题
    job_mode: {
      type: String,
      default: ''
    }
  },
  computed: {
    nextJob() {
      return this.job2d?.nextJobId || '-1'
    },
    jobStatus() {
      let options = this.jobStatusOptions;
      let statusArr = this.isCheck ? this.checkStatusArr : this.jobStatusArr;


      let data = [];
      statusArr.forEach((item) => {
        options?.forEach((k) => {
          if (k.dictValue === item) {
            data.push(k);
          }
        });
      });
      return data;
    },
    groupStatus() {
      return this.$route.query.groupStatus;
    },
    jobStatusFilter() {
      let options = this.jobStatusOptions;
      let statusArr = this.isCheck ? this.checkStatusArr : this.jobStatusArr
      let data = []
      statusArr.forEach(item => {
        options?.forEach(k => {
          if (k.dictValue === item) {
            data.push(k)
          }
        })
      });
      return data
    },
    groupStatus() {
      return this.$route.query.groupStatus
    },
    jobStatusColor() {
      return this.jobStatusOptions.find(
        (item) => item.dictValue === this.job2d.jobStatus
      )?.cssClass || ''
    },
    jobStatusTxt() {
      return this.jobStatusOptions.find((item) => item.dictValue === this.job2d.jobStatus)
        .dictLabel || ''
    }
  },
  data() {
    return {
      loading: false,
      statu: "",
      // 质检需要筛选：待检验，检验中，已作废，已驳回，已通过
      checkStatusArr: ["2", "4", "5", "9", "-1"],
      // 标注需要筛选：已驳回，已作废，已通过，待检验，待开始，标注中
      jobStatusArr: ["0", "1", "2", "4", "9", "-1"],
      jobStatusOptions: []
    };
  },
  created() {
    this.getDicts("t_job_type").then((res) => {
      this.jobStatusOptions = res.data
    });
  },
  methods: {
    handleBlockTab() {
      this.$emit("toolsEvent", "object");
    },
    save() {
      this.loading = true;
      this.$emit("save");
    },
    saveAndNext() {
      this.loading = true;
      this.$emit("saveAndNext");
    },
    skip() {
      this.loading = true;
      this.$emit("skip");
    },
    backToProject() {
      this.$router.go(-1)
      // if (this.isCheck) {
      //   this.$router.replace({
      //     path: "/marks2d/2d/checkList",
      //     query: {
      //       groupId: this.job2d.groupId,
      //       groupStatus: this.$route.query.groupStatus
      //     },
      //   });
      // } else {
      //   this.$router.replace({
      //     path: "/marks2d/2d/jobList",
      //     query: {
      //       groupId: this.job2d.groupId,
      //       groupStatus: this.$route.query.groupStatus
      //     },
      //   });
      // }
    },
    changeStatus() {
      this.$emit("changeStatus", this.statu);
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  background-color: #fff;
  padding: 0 12px;
  box-sizing: border-box;

  svg {
    font-size: 24px;
  }

  svg.save {
    font-size: 14px;
  }
}

.header {
  padding: 10px 0;
  border-bottom: 1px solid #eef2f8;
  background: #fff;

  .logo-wrap {


    .logo {
      display: block;
      width: 88px;
      height: 50px;
    }
  }
}

.block {
  padding: 2px 12px;
  display: flex;
  align-items: center;
  color: #c9cdd4;
  background: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  gap: 12px;
}

.block .block-text {
  font-size: 16px;
  line-height: 24px;
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  p {
    min-width: 150px;
    margin: 0;
    color: #4e5969;


    span {
      margin-left: 5px;
    }
  }
}

.block .block-save {
  margin-left: auto;
  gap: 24px;

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    font-size: 14px;
  }

  p {
    margin: 0;
    min-width: 240px;
    color: #4e5969;
    display: flex;
    gap: 24px;
  }
}

.block-label {
  color: #4e5969;
  cursor: pointer;
}

.tools-wrap {
  display: flex;
  gap: 12px;
}

.tool {
  padding: 3px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-sizing: border-box;
}

.line {
  width: 1px;
  height: 26px;
  background-color: #f2f3f5;
  display: block;
}

.block.right {
  margin-left: auto;
}

::v-deep.el-button--medium {

  margin-bottom: 5px;
}
</style>
