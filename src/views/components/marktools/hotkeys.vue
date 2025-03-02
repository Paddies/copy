<template>
  <div class="wrap">
    <div class="title">
      <div class="text">快捷键列表</div>
      <!-- <i class="el-icon-close" @click="close"></i> -->
    </div>
    <div class="scroll_wrap">
      <div class="title">公用快捷键</div>
      <div>
        <span class="info">选取</span>
        <span class="symbol">Q</span>
        
      </div>
      <!-- 质检 -->
      <div v-if="!isCheck">
        <span class="info">删除</span>
        <span class="symbol">D</span>
       
      </div>
      <div v-if="!isCheck">
        <span class="info">保存</span>
        <span class="symbol">ctrl+s</span>
        
      </div>
      <div v-if="!isCheck">
        <span class="info">保存并继续</span>
        <span class="symbol">ctrl+shift+s</span>
        
      </div>
      <div v-if="!isCheck">
        <span class="info">取消绘制</span>
        <span class="symbol">Esc</span>
        
      </div>
      <div v-if="!isCheck">
        <span class="info">完成绘制</span>
        <span class="symbol">Space(空格)</span>
       
      </div>
      <!-- <div v-if="!isCheck">
        <span class="info">完成标注</span>
        <span class="symbol">shift+a</span>
        
      </div> -->
      <!-- 标注 -->
      <div v-if="isCheck">
        <span class="info">通过</span>
        <span class="symbol">Space(空格)</span>
       
      </div>
      <div v-if="isCheck">
        <span class="info">驳回</span>
        <span class="symbol">ESC</span>
        
      </div>
      <!-- <div v-if="isCheck">
        <span class="info">完成质检</span>
        <span class="symbol">shift+a</span>
       
      </div> -->
      <div v-if="job_mode === '2'">
        <span class="info">上一张</span>
        <span class="symbol">z</span>
        
      </div>
      <div v-if="job_mode === '2'">
        <span class="info">下一张</span>
        <span class="symbol">X</span>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    codes: {
      type: Array,
      default: (() => [])
    },
    job_mode: {
      type: String,
      default: ''
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 工具快捷键
    toolsCodes() {
      return this.codes.map(item => {
        return {
          code: item.tagCode,
          value: item.toolTxt
        }
      })
    },
    // 属性快捷键
    attrsCodes() {
      return this.codes.map(item => {
        return {
          code: item.code,
          value: item.text
        }
      })
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100vh;

  background-color: #fff;
  box-shadow: -5px 0 5px -4px rgba(0, 0, 0, 0.1);

  .title {
    display: flex;
    align-items: center;
    padding: 8px;
    gap: 24px;
    border-bottom: 1px solid var(--color-border-2, #E5E6EB);

    .text {
      flex: 1;
      font-size: 16px;
      font-weight: 400;
    }

    i {
      font-size: 20px;
    }
  }

  .scroll_wrap {
    width: 100%;
    height: calc(100vh - 92px);
    overflow-y: scroll;

    .title {
      color: #3382ff;
      background-color: rgba(51, 130, 255, 0.1);
      padding: 8px 24px;
    }

    >div {
      display: flex;
      justify-content: space-between;
      // width: 310px;
      padding: 12px 24px;
      align-items: center;
      gap: 24px;
      border-bottom: 1px solid var(--color-border-1, #F2F3F5);

      .symbol {
        // font-size: 20px;
        // font-weight: 400;
      }
    }
  }
}
</style>
