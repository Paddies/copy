<template>
  <div>
    <el-popover ref="popoverRef" placement="right-start"  width="200" trigger="hover" v-model="isShow">
      <div class="icons">
        <div v-for="conf in tool.datas" :key="conf.code" class="conf" @click="propsChange(conf)">
          <div class="flex">
            <svg-icon :icon-class="`2d-${tool.value}`" class="icon" :style="{ color: conf.color }"></svg-icon>
            <span class="txt">{{ conf.tagName }}</span>
          </div>
          <div>{{ conf.keyCode }}</div>
        </div>
      </div>
      <div slot="reference" class="btn" :style="{ borderColor: borderColor }">
        <b class="info" :style="{ backgroundColor: borderColor }">{{ activeObj.keyCode }}</b>
        <el-button type="text" :disabled="isCheck">
          <svg-icon :icon-class="`2d-${tool.value}`" style="font-size: 44px" :style="{
              color: iconColor
            }
            "></svg-icon>
        </el-button>
      </div>

    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    tool: {
      type: Object,
      default: {},
    },

    activeObj: {
      type: Object,
      default: {},
    }
  },
  computed: {
    iconColor() {
      if (this.tool.value === this.activeObj.figureCode) {
        return this.activeObj.color
      } else {
        return '#4e5969'
      }
    },
    borderColor() {
      if (this.tool.value === this.activeObj.figureCode) {
        return this.activeObj.color || '#4e5969'
      } else {
        return '#fff'
      }
    }
  },
  data() {
    return {
      isShow: false,
      currentFigure: null,
    };
  },
  methods: {
    open() {
      // console.log('index 让我打开弹框');
      this.$refs.popoverRef.doShow()
    },
    close() {
      this.$refs.popoverRef.doClose()
    },
    propsChange(val) {
      console.log('tiptool propsChange val',val);
      this.isShow = false;
      this.$emit("change", val);
    }
  },
};
</script>
  
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}

.btn {
  border: 1px solid blue;
  border-radius: 5px;
  position: relative;

  .info {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 8px;
    width: 12px;
    height: 12px;
    text-align: center;
    color: #fff;
  }
}

.conf {
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;

  >span {
    font-size: 12px;
  }

  .txt {
    margin-left: 4px;
    margin-top: 2px;
    width: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }

  .icon {
    font-size: 20px;

  }

  .end {
    margin-left: auto;
  }
}

::v-deep .el-button--medium {
  padding: 0;
}
</style>
