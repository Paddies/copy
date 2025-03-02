<template>
  <div class="layout-container">
    <HeaderTabtar :current="3"></HeaderTabtar>
    <div class="banner">
      <img src="../../assets/images/Frame278.png" alt="" />
    </div>
    <div class="middle">
      <div class="container">
        <div class="top top1">
          <h2>追求知识荣耀，走向更高阶</h2>
          <small>勋章，见证您的学习之旅</small>
          <ul>
            <li>
              培训勋章
              <p>知识的荣誉象征，驱动学习前行。</p>
            </li>
            <li>
              勋章与任务关联
              <p>
                通过学习课程，获得勋章，这昭示着我们鼓励学习、进步的奖励体系。激发您的学习热情，增强前行动力
              </p>
            </li>
            <li>
              获得勋章的方式
              <p>
                完成课程所有小节，涵盖标注实战和培训材料阅读。明确获得勋章的条件，提供明晰行动指引。
              </p>
            </li>
            <li>
              勋章的点亮
              <p>
                完成所有小节，勋章将自动发放并点亮。成就感油然而生，体验完成学习任务的满足感。
              </p>
            </li>
          </ul>
        </div>
        <div class="top top2">
          <p>我最近获取的勋章<span>已获取6个勋章</span></p>
          <div class="medal">
            <div class="item" v-for="(item, index) in medalList" :key="index">
              <svg-icon :icon-class="item.medal" style="width: 64px;height: 64px;" />
              <p>{{ item.name }}</p>
              <span>{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="courseList">
        <h1>课程列表</h1>
        <div class="course" v-for="(item, index) in courseList" :key="item.id">
          <div class="course-top">
            <div class="course-1 course-left">
              <p class="CourseName">{{ item.name }}</p>
              <p>
                课程数目<span>5</span>学习人次<span>23470</span>通过人次<span>22022</span>
              </p>
              <small><img src="../../assets/images/feather1.png" alt="" />{{ item.Description }}</small>
            </div>
            <div class="course-1 course-center">
              <div class="Medalbox">
                <img :src="item.img" alt="">
                <div>
                  <span>课程已完成获得勋章</span>
                  <p>
                    {{ item.course }}
                  </p>
                  <small>2023年8月23日获得</small>
                </div>
              </div>
            </div>
            <div class="course-1 course-right">
              <el-button type="primary" @click="changeButtonStatus(index)" :icon="item.showButton ?
                'el-icon-arrow-up' : 'el-icon-arrow-down'">{{ item.showButton ? '收起' : '详情' }}</el-button>

            </div>
          </div>
          <transition name="fade">
            <div class="CourseChapter " v-if="item.showButton">
              <div class="course-bottom">

                <div class="item" v-for="coursess in item.courses" :key="coursess.id"
                  @click="toDetail(coursess.id, item.id)"><img src="../../assets/images/Group52.png" alt="">
                  <p>{{ coursess.name }}</p>
                  <span>{{ coursess.Description }}</span><img src="../../assets/images/Group54.png" alt="">
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>



    </div>
    <Footer></Footer>

  </div>
</template>

<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";
import Footer from './components/Footer.vue';
import { fCourseList } from "./data";

export default {
  components: {
    HeaderTabtar,
    Footer
  },
  data() {
    return {
      medalList: [{ name: "自然对话采集", medal: "medal1", date: "2023年9月7日" },
      { name: "新手勋章", medal: "medal2", date: "2023年9月7日" },
      { name: "语音转写", medal: "medal3", date: "2023年9月7日" },
      { name: "语义分割", medal: "medal4", date: "2023年9月7日" },
      { name: "2D人体拉框", medal: "medal5", date: "2023年9月7日" },
      { name: "3D点云", medal: "medal6", date: "2023年9月7日" },
      ],
      cur: 0,
      showButton: false,
      courseList: fCourseList,

    }
  },
  methods: {
    changeButtonStatus(i) {
      console.log(i);
      this.courseList[i].showButton = !this.courseList[i].showButton
      this.courseList = [...this.courseList]
    },
    toDetail(id, fid) {
      this.$router.push('/home/school/video?id=' + id + `&fid=${fid}`)
    },

  }
};
</script>
<style scoped lang="scss">
.layout-container {
  width: 100%;
  // height: 100vh;
  background-color: #f7f8fa;
}

.banner {
  width: 100%;
  // height: 720px;

  img {
    width: 100%;
    // height: 720px;
  }
}

.middle {
  margin: 0 auto;
  width: 1200px;
}

.container {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.top {
  padding: 24px;
  flex: 1;
  height: 618px;
  border-radius: 8px;
  background: #fff;
}

.top2 {
  flex-grow: 1;
  margin-left: 10px;

  p {
    color: #000;
    font-size: 18px;

    span {
      padding: 20px;
      color: var(--color-text-3, #86909c);
      font-size: 12px;
    }
  }
}

.top1 {
  flex-grow: 3;
  margin-right: 10px;

  h2 {
    color: var(--color-text-2, #4e5969);
    font-size: 36px;
  }

  small {
    color: var(--color-text-3, #86909c);
    font-size: 24px;
  }

  ul {
    margin-left: -20px;
    margin-top: 48px;
  }

  li {
    color: var(--color-text-1, #1d2129);
    font-family: PingFang SC;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;

    /* 160% */
    p {
      color: var(--color-text-3, #86909c);
      font-family: PingFang SC;
      font-size: 14px;
    }
  }

  li:before {
    content: "\2022";
    /* 添加小圆点 */
    color: #3382ff;
    /* 小圆点的颜色为黄色 */
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
}

.medal {
  display: flex;
  flex-wrap: wrap;


  .item {
    flex: 0 0 50%;
    /* 子项目宽度为50% */
    height: 130px;
    margin: 20px 0px;
    // padding: 0px 15px;
    text-align: center;
  }

  p {
    color: var(--color-text-1, #1D2129);
    text-align: center;

    /* 16/CN-Medium */
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    /* 150% */
    ;
  }

  span {
    color: var(--color-text-3, #86909C);
    text-align: center;

    /* 14/CN-Regular */
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
  }
}

.courseList {
  margin: 20px 0px;
  padding: 0px 15px;
  border-radius: 8px;
  background: #fff;

  h1 {
    padding-top: 20px;
    padding-left: 20px;
    color: var(--color-text-2, #4E5969);
    font-family: PingFang SC;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
    /* 125% */
  }
}

.course {
  margin: 20px 0px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.06);

}

.course-top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border-1, #F2F3F5);
}

.course-1 {
  padding: 0px 25px;
  flex: 1;

}

.course-left {
  height: 150px;
  flex-grow: 2;

  .CourseName {
    color: var(--color-text-2, #4e5969);
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
  }

  p {
    color: var(--color-text-2, #4e5969);
    font-size: 16px;
  }

  span {
    color: var(--primary, #3382ff);
    font-size: 16px;
    padding-right: 15px;
  }

  small {
    color: var(--color-text-3, #86909c);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  img {
    margin-bottom: -5px;
    width: 24px;
    height: 24px;
  }
}

.course-center {
  height: 150px;

  flex-grow: 1;

  .Medalbox {
    float: left;
    border-radius: 8px;
    background: var(--color-fill-1, #F7F8FA);
    margin: 20px 15px;
    height: 110px;
    width: 288px;
    padding: 15px 20px;
  }

  img {
    float: left;
    width: 80px;
    margin-right: 20px;
  }

  span {
    color: var(--color-text-2, #4E5969);
    font-size: 16px;
  }

  p {
    color: var(--primary, #3382FF);
    font-size: 16px;
  }

  small {
    color: var(--color-text-3, #86909C);
    font-size: 14px;
  }
}

.course-right {
  height: 150px;

  flex-grow: 1;

  .el-button--medium {
    width: 102px;
    height: 48px;
    margin: 40px 50px;
    font-size: 16px;
  }

}

.CourseChapter {
  height: 170px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.course-bottom {
  margin: 10px 10px;
  border-radius: 8px;
  background: var(--color-fill-1, #F7F8FA);
  height: 130px;
  display: flex;
  flex-wrap: wrap;
  padding: 0px 10px;

  .item {
    flex: 0 0 33%;
    /* 子项目宽度为50% */
    height: 40px;
    position: relative;
    cursor: pointer;
    margin-top: 20px;
  }

  p {
    position: absolute;
    bottom: 2px;
    left: 20px;
    color: #F2F3F5;
  }

  span {
    color: var(--color-text-2, #4E5969);
    font-size: 16px;
    margin: 0px 5px;
    text-align: center;
    height: 40px;
    vertical-align: middle;
  }

  span:hover {
    color: #3382FF;
  }

  img {
    vertical-align: middle;
  }

}</style>
