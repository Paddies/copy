<template>
  <div :id="id" :style="{width: wh.w + 'px', height: wh.h + 'px'}"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    id: "",
    wh: {
      type: Object,
      default() {
        return {
          w: 0,
          h: 0
        }
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options: {
      handler(newV, oldV) {
        if(JSON.stringify(newV) !== '{}') {
          this.init()
        }
      },
      deep: true,
      immediate: true
    },
    wh: {
      handler(newV, oldV) {
        if(this.chart) {
          this.resizeChart()
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      // 初始化
      const chart = document.getElementById(this.id)
      this.chart = echarts.init(chart);
      this.chart.setOption(this.options)
    },
    resizeChart() {
      console.log('resize')
      this.$nextTick(() => {
        this.chart.resize()
      })
    }
  },
};
</script>

<style lang="scss" scoped></style>
