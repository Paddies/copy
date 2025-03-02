<template>
  <div class="layout-container">
    <HeaderTabtar :current="1"></HeaderTabtar>
    <div class="content">
      <div class="section">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">任务</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">{{ Item.name }}</a></el-breadcrumb-item>
          <el-breadcrumb-item>{{ Item.name }}招募</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="sec_cont box">
          <div class="sec_cont_t">
            <div class="sec_l">
              <div class="tit">{{ Item.name }}项目招募</div>
              <div class="info">需要有{{ Item.name }}经验优先</div>
            </div>
            <div class="sec_r">
              <el-button type="primary" @click="gotDePage()">立即报名</el-button>
            </div>
          </div>
          <div class="sec_cont_b">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content">
                  <span>报名截止日期</span>
                  <span>2023-09-15</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <span>剩余名额/总名额</span>
                  <span>27/30</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <span>任务数量</span>
                  <span>10000.00(张)</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <span>任务工期</span>
                  <span>2023-08-23至08-30</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 16px">
              <el-col :span="6">
                <div class="grid-content">
                  <span>任务项目经理</span>
                  <span>汤亮</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <span>联系方式</span>
                  <span>13566668888</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
       <TaskDetailOne v-if="Item.id==4"></TaskDetailOne>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";
import Footer from "./components/Footer.vue";
import { CardList } from "./data";
import TaskDetailOne from "./components/TaskDetailOne.vue";
import VueScrollTo from 'vue-scrollto'
export default {
  components: {
    HeaderTabtar,
    Footer,
    TaskDetailOne,
  },
  data() {
    return {
      src: require("@/assets/home/task.png"),
      item: {},
      Item: CardList[0],
      tabList: [{
          id: 1, name: '任务说明', href: "#section1"
        }, {
          id: 2, name: '任务要求', href: "#section2"
        }, {
          id: 3, name: '结算标准', href: "#section3"
        },],
      selectedIndex: 0
    };
  },
  methods: {
    findCourseById(id) {
      this.Item = CardList.find((item) => item.id == id);
      // console.log(this.item,this.Item)
    },
    gotDePage(Item) {
      // console.log("11111" + this.Item.path)
      this.$router.push(this.Item.path)
    },
    scrollToSection() {
      VueScrollTo.scrollTo('#section1', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
      VueScrollTo.scrollTo('#section2', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
      VueScrollTo.scrollTo('#section3', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
    },
    selectItem(index) {
      this.selectedIndex = index; // 更新选中的索引
    }
  },
  mounted() {
    this.findCourseById(this.$route.query.id);
  },
};
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  // height: 100vh;
  background-color: #f7f8fa;

  .content {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 120px;
    margin-top: 20px;
    // height: 1800px;

    .box {
      box-sizing: border-box;
      padding: 48px;
      border-radius: 8px;
      background: var(--color-text-5, #fff);
    }

    .sec_cont {
      margin-top: 16px;
      margin-bottom: 24px;

      .sec_cont_t {
        height: 88px;
      }

      .sec_l {
        float: left;

        .tit {
          font-size: 36px;
          color: #4e5969;
        }

        .info {
          font-size: 20px;
          color: #4e5969;
          margin-top: 16px;
        }
      }

      .sec_r {
        float: right;
        margin-top: 30px;
      }

      .sec_cont_b {
        box-sizing: border-box;
        padding: 24px;
        margin-top: 24px;
        background-color: #f7f8fa;

        .grid-content {
          span {
            font-size: 16px;
            color: #86909c;
          }

          span:last-child {
            margin-left: 20px;
            color: #1d2129;
          }
        }
      }
    }
  }
}</style>