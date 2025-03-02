<template>
  <div class="wrap" v-if="imgData">
    <div class="block">
      <span class="tool" :class="rightStatus === 'hotkey' ? 'activeIcon' : ''" @click="handleClick('hotkey')">
        <svg-icon icon-class="2d-demand"></svg-icon>
        <span>热键说明</span>
      </span>
      <span class="line"></span>
      <span class="tool" :class="rightStatus === 'objects' ? 'activeIcon' : ''" @click="handleClick('objects')">
        <svg-icon icon-class="2d-hotkey"></svg-icon>
        <span>对象列表</span>
      </span>
      <span class="line"></span>
      <span class="tool" :class="rightStatus === 'rejectList' ? 'activeIcon' : ''" @click="handleClick('rejectList')">
        <svg-icon icon-class="2d-error"></svg-icon>
        <span>驳回列表</span>
      </span>
      <span class="tool" :class="rightStatus === 'rejectRecord' ? 'activeIcon' : ''" @click="handleClick('rejectRecord')">
        <svg-icon icon-class="2d-error"></svg-icon>
        <span>驳回记录</span>
      </span>
    </div>
    <div class="block handler" v-if="job_mode === '2'">
      <!-- 直达第一题 -->
      <!-- <el-tooltip class="item" effect="dark" content="第一题" placement="top-start">
        <el-button type="text" :disabled="prevJob && prevJob === '-1'" @click="handleClick('start')">
          <svg-icon icon-class="top1" class="icon"></svg-icon>
        </el-button>
      </el-tooltip> -->

      <!-- 上一张 -->
      <el-button type="text" :disabled="prevJob && prevJob === '-1'" @click="handleClick('prev')">
        <svg-icon icon-class="left" class="icon"></svg-icon>
      </el-button>
      <!-- 当前题介绍 -->
      <span class="file-name">
        <svg-icon icon-class="2d-pic"></svg-icon>
        <span style="margin-left: 5px;">{{ fileName }}</span>
      </span>
      <!-- 下一题 -->
      <el-button type="text" :disabled="nextJob && nextJob === '-1'" @click="handleClick('next')">
        <svg-icon icon-class="right" class="icon"></svg-icon>
      </el-button>
      <!-- 直达最后一题 -->
      <!-- <el-tooltip class="item" effect="dark" content="最后一题" placement="top-start">
        <el-button type="text" :disabled="nextJob && nextJob === '-1'" @click="handleClick('end')">
          <svg-icon icon-class="end1" class="icon"></svg-icon>
        </el-button>
      </el-tooltip> -->

      <!-- 跳转指定题 -->
      <!-- <el-input-number v-model="taskNum" :precision="0" :controls="false" @change="handleChange" :min="1" :max="maxNum"
        label="描述文字"></el-input-number> -->

    </div>
    <!--  -->
    <!-- 质检按钮显示 -->
    <div class="block btns" v-if="isCheck && groupStatus === '7'">
      <el-button v-if="(groupStatus === '7') && checkPermi(['graph:job:graphJobCheck'])" type="primary" plain
        :disabled="this.objCheckList.length > 0" @click="handleClick('pass')">通过</el-button>
      <el-button v-if="groupStatus === '7' && checkPermi(['graph:job:graphJobCheck'])" type="danger" plain
        @click="handleClick('reject')">驳回</el-button>
      <el-button v-if="groupStatus === '7' && checkPermi(['graph:job:completeCheck'])" type="primary" plain
        @click="handleClick('checkComplete')">完成质检</el-button>
    </div>
    <div class="block btns" v-if="!isCheck && (groupStatus === '1' || groupStatus === '6')">
      <el-button v-if="(groupStatus === '1' || groupStatus === '6') && checkPermi(['graph:job:invalidJob'])" type="danger"
        @click="handleClick('nomark')">无法标注</el-button>
      <el-button type="primary" plain @click="handleClick('markComplete')"
        v-if="(groupStatus === '1' || groupStatus === '6') && checkPermi(['graph:job:completeJob'])">完成标注</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bottomhandler',
  props: {
    isCheck: {
      type: Boolean,
      default: false
    },
    imgData: {
      type: Object,
      default: {}
    },
    // 标注模式：'1' ： 系统派题  '2': 手动派题
    job_mode: {
      type: String,
      default: ''
    },
    objCheckList: {
      type: Array,
      default: {}
    },
    rightStatus: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      taskNum: 1,
      groupStatus: ''
    }
  },
  mounted() {
    // 可以在这里进行其他初始化操作
    this.groupStatus = this.$route.query.groupStatus;
    console.log(this.groupStatus)
  },
  computed: {
    imgName() {
      return this.imgData?.fileName || ''
    },
    prevJob() {
      return this.imgData?.upJobId || '-1'
    },
    nextJob() {
      return this.imgData?.nextJobId || '-1'
    },
    fileName() {
      return this.imgData?.fileName || ''
    },
    maxNum() {
      return Number(this.imgData.maxNum)
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('eventTab', {
        type: 'self',
        jobNum: value || '1'
      })
    },
    handleClick(type) {
      this.$emit('eventTab', {
        type: type,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  height: 92px;
  display: flex;
  padding: 12px 12px 12px 0;
  box-sizing: border-box;
  overflow-x: auto;

  .block {
    padding: 6px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: #86909C;
    border-radius: 4px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);

    .icon {
      width: 24px;
      height: 24px;
    }

    .tool {
      padding: 6px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      box-sizing: border-box;
      cursor: pointer;
      width: 100px;

      svg {
        font-size: 24px;
      }
    }

    .tool.activeIcon {
      color: #1890ff;
    }

    .line {
      width: 1px;
      height: 26px;
      background-color: #f2f3f5;
      display: block;
    }
  }

  .block.handler {
    padding: 0 12px;
    gap: 12px;

    .file-name {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }

  .block.handler.absolute {
    position: absolute;
    right: 20px;
    top: 2px;
    border-radius: 0;
  }

  .block.btns {
    padding: 0 12px;
  }
}
</style>
