<template>
  <div id="charts_container">
    <div class="header">
      <svg-icon icon-class="logoProject" style="width: 160px; height: 36px"></svg-icon>
      <span>数字化大屏管理</span>
    </div>
    <div class="container">
      <div class="top">
        <div class="left">
          <echart-base :option="leftTopOpts" style="height: 200px"></echart-base>
          <div style="margin-top: -20px">
            <span class="green">本月完成数</span>
            <el-table :data="tableData" :cell-style="{
              background: 'transparent',
              'text-align': 'center',
            }" :header-cell-style="{
  'text-align': 'center',
  background: 'transparent',
}">
              <el-table-column prop="rank" label="排名"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="complate" label="完成数"></el-table-column>
              <el-table-column prop="percentage" label="同比">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.percentage
                  }}</span>
                  <i v-if="scope.row.isRise > 0" class="el-icon-top green"></i>
                  <i v-if="scope.row.isRise < 0" class="el-icon-bottom red"></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="center">
          <div class="main" :style="{ 'background-image': `url(${chatsPng})` }">
            <div class="c-box">
              <div class="c-left" :span="7">
                <div>
                  <div class="statistics statistics-1 mb50">
                    <div class="num">{{ projectObject["工作总数"] }}</div>
                    <div class="tip" style="color: #fd8b1f">工作总数</div>
                  </div>
                  <div class="statistics statistics-1">
                    <div class="num">{{ projectObject["工作剩余"] }}</div>
                    <div class="tip" style="color: #45d1d1">工作剩余</div>
                  </div>
                </div>
              </div>
              <div class="c-center" :span="9">
                <EchartBase style="height: 360px" :option="options1" class="options1" />

                <div class="overview">
                  <p>项目总览</p>
                </div>
                <div>
                  <el-row style="width: 100%" class="num-box">
                    <el-col :span="6" class="statistics-3 statistics" v-for="(item, index) in workCountList" :key="index">
                      <div>
                        <div class="num">{{ item }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="c-right" :span="7">
                <div style="padding-left: 5px; padding-right: 5px">
                  <div class="statistics-1 statistics mb50">
                    <div class="num">{{ projectObject["完成度"] }}</div>
                    <div class="tip" style="color: #00b42a">完成度</div>
                  </div>
                  <div style="margin: 0px 0px" class="statistics-2-box">
                    <div class="statistics-2 statistics">
                      <div class="num">{{ projectObject["返工数"] }}</div>
                      <div class="tip" style="color: #f44a4b">返工数</div>
                    </div>
                    <div class="statistics-2 statistics">
                      <div class="num">{{ projectObject["无效数"] }}</div>
                      <div class="tip" style="color: #f6bf3a">无效数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="p-10">
            <i class="el-icon-discover"></i>
            <span class="green">历史任务趋势统计</span>
          </div>
          <echart-base :option="option2" style="height: 460px" />
        </div>
      </div>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5" class="corner grid-content bg-purple">
          <div class="p-10">
            <i class="el-icon-s-order"></i>
            <span class="green">本月项目进度</span>
          </div>
          <echart-base style="width: 280px; height: 320px" :option="option3" />
        </el-col>
        <el-col :span="12" class="grid-content bg-purple">
          <el-row class="corner">
            <el-col :span="11">
              <div class="p-10">
                <i class="el-icon-user"></i>
                <span class="green">客户单位统计</span>
              </div>
              <echart-base :option="ops4" style="width: 300px; height: 320px" />
            </el-col>
            <el-col :span="6">
              <div class="p-10">
                <i class="el-icon-monitor"></i>
                <span class="green">业务接入统计</span>
              </div>
              <div class="block" v-for="(item, index) in businessList" :key="index">
                <span class="demonstration">{{ item.name }}</span>
                <el-slider :value="parseInt(item.data)"></el-slider>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="p-10">
                <i class="el-icon-document"></i>
                <span class="green">项目类型统计</span>
              </div>
              <!-- <div
                ref="chart_bottom_center_two"
                id="chart_bottom_center_two"
                style="width:190px;height:320px;"
              ></div>-->
              <echart-base :option="ops5" style="height: 320px" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7" class="corner grid-content bg-purple">
          <div class="p-10">
            <i class="el-icon-files"></i>
            <span class="green">标注任务类型统计</span>
          </div>
          <!-- <div ref="chart_bottom_right" id="chart_bottom_right" style="width:500px;height:320px;"></div> -->
          <echart-base :option="ops6" style="width: 500px; height: 320px" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { page, add, update, del, data } from "@/api/chart/data";
import EchartBase from "../../../components/EchartBase/index.vue";
import {
  getOptions1,
  getLineChartOption1,
  getOption3,
  getBarChartOps,
  getBarChartOps2,
  getlineChartTwoOptons,
  getLeftTopOps,
  handleChartData,
  handleChartDatas,
  addData,
} from "./options";
export default {
  components: { EchartBase },
  data() {
    return {
      projectObject: {},
      workCountList: [],
      businessList: [],
      tableData: [
        {
          rank: 1,
          name: "张元",
          complate: 1000,
          percentage: "10.5%",
          isRise: -1,
        },
        {
          rank: 2,
          name: "张元",
          complate: 1000,
          percentage: "10.5%",
          isRise: -1,
        },
        {
          rank: 3,
          name: "张元",
          complate: 1000,
          percentage: "10.5%",
          isRise: 0,
        },
        {
          rank: 4,
          name: "张元",
          complate: 1000,
          percentage: "10.5%",
          isRise: 1,
        },
        {
          rank: 5,
          name: "张元",
          complate: 0,
          percentage: "10.5%",
          isRise: 1,
        },
      ],
      timer: null,
      chatsPng: require("@/assets/images/chats.png"),
      id: "left",
      loadLine: true,
      options1: getOptions1(),
      option2: getLineChartOption1(),
      option3: getOption3(),
      ops4: getBarChartOps({
        cols: [],
        value: [],
      }), // 柱状图options
      ops5: getBarChartOps2(), // 柱状图options
      leftTopOpts: getLeftTopOps({
        cols: [],
        value: [],
      }), // 柱状图options
      ops6: getlineChartTwoOptons(), // 柱状图options
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(document.getElementById("charts_container").clientWidth);
      this.init();
    });
    this.timer = setInterval(() => {
      this.getCenterData(10);
      this.getOps2Data(10);
      this.getLeftTopOps(10);
      this.getOps3Data(10);
      this.getOps4Data(2);
      this.getOps5Data(2);
      // this.getOps6Data(1);
      this.getOps7Data(5);
    }, 5000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      this.getLeftTopOps();
      this.getCenterData();
      this.getOps2Data();
      this.getOps3Data();
      this.getOps4Data();
      this.getOps5Data();
      this.getOps6Data();
      this.getOps7Data();
    },

    getLeftTopOps(count) {
      if (count) {
        this.leftOpsData = addData(this.leftOpsData, count);
        this.leftTopOpts = getLeftTopOps(this.leftOpsData);
        return;
      }

      data({ chartModel: "公司维度", chartFunction: "新增条形图" }).then(
        (response) => {
          this.leftOpsData = response.data;

          this.leftTopOpts = getLeftTopOps(this.leftOpsData);
        }
      );
    },

    //TODO 获取中间仪表盘的数据
    getCenterData(count) {
      console.log("2023-10-14 13:02:03 index.vue line:263", count);
      // 如果count有值，代表为定时器增加的值，不用再请求接口
      if (count && this.centerData) {
        // console.log('2023-10-14 13:01:31 index.vue line:265', this.centerData)

        this.centerData = addData(this.centerData, count);
        this.projectObject = this.centerData;
        this.workCountList = `${this.centerData["工作总数"]}`.split("");
        return;
      }

      data({ chartModel: "公司维度", chartFunction: "项目总览" }).then(
        (response) => {
          const { code } = response;
          if (code === 200) {
            this.centerData = handleChartData(response);
            this.projectObject = this.centerData;
            this.workCountList = this.centerData["工作总数"].split("");
          }
        }
      );
    },
    //todo 历史任务趋势统计
    async getOps2Data(count) {
      const handleData = () => {
        const list = this.ops2Data;
        const colors = [
          "#0e42d2",
          "#4086ff",
          "#846bce",
          "#21ccff",
          "#86df6c",
          "#86df6c",
        ];
        let arrayTab = [];
        for (const i in list) {
          arrayTab.push({
            name: i,
            data: list[i].split(",").map((item) => Number(item.trim())), //去掉空格，并转换为数字
          });
        }

        this.option2 = getLineChartOption1(arrayTab, colors);
      };

      if (count) {
        this.ops2Data = addData(this.ops2Data, count);
        handleData();
        return;
      }

      const response = await data({
        chartModel: "公司维度",
        chartFunction: "历史任务趋势统计",
      });

      this.ops2Data = handleChartData(response);
      handleData();
    },

    //TODO 获取左下饼图的数据
    async getOps3Data(count) {
      if (count) {
        this.ops3Data = addData(this.ops3Data, count);
        const arrayTab = handleChartDatas(this.ops3Data);
        this.option3 = getOption3(arrayTab);
        return;
      }
      const response = await data({
        chartModel: "公司维度",
        chartFunction: "本月项目进度",
      });
      this.ops3Data = handleChartData(response);
      const arrayTab = handleChartDatas(this.ops3Data);
      this.option3 = getOption3(arrayTab);
    },
    //TODO 获取左下柱形图的数据
    async getOps4Data(count) {
      if (count) {
        this.ops4Data = addData(this.ops4Data, count);
        this.ops4 = getBarChartOps(this.ops4Data);
        return;
      }

      const response = await data({
        chartModel: "公司维度",
        chartFunction: "客户单位统计",
      });

      this.ops4Data = response.data;
      this.ops4 = getBarChartOps(this.ops4Data);
    },
    //TODO 获取进度条数据
    async getOps5Data(count) {
      if (count) {
        this.Ops5Data = addData(this.Ops5Data, count);
        this.businessList = handleChartDatas(this.Ops5Data);
        return;
      }
      const response = await data({
        chartModel: "公司维度",
        chartFunction: "业务接入统计",
      });
      this.Ops5Data = handleChartData(response);
      this.businessList = handleChartDatas(this.Ops5Data);
    },
    //TODO 获取中间饼图的数据
    async getOps6Data(count) {
      if (count) {
        this.ops6Data = addData(this.ops6Data, count);
        const arrayTab = handleChartDatas(this.ops6Data);
        this.ops5 = getBarChartOps2(arrayTab);
        return;
      }
      const response = await data({
        chartModel: "公司维度",
        chartFunction: "项目类型统计",
      });
      this.ops6Data = handleChartData(response);
      const arrayTab = handleChartDatas(this.ops6Data);
      this.ops5 = getBarChartOps2(arrayTab);
    },
    //todo 右下柱形图
    async getOps7Data(count) {
      const handleData = () => {
        const list = this.ops6Data;
        const colors = [
          "#0e42d2",
          "#4086ff",
          "#846bce",
          "#21ccff",
          "#86df6c",
          "#86df6c",
        ];
        let arrayTab = [];
        let i2 = 0;
        for (const i in list) {
          // console.log(,i);
          arrayTab.push({
            color: colors[i2],
            name: i,
            type: "bar",
            data: list[i].split(",").map((item) => Number(item.trim())), //去掉空格，并转换为数字
          });
          i2++;
        }
        this.ops6 = getlineChartTwoOptons(arrayTab);
        // console.log(arrayTab)
      };
      if (count) {
        this.ops6Data = addData(this.ops6Data, count);
        handleData();
        return;
      }
      const response = await data({
        chartModel: "公司维度",
        chartFunction: "标注任务类型统计",
      });
      this.ops6Data = handleChartData(response);
      handleData();
    },
  },
};
</script>

