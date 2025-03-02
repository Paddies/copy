<template>
  <div class="container">
    <div class="header">
      <span class="title">对象列表</span>
      <div class="icons">
        <img v-for="item in icons" :key="item" :src="require(`@/assets/icons/marks/${item}.png`)">
      </div>
      <div class="right">
        <img src="@/assets/icons/marks/close.png" alt="">
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="background-color: #FFF">
      <el-tab-pane label="标注模式" name="first" style="flex: 1"></el-tab-pane>
      <el-tab-pane label="检查模式" name="second" style="flex: 1"></el-tab-pane>
    </el-tabs>
    <div class="collapse">
      <custom-collapse></custom-collapse>
    </div>
    <div>
      <el-collapse v-model="activePane" accordion>
        <el-collapse-item name="3">
          <template slot="title">
            <span class="collapse-title">一致性 Consistency</span>
          </template>
          <div>
            <div class="collapse-first">
              <div class="content">
                <img src="@/assets/icons/marks/warn.png">
                <span>当前共有8个可导出标注对象</span>
              </div>
            </div>
            <div v-for="item in 8" :key="item" class="collapse-others">
              <img src="@/assets/icons/marks/eye.png">
              <div class="content">
                <img src="@/assets/icons/marks/transform.png">
                <span>#1-人</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import CustomCollapse from "./customcollapse";
export default {
  components: {
    CustomCollapse
  },
  data() {
    return {
      icons: ['highlight_01','highlight_02','highlight_03','highlight_04'],
      activeName: 'first',
      activePane: '3'
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav {
  width: 100%;
  background-color: #FFF;
}
::v-deep .el-tabs__item {
  width: 50%;
  text-align: center;
  background-color: transparent;
}
::v-deep .el-input.el-input--small {
  line-height: 20px;
  height: 20px;
  > .el-input__inner {
    line-height: 20px;
    height: 20px;
  }
}
.container {
  min-width: 400px;
}
.header {
  display: flex;
  width: 100%;
  height: 60px;
  padding: 0px 12px 0px 24px;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
  background-color: #FFF;
  .title {
    display: block;
    width: 128px;
    font-size: 20px;
    color: #1D2129;
  }
  .icons {
    display: flex;
    gap: 12px;
  }
  .icons > img{
    width: 32px;
  }
  .right {
    margin-left: 0;
  }
}
.collapse {
  width: 100%;
  display: flex;
  justify-content: space-between;
  > div {
    width: 100%;
  }
}
.collapse-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: #4E5969;
  padding: 0 24px;
}
.collapse-first {
  display: flex;
  width: 400px;
  padding: 12px;
  gap: 10px;
  .content {
    width: 100%;
    display: flex;
    padding: 8px 12px;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 4px;
    background: rgba(51, 130, 255, 0.10);
    > span {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      color: #3382FF;
    }
  }
}
.collapse-others {
  display: flex;
  width: 400px;
  padding: 16px 24px;
  gap: 10px;
  border-bottom: 1px solid var(--color-border-1, #F2F3F5);
  > img {
    width: 24px;
    height: 24px;
  }
  > .content {
    display: flex;
    align-items: center;
    gap: 12px;
    > span {
      color: var(--color-text-1, #1D2129);
      /* 16/CN-Medium */
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
  }
}
</style>
