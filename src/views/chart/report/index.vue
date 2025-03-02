<template>
  <div id="charts_container">
    <div class="header">
      <svg-icon icon-class="logoProject" style="width: 160px; height: 36px"></svg-icon>
      <span>数字化大屏管理</span>
    </div>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="8" class="grid-content bg-purple">
          <div class="Overview">
            <span>客户总览</span>
            <div class="containers">
              <div class="item" v-for="(item, index) in  clientList" :key="index">
                {{ item.name }}
                <br />
                <span>{{ item.data }}</span>
              </div>

            </div>
          </div>
        </el-col>
        <el-col :span="8" class="grid-content bg-purple">
          <div class="Overview">
            <span>工会总览</span>
            <div class="containers">
              <div class="item" v-for="(item, index) in  unionList" :key="index">
                {{ item.name }}
                <br />
                <span>{{ item.data }}</span>
              </div>

            </div>
          </div>
        </el-col>
        <el-col :span="8" class="grid-content bg-purple">
          <div class="Overview">
            <span>任务总览</span>
            <div class="containers">
              <div class="item" v-for="(item, index) in  questList" :key="index">
                {{ item.name }}
                <br />
                <span>{{ item.data }}</span>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:40px ;">
        <el-col :span="12" class="grid-content bg-purple ">
          <div class="shado">
            <i class="el-icon-s-order"></i>
            <span class="green">任务完成情况</span>
            <echart-base :option="optionsOne" style="width:100%;height:500px;" />
          </div>
        </el-col>
        <!-- <el-col :span="2">
          <p></p>
        </el-col> -->
        <el-col :span="12" class="grid-content bg-purple ">
          <div class="shado">
            <i class="el-icon-s-claim"></i>
            <span class="green">平台情况</span>
            <echart-base :option="optionsTwo" style="width:100%x;height:500px;" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import EchartBase from "../../../components/EchartBase/index.vue";
import { getOptionsTwo, } from "./options";
import { handleChartData, handleChartDatas, addData } from '../project/options';
// import { handleChartDatas } from '../project/options';
import { page, add, update, del, data } from "@/api/chart/data";
export default {
  components: { EchartBase },
  data() {
    return {
      clientList: [],
      unionList: [],
      questList: [],
      optionsOne: getOptionsTwo(),
      optionsTwo: getOptionsTwo()
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(document.getElementById("charts_container").clientWidth);
      this.init();
    });
    this.timer = setInterval(() => {
      this.getClientData(10);
      this. getUnionData(10);
      this.getQuestData(10);
      this.getOpsOneData(10);
      this.getOpsTwoData(10)
    }, 5000);
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    init() {
      this.getClientData();
      this.getUnionData();
      this.getQuestData();
      this.getOpsOneData();
      this.getOpsTwoData()
    },
    async getClientData(count) {
      if (count) {
        this.ClientData = addData(this.ClientData, count);
        this.clientList = handleChartDatas(this.ClientData);
        return
      }
      const response = await data({
        chartModel: "平台维度",
        chartFunction: "客户总览",
      });
      this.ClientData = handleChartData(response);
      this.clientList = handleChartDatas(this.ClientData);
      // console.log( this.clientList)
    },
    async getUnionData(count) {
      if (count) {
        this.UnionData = addData(this.UnionData, count);
        this.unionList = handleChartDatas(this.UnionData);
        return
      }
      const response = await data({
        chartModel: "平台维度",
        chartFunction: "工会总览",
      });
      this.UnionData = handleChartData(response);
      this.unionList = handleChartDatas(this.UnionData);
      // console.log(arrayTab)
    },
    async getQuestData(count) {
      if (count) {
        this.QuestData = addData(this.QuestData, count);
        this.questList = handleChartDatas(this.QuestData);
        return
      }
      const response = await data({
        chartModel: "平台维度",
        chartFunction: "任务总览",
      });
      this.QuestData = handleChartData(response);
      this.questList = handleChartDatas(this.QuestData);
      // console.log(arrayTab)
    },
    //todo 左边柱形图
    async getOpsOneData(count) {
      const handleData = () => {
        const list = this.OpsOneData
        const colors = [
          "#4880FF",
          "#F9C74F",
        ]
        let arrayTab = [];
        let i2 = 0
        for (const i in list) {
          arrayTab.push(
            {
              color: colors[i2],
              name: i,
              data: list[i].split(",").map((item) => Number(item.trim())), //去掉空格，并转换为数字
            });
          i2++
        }
        this.optionsOne = getOptionsTwo(arrayTab)
      }
      if (count) {
        this.OpsOneData = addData(this.OpsOneData, count)
        handleData()
        return
      }
      const response = await data({
        chartModel: "平台维度",
        chartFunction: "任务完成情况",
      });

      this.OpsOneData =handleChartData(response) ;
      handleData()
      // console.log( arrayTab)
    },
    //todo 右边柱形图
    async getOpsTwoData(count) {
      const handleData = () => {
        const list =this.OpsTwoData
      const colors = [
        "#57A9FB",
        "#F76560",
      ]
      let arrayTab = [];
      let i2 = 0
      for (const i in list) {
        arrayTab.push(
          {
            color: colors[i2],
            name: i,
            data: list[i].split(",").map((item) => Number(item.trim())), //去掉空格，并转换为数字
          });
        i2++
      }
      this.optionsTwo = getOptionsTwo(arrayTab);
      // console.log( arrayTab);
      }
      if (count) {
        this.OpsTwoData = addData(this.OpsTwoData, count)
        handleData()
        return
      }

      const response = await data({
        chartModel: "平台维度",
        chartFunction: "平台情况",
      });
      this.OpsTwoData =handleChartData(response) ;
      handleData()
    },
  }
};
</script>

<style scoped lang="scss">
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
}

.Overview {
  height: 240px;
  text-align: center;
  font-size: 23px;
  background-color: #ebf1fd;
  color: #2968cc;
  border-radius: 15px;
  box-shadow: 7px 7px 12px rgba(246, 241, 241, 0.4),
    -7px -7px 12px rgba(255, 255, 255, 0.9);
  padding: 20px;
  border: 1px solid #aecbfc;
}

.containers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.item {
  font-size: 18px;
  flex-basis: 50%;
  padding: 10px;
  box-sizing: border-box;

  span {
    font-size: 30px;
    color: #4880ff;
  }
}

.shado {
  box-shadow: 0px 3px 15px 0px #9bc3f9bf;
  border-radius: 15px;
  padding: 20px;
}

.green {
  color: #4880ff;
  font-size: 24px;
}

i {
  font-size: 28px;
  color: #4880ff;
}
</style>
