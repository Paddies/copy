<template>
  <div ref="currentDom" />
</template>
  
<script>
import * as echarts from "echarts";
export default {
  name: "EchartBase",
  props: {
    option: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  computed: {},
  watch: {
    option: {
      handler(newName, oldName) {
        console.log("newName", newName);
        this.setOption()
        //执行代码
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      let myChart = echarts.init(this.$refs.currentDom);
      this.myChart = myChart;
      this.setOption();
      this.autoRsize();
    },
    setOption() {
      this.myChart.setOption(this.option);
    },
    autoRsize() {
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    }
  }
};
</script>
  