<style scoped lang="scss">
.p-10 {
  padding: 10px;
}

div {
  box-sizing: border-box;
}

::v-deep .el-table {
  width: 100%;
  background-color: transparent;

  tr {
    background-color: transparent;
  }

  .el-table__header,
  .el-table__body {
    width: 100% !important;
  }
}

.c-box {
  display: flex;
  width: 100%;

  .c-left {
    width: 25%;
    padding-left: 20px;
  }

  .c-center {
    width: 50%;

    .options1 {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .statistics-2-box {
    display: flex;
  }

  .c-right {
    width: 25%;
    padding-right: 20px;
  }
}

.top {
  display: flex;

  .left {
    width: 20%;
  }

  .right {
    width: 20%;
  }

  .center {
    width: 60%;
    padding: 20px;

    .main {
      background-size: 100% 100%;
      display: flex;
      padding-top: 80px;
      height: 538px;
      justify-content: center;

      ::v-deep .el-row {
        flex: 1;
      }
    }
  }
}

.num-box {
  display: flex;
  justify-content: center;
}

.header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 10px;
  padding: 16px 0;

  span {
    color: #4880ff;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
  }
}

.container {
  min-width: 1400px;
  padding: 28px;
  background: linear-gradient(to left,
      rgba(253, 253, 253, 0.18) 0%,
      rgba(83, 183, 255, 0.13) 50%,
      rgba(255, 255, 255, 0.49) 100%);

  .mb50 {
    margin-bottom: 50px;
  }

  .main {
    width: 100%;
    height: 100%;
    aspect-ratio: 4/3;
    background-size: 100%;
    background-repeat: no-repeat;

    overflow: hidden;
  }
}

.red {
  color: red;
}

.green {
  color: #4880ff;
}

.statistics {
  background-color: #ebf1fd;
  text-align: center;
  font-size: 15px;
  color: #4880ff;
  border-radius: 4px;
  box-shadow: 7px 7px 12px rgba(246, 241, 241, 0.4),
    -7px -7px 12px rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.statistics-1 {
  height: 100px;
}

.statistics-2 {
  height: 100px;

  margin: 0px 3px;
  flex: 1;
}

.statistics-3 {
  margin-right: 30px;
  color: #141414;
  box-shadow: 0px 4px 10px 0px #5493ff33;

  font-size: 20px;
  font-weight: 800;

  &:last-child {
    margin-right: 0;
  }
}

.search_item {
  margin: 10px;
  display: flex;

  .btn {
    margin: 5px 0 0 20px;
  }
}

.overview {
  height: 50px;
  margin-top: -98px;
  font-size: 19px;
  color: #4880ff;
  text-align: center;
}

.corner {
  background: hsl(0, 100%, 100%);
  border-radius: 10px 10px 10px 10px;
  color: #4880ff;
  font-size: 16px;
}

.Progress {
  margin-top: 70px;
  margin-left: 5px;
}

.statistics-3 {
  background: linear-gradient(321.91deg,
      rgba(253, 254, 255, 0.6) -8.16%,
      rgba(244, 247, 252, 0.6) 86.63%);
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demonstration {
  font-size: 12px;
  color: dimgray;
}

.block {
  margin-top: 40px;
}
</style>
