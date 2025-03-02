<template>
  <div class="layout-container">
    <HeaderTabtar :current="3"></HeaderTabtar>
    <div class="content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">学院</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">课程</a></el-breadcrumb-item>
        <el-breadcrumb-item>{{ fItem.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="box">
        <div class="box-top">
          <div style="float: left">
            <img src="../../assets/images/book-04.png" alt="" />
            <span>课程：{{ fItem.name }}</span>
          </div>
          <div class="course">{{ item.name }}</div>
          <el-dropdown>
            <el-button type="primary">
              {{ item.Description
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in courseData" :key="item.id" >
                <div @click="handleMenuClick(item)">
                  {{
                    item.Description
                  }}
                </div>

              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="box-center">
          <div id="pdfWrap" v-show="cur == 1"></div>
          <div class="video" v-if="cur == 0" >
            <video  v-if="this.item.videos" :src="this.item.videos" controls loop ></video>
            <div></div>
          </div>
        </div>
        <div class="box-bottom">
          <div class="bottom-left">
            <el-button @click="tab(0)" :class="{ active: cur == 0 }" type="primary" plain v-if="this.item.videos"><i
                class="el-icon-video-play"></i>视频</el-button>
            <el-button type="primary" plain @click="tab(1)" :class="{ active: cur == 1 }"><i
                class="el-icon-data-analysis"></i>课程</el-button>
            <el-button type="primary" plain><i class="el-icon-chat-line-round" ></i>问答题</el-button>
          </div>
          <div class="bottom-right">
            <el-button type="primary" plain @click="toDetail(fItem)">标注练习</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";
import { getJobContent, EditJobContent } from "@/api/project/job";
import { fCourseList } from "./data";
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";

export default {
  data() {
    return {
      cur: 0,
      item: {},
      fItem: fCourseList[0],
      courseData: [],
      activeName: "first",
      url: "http://storage.xuetangx.com/public_assets/xuetangx/PDF/.0.6.pdf",
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
      videos:'',
    };
  },
  components: {
    HeaderTabtar,
  },
  methods: {
    findCourseById(id, fid) {
      this.fItem = fCourseList.find((item) => item.id == fid);
      this.courseData = this.fItem.courses
      this.item = this.fItem.courses.find((item) => item.id == id);
      this.createPdf()
      // this.createPdf2()
      this.createVidos()
      // console.log(this.item, this.fItem);
    },
    createPdf() {
      console.log(this.item.ptdUrl);
      this.pdfh5 = new Pdfh5("#pdfWrap", {
        pdfurl: this.item.ptdUrl,
      });
    },
    async createPdf2() {
      // console.log('createPdf2', getJobContent)
      // const res = await getJobContent({ jobId: `1714539464870625280` })
    },
    createVidos() {
      // console.log(this.item.videos);
      if (!this.item.videos) {
        this.tab(1)
      }
    },
    tab(cur) {
      // console.log(cur)
      this.cur = cur;
    },
    handleMenuClick(item) {
      // console.log('2023-10-18 22:53:43 schoolVideo.vue line:111', item)
      this.item = item
      this.createPdf()
      this.createVidos()

    },
    toDetail(fItem) {
      console.log(fItem.id)
      if (fItem.id == 2) {
        this.$router.push('/marks/3D')
      }
      else if (fItem.id == 3) {
        this.$router.push('/marks/2D')
      }
      else if (fItem.id == 4) {
        this.$router.push('/marks/voice')
      }
    },

  },
  created() {

  },
  mounted() {
    this.findCourseById(this.$route.query.id, this.$route.query.fid);
    // this.createPdf();
  },
};
</script>

<style  lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: #f7f8fa;

  .content {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 120px;
    margin-top: 20px;
  }
}

#pdfWrap {
  overflow-y: auto;

}

.box {
  margin-top: 20px;
  width: 1200px;
  float: left;
  background: var(--color-text-5, #fff);
}

.box-top {
  width: 1200px;
  height: 100px;
  background: var(--color-text-5, #fff);
  padding: 30px;

  img {
    vertical-align: middle;
  }

  span {
    color: var(--color-text-2, #4e5969);
    vertical-align: middle;
    font-size: 24px;
  }

  .course {
    margin-left: 20px;
    float: left;
    border-radius: 4px 0px 0px 4px;
    background: var(--primary, #3382ff);
    width: 100px;
    height: 34px;
    color: #f7f8fa;
    padding: 8px 16px;
    font-size: 13px;
    text-align: center;
  }

  ::v-deep .el-button--primary {
    color: #ffffff;
    border-radius: 0px 4px 4px 0px;
    background: var(--color-fill-1, #f7f8fa);
    border: #f2f3f5;
    color: #4e5969;
  }

  .active {
    background: var(--primary, #3382ff);
  }
}

.box-center {
  height: 647px;
  background: var(--color-fill-2, #f2f3f5);
}

.box-bottom {
  width: 1200px;
  height: 80px;
  background: var(--color-text-5, #fff);
  padding: 20px;
  ::v-deep .el-button {
      // border-color: #1890ff;
      // color: #1890ff;
    }
    .active {
    background: var(--primary, #3382ff);
    color: #f7f8fa;
  }
  .bottom-left {
    float: left;
  }

  .bottom-right {
    float: right;
  }
}

.video {
  //   width: 846px;
  height: 700px;
  background-size: cover;
}

video {
  width: 1200px;
  height: 630px;
}
</style>
