<template>
  <div id="charts_container">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content bg-purple box header-flex">
          <div class="boxs" v-for="item in items" :key="item.id">
            <img :src="item.imageUrl" :alt="item.altText" />
            <div class="text">
              <p class="subtitle">{{ item.firstLine }}</p>
              <p class="title">{{ item.secondLine }}</p>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="grid-content bg-purple box">
          <echart-base :option="leftTopOpts" style="height: 200px"></echart-base>
        </div>
      </el-col>

      <el-col :span="16">
        <div class="grid-content bg-purple box" style="height: 364px">
          <div class="text-size">历史任务趋势统计</div>
          <echart-base :option="ops3" style="height: 314px"></echart-base>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple box" style="height: 364px">
          <div>
            <div class="text-size">本月完成数</div>
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
      </el-col>
      <el-col :span="9">
        <div class="box">
          <div class="text-size">客户单位统计</div>
          <echart-base :option="ops4" style=" height: 320px" />
        </div>
      </el-col>
      <el-col :span="9">
        <div class="box">
          <div class="text-size">客户单位统计</div>
          <echart-base :option="opt5" style="height: 320px"></echart-base>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <div class="text-size">项目类型统计</div>
          <echart-base :option="opt6" style="height: 320px"></echart-base>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="box">
          <div class="text-size">标注任务项目进度</div>
          <echart-base :option="ops7" style=" height: 320px" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <div class="text-size">项目类型统计</div>
          <echart-base :option="opt8" style="height: 320px"></echart-base>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EchartBase from "../../../components/EchartBase/index.vue";
import { page, add, update, del, data } from "@/api/chart/data";
import {
  getLeftTopOps, addData, getOps3, getBarChartOps,getOps5,getOps6,getOps7,getOps8
} from "./options2";
export default {
  components: { EchartBase },
  data() {
    return {
      items: [
        {
          id: 1,
          imageUrl: require("@/assets/images/Frame427318792.png"),
          altText: "Image 1",
          firstLine: "项目总览",
          secondLine: "192,393",
        },
        {
          id: 2,
          imageUrl: require("@/assets/images/Frame427318793.png"),
          altText: "Image 2",
          firstLine: "工作总数",
          secondLine: "192,393",
        },
        {
          id: 3,
          imageUrl: require("@/assets/images/Frame427318794.png"),
          altText: "Image 3",
          firstLine: "项目总览",
          secondLine: "192,393",
        },
        {
          id: 4,
          imageUrl: require("@/assets/images/Frame427318795.png"),
          altText: "Image 1",
          firstLine: "项目总览",
          secondLine: "192,393",
        },
        {
          id: 5,
          imageUrl: require("@/assets/images/Frame427318796.png"),
          altText: "Image 2",
          firstLine: "项目总览",
          secondLine: "192,393",
        },
        {
          id: 6,
          imageUrl: require("@/assets/images/Frame427318797.png"),
          altText: "Image 3",
          firstLine: "项目总览",
          secondLine: "192,393",
        },
      ],
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
      leftTopOpts: getLeftTopOps({
        cols: [],
        value: [],
      }), // 柱状图options
      ops3: getOps3(),
      ops4: getBarChartOps(), // 柱状图options
      opt5:getOps5(),
      opt6:getOps6(),
      ops7:getOps7(),
      opt8:getOps8(),
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(document.getElementById("charts_container").clientWidth);
      this.init();
    });
    this.timer = setInterval(() => {
      this.getLeftTopOps(10);
    }, 5000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      this.getLeftTopOps();
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
  },
};
</script>
<style  lang="scss">
.box {
  thead tr {
    background: rgb(242, 243, 245);
  }
}
</style>
<style scoped lang="scss">
#charts_container {
  background: #f7f8fa;
  height: 1200px;
}

.box {
  margin-bottom: 20px;
  width: 100%;
  border-radius: 4px;
  background: #fff;
  padding: 15px;
}

.header-flex {
  display: flex;
  flex-wrap: wrap;

  .boxs {
    flex: 0 0 30%;
    /* 每列占据30%的宽度 */
    margin: 10px;
    height: 80px;
    display: flex;
    align-items: center;
  }

  .boxs img {
    margin-left: 80px;
    height: auto;
    margin-right: 10px;
  }

  .title {
    margin-top: 5px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 14px;
    color: #86909c;
  }
}

.red {
  color: red;
}

.green {
  color: #48ff48;
}

.text-size {
  font-size: 16px;
  padding-bottom: 10px;
}
</style>
