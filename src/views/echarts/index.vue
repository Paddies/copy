<template>
  <div>
    <custom-chart id="chart_left_top" ref="chart_left_top" :options="chart_left_top" :wh="chart_w_h['chart_left_top']" ></custom-chart>
  </div>
</template>

<script>
import { data } from "@/api/chart/data";
import { debounce, deepClone } from "@/utils"
import CustomChart from "@/views/components/charts";
// echarts宽高常量
const chart_w_h = {
  chart_left_top: {w: 400, h: 400},
  chart_left_center: {w: 400, h: 400},
  chart_left_bottom: {w: 400, h: 400},
  chart_center_top: {w: 400, h: 400},
  chart_center_bottom: {w: 400, h: 400},
  chart_right_top: {w: 400, h: 400},
  chart_right_center: {w: 400, h: 400},
  chart_right_bottom: {w: 400, h: 400}
}
export default {
  components: {
    CustomChart,
  },
  data() {
    return {
      chart_w_h: {
        chart_left_top: {w: 400, h: 400},
        chart_left_center: {w: 400, h: 400},
        chart_left_bottom: {w: 400, h: 400},
        chart_center_top: {w: 400, h: 400},
        chart_center_bottom: {w: 400, h: 400},
        chart_right_top: {w: 400, h: 400},
        chart_right_center: {w: 400, h: 400},
        chart_right_bottom: {w: 400, h: 400}
      },  // 定义echarts的原始宽高
      rate: document.body.clientWidth / 1980,  // 比例
      chart_left_top: {},
    };
  },
  mounted() {
    this.init();
    const self = this;
    window.addEventListener('resize', debounce(function() {
      const rate = document.body.clientWidth / 1980
      this.rate = rate
      self.resizeEchart(rate)
    }, 500), false)
  },
  methods: {
    resizeEchart(rate) {
      this.$nextTick(() => {
        Object.keys(this.chart_w_h).forEach(item => {
          this.chart_w_h[item].w = chart_w_h[item].w * rate
          this.chart_w_h[item].h = chart_w_h[item].h * rate
        })
      })
      console.log(this.chart_w_h);
    },
    init() {
      // 柱状图
      data({ chartModel: "公司维度", chartFunction: "新增条形图" }).then((response) => {
        this.chart_left_top = {
          title: {
            text: ["{a|时间范围：}" + "{b|2023.08.23-2023.08.24}"], // 标题文字
            textStyle: {
              rich: {
                a: {
                  color: "#4086FF",
                  fontSize: 18 * this.rate,
                },
                b: {
                  color: "black",
                  fontSize: 18 * this.rate,
                },
              },
            },
            padding: 10 * this.rate, // 标题内边距
            x: "left", // 标题水平居中
            y: "top", // 标题位于图表顶部
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            show: false,
          },
          // grid: {},
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            axisLabel: {
              formatter: function (value) {
                if (value < 1000) {
                  return value;
                } else {
                  return `${parseInt(value / 1000)}.${(value % 1000) / 100}k`;
                }
              },
            },
          },
          grid: {
            left: "0", // 固定左边刻度宽度
            // right: "4%",
            // bottom: "3%",
            containLabel: true,
          },
          yAxis: {
            type: "category",
            data: response.data.cols,
            axisLabel: {
              width: 200,
            },
          },
          series: [
            {
              // name: '2011',
              type: "bar",
              data: response.data.value,
              barWidth: `${20 * this.rate}px`, // 设置柱状图宽度，可以是像素或百分比
              itemStyle: {
                normal: {
                  //柱形图圆角，初始化效果
                  barBorderRadius: [10, 10, 10, 10],
                  color: "#4086FF",
                },
              },
            },
          ],
        };
        this.resizeEchart(this.rate)
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
