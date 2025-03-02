<template>
    <div id="charts_container">
        <div class="Customer box">
            <h2>客户总览</h2>
            <div class="container">
                <div class="CustomerBox" :style="{ 'background-image': `url(${image_1})` }">
                    <div class="content">
                        <div class="subtitle">用户数量</div>
                        <div class="title">39,807</div>
                    </div>
                </div>
                <div class="CustomerBox" :style="{ 'background-image': `url(${image_2})` }">
                    <div class="content">
                        <div class="subtitle">今日新增</div>
                        <div class="title">36,025</div>
                    </div>
                </div>
                <div class="CustomerBox" :style="{ 'background-image': `url(${image_3})` }">
                    <div class="content">
                        <div class="subtitle">本周新增</div>
                        <div class="title">32,857</div>
                    </div>
                </div>
                <div class="CustomerBox" :style="{ 'background-image': `url(${image_4})` }">
                    <div class="content">
                        <div class="subtitle">上月新增</div>
                        <div class="title">25,467</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="data box">
            <h2>数据总览</h2>
            <div class="containers">
                <div class="dataBox" v-for="(datas, index) in datas" :key="index">
                    <div class="content">
                        <div class="subtitle">{{ datas.title }}</div>
                        <div class="titles">{{ datas.subtitle }}</div>
                        <div class="subtitle">
                            {{ datas.description }}
                            <span class="color">{{ datas.data }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-row :gutter="20" style="margin-top: 40px">
            <el-col :span="12">
                <div class="shado">
                    <span class="green">任务完成情况</span>
                    <echart-base :option="optionsOne" style="width: 100%; height: 500px" />
                </div>
            </el-col>
            <!-- <el-col :span="2">
          <p></p>
        </el-col> -->
            <el-col :span="12">
                <div class="shado">
                    <span class="green">平台情况</span>
                    <echart-base :option="optionsTwo" style="width: 100%; height: 500px" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from "echarts";
import EchartBase from "../../../components/EchartBase/index.vue";
import { getOptionsOne, getOptionsTwo } from "./options2";
export default {
    components: { EchartBase },
    data() {
        return {
            image_1: require("@/assets/images/Customer1.png"),
            image_2: require("@/assets/images/Customer2.png"),
            image_3: require("@/assets/images/Customer3.png"),
            image_4: require("@/assets/images/Customer4.png"),
            datas: [
                {
                    title: "工会总数",
                    subtitle: "43,154",
                    description: "新增工会",
                    data: "2,000",
                },
                {
                    title: "今日新增",
                    subtitle: "37,248",
                    description: "新增工会",
                    data: "25.18%",
                },
                {
                    title: "上周新增",
                    subtitle: "49,865",
                    description: "新增工会",
                    data: "2000",
                },
                {
                    title: "上月新增",
                    subtitle: "49,387",
                    description: "新增工会",
                    data: "2000",
                },
                {
                    title: "3D任务",
                    subtitle: "34,649",
                    description: "新增工会",
                    data: "3,569",
                },
                {
                    title: "2D任务",
                    subtitle: "22,083",
                    description: "新增工会",
                    data: "3,569",
                },
                {
                    title: "语音任务",
                    subtitle: "18,855",
                    description: "新增工会",
                    data: "3,569",
                },
                {
                    title: "4D任务",
                    subtitle: "22,178",
                    description: "新增工会",
                    data: "3,569",
                },
            ],
            optionsOne: getOptionsOne(),
            optionsTwo: getOptionsTwo(),
        };
    },
    mounted() { },
    methods: {},
};
</script>

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
    padding: 25px;
}

.Customer {
    height: 220px;
}

.data {
    height: 450px;
}

.container {
    display: flex;
    justify-content: space-between;
}

.CustomerBox {
    width: 23%;
    height: 107px;
    padding: 28px;
    border-radius: 4px;
    background-size: 100% 100%;
}

.content {
    float: left;
}

.title {
    margin-top: 5px;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
}

.titles {
    margin-top: 5px;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 14px;
    color: #86909c;
}

.containers {
    display: flex;
    /* flex 容器 */
    flex-wrap: wrap;
    /* 子元素自动换行 */
    justify-content: space-around;
}

.dataBox {
    margin-top: 20px;
    width: calc(23.33% - 10px);
    height: 150px;
    padding: 20px;
}

.color {
    color: #3382ff;
}

.shado {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
}

.green {
    //   color: #4880ff;
    font-size: 20px;
}

i {
    font-size: 28px;
    color: #4880ff;
}
</style>
