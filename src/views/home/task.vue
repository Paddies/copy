<template>
  <div class="layout-container">
    <HeaderTabtar :current="1"></HeaderTabtar>
    <div class="banner">
      <el-carousel trigger="click" :height="bannerHeight + 'px'">
        <el-carousel-item v-for="(item, index) in carousels" :key="index">
          <div class="carousel">
            <img ref="bannerImg" :src="item.bg" @load="imgLoad">
            <div class="banner_content">
              <div class="banner_content_title">{{ item.title }}</div>
              <div class="banner_content_text">{{ item.text }}</div>
              <div class="banner_content_bts">
                <el-button type="primary" round>加入我们</el-button>
                <el-button type="primary" plain round >了解详情</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="tabwrap">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="height: 55px;">
          <el-tab-pane label="全部" name="1"></el-tab-pane>
          <el-tab-pane label="3D点云拉宽" name="2"></el-tab-pane>
          <el-tab-pane label="2D点人像拉框" name="3"></el-tab-pane>
          <el-tab-pane label="语音" name="4"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="content_wrap">
      <div class="content_aboutus">
        <div class="cardList">
          <div class="card_wrap" v-for="(item, index) in cardList" :key="index">
            <div class="card">
              <!-- <el-image fit="cover"></el-image> -->
              <div class="image-container">
                <img  :src="card1" >
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="card_info">
                <img src="@/assets/icons/home/icon.png" class="icon">
                任务数：{{ item.num }}
              </div>
              <el-button type="primary" class="btn" @click="gotDetailsPage(item)">领取任务</el-button>
              <el-button type="primary" class="btn" @click="gotTaskDetails(item.id)">任务详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import HeaderTabtar from './components/HeaderTabtar.vue'
import Footer from './components/Footer.vue'
import { CardList } from "./data";
export default {
  data() {
    return {
      card1: require('@/assets/images/11.png'),
      card2: require('@/assets/images/12.png'),
      card3: require('@/assets/images/13.png'),
      activeName: '1',
      carousels: [
        {
          bg: require('@/assets/images/banner_01.png'),
          title: '轻松接单 创收无限',
          text: '您的时间，您的选择。我们的数据标注平台欢迎个人与企业工会，轻松接单，创造您的无限收益。'
        },
        {
          bg: require('@/assets/images/banner_02.png'),
          title: '赚钱新方式，自主接单赚取收益',
          text: '与我们合作，您可以通过自主接单赚取收益。体验赚钱的全新方式，尽在我们的数据标注平台'
        },
        {
          bg: require('@/assets/images/banner_03.png'),
          title: '拓展收入机会，随时接单',
          text: '无论您是个人还是工会，我们的平台都为您提供了拓展收入机会的机会。随时随地接单，开启您的赚钱之旅'
        }
      ],
      bannerHeight: 0,
      cardList:CardList
      
    }
  },
  components: {
    HeaderTabtar,
    Footer
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.imgLoad();
    }, false);
  },
  methods: {
    imgLoad() {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerImg[0]?.height
      })
    },
    handleClick() {

    },
    toOurs() {
      this.$router.push('/marks/voice')
    },
    toDetail() {
      this.$router.push('/home/task/detail')
    },
    gotDetailsPage(item) {
      // console.log(item)
      this.$router.push(item.path)
    },
    gotTaskDetails(id){
      console.log(id)
      this.$router.push('/home/task/detail?id=' + id)
    }

  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__nav-wrap::after {
  background-color: #fff !important;
}

.layout-container {
  width: 100%;
  height: 100vh;
  background-color: lightblue;
}

.banner {
  position: relative;

  .carousel {
    display: block;
    width: 100vw;
    position: relative;

    >img {
      width: 100%;
    }

    .banner_content {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1200px;
      transform: translateX(-50%) translateY(calc(-50% - 40px));
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;

      .banner_content_title {
        color: var(--color-text-1, #1D2129);
        font-size: 56px;
        font-style: normal;
        font-weight: 400;
        line-height: 64px;
        /* 114.286% */
      }

      .banner_content_text {
        width: 467px;
        color: var(--color-text-2, #4E5969);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px;
        /* 160% */
      }

      .banner_content_bts {
        padding-top: 16px;
      }
    }
  }

  .tabwrap {
    width: 1200px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: calc((100% - 1200px) / 2);
    background-color: #FFF;
    z-index: 2;
    border-radius: 8px 8px 0 0;
    height: 80px;
    box-sizing: border-box;
    padding: 24px 48px;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
  }
}


.content_wrap {
  background-color: #f7f8fa;
  padding-bottom: 144px;
}

.content_aboutus {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  z-index: 2;
  // border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 0 24px;


  .cardList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .card_wrap {
      margin-left: 24px;
    }

    .card_wrap:nth-child(3n+1) {
      margin-left: 0;
    }

    .card {
      width: 368px;
      height: 496px;
      // margin: 24px;
      box-sizing: border-box;
      padding: 24px;
    }
    .image-container {
  width: 320px; 
  height: 280px; 
  overflow: hidden; 
  img {
    width: 320px; 
  height: 280px; 
  transition: transform 0.3s ease-in-out; /* 缩放过渡效果 */
}

img:hover {
  transform: scale(1.2); /* 放大效果 */
}
}




    .name {
      font-size: 24px;
      color: #4E5969;
      font-weight: 400;
      margin-top: 24px;
    }

    .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }


    .card_img {
      width: 320px;
      height: 280px;
      overflow: hidden;

    }


    .card_info {
      display: flex;
      align-items: center;
      color: #86909C;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      margin-top: 10px;
    }

    .btn {
      width: 144px;
      height: 52px;
      // padding: 6px 13px;
      font-size: 20px;
      margin-top: 24px;
    }
  }
}
</style>