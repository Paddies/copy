<template>
  <div class="wrap">
    <div class="block" v-if="!isCheck">
      <tip-tool v-for="(tool, index) in toolsConfigs" :ref="`tipToolsRef_${tool.value}`" :key="index" :isCheck="isCheck"
        :tool="tool" @change="propsChange" v-bind="$attrs" v-on="$listeners"></tip-tool>
    </div>
    <div class="block">
      <el-tooltip class="item" effect="dark" content="选取" placement="right-end">
        <svg-icon icon-class="2d-choose" :class="reactived === 'select' ? 'activeIcon' : ''"
          @click="eventChange('select')"> </svg-icon>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="辅助线" placement="right-end">
        <svg-icon icon-class="2d-helper" :class="reactived === 'helper' ? 'activeIcon' : ''"
          @click="eventChange('helper')"></svg-icon>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="移动画布" placement="right-end">
        <svg-icon icon-class="2d-drager" :class="reactived === 'drager' ? 'activeIcon' : ''"
          @click="eventChange('drager')"></svg-icon>
      </el-tooltip>

    </div>
  </div>
</template>

<script>
import TipTool from "./tiptool";
export default {
  components: {
    TipTool,
  },
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    toolsConfigs: {
      type: Array,
      default: () => [],
    }
  },
  computed: {
    isDrager() {
      let enableDrager = sessionStorage.getItem("enableDrager")
      return enableDrager && enableDrager === '1'
    }
  },
  data() {
    return {
      active: 1,
      activeIcon: "",
      reactived: 'helper',
    };
  },
  methods: {
    resetStatus() {
      this.active = 1;
      this.activeIcon = "";
      this.reactived = '';
    },
    eventChange(action) {
      this.reactived = action;
      this.$emit("toolsEvent", this.reactived);
    },
    // 属性框
    propsChange(props) {
      this.reactived = 'helper'

      this.$emit("toolsProps", {
        ...props,
      });
    },
    // 打开工具选择
    open(value) {
      this.close()
      // 打开对应的
      this.$refs[`tipToolsRef_${value}`][0].open()

    },
    close() {
      // 先关掉所有的
      this.toolsConfigs.forEach(item => {
        this.$refs[`tipToolsRef_${item.value}`][0].close()
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px;
  overflow-y: auto;
  z-index: 1;

  .block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 44px;
    padding: 24px 12px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);

    .icon {
      font-size: 32px;
      margin: 6px;
    }
  }
}

.activeIcon {
  color: #3382ff;
}

.conf:hover {
  background-color: rgba(51, 130, 255, 0.1);
}

svg {
  color: #4e5969;
  cursor: pointer;
}
</style>
