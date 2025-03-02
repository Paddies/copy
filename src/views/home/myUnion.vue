<template>
  <div class="layout-container">
    <HeaderTabtar :current="2"></HeaderTabtar>
    <div class="content">
      <div class="main-top">
        <div class="top-content">
          <div class="top-img">
            <img src="../../assets/images/Frame405.png" alt="" />
          </div>
          <div class="top-primary">
            <div class="sec_cont box">
              <div class="sec_cont_t">
                <div class="sec_l">
                  <div class="tit">帷幄科技公会 <span class="info">公会创建时间2023.8.23</span></div>

                </div>
                <div class="sec_r">
                  <el-button type="primary" @click="toManage()">工会管理</el-button>
                </div>
              </div>
              <div class="sec_cont_b">
                <el-row :gutter="20">
                  <el-col :span="7">
                    <div class="grid-content">
                      <span>公会人数</span>
                      <span>327</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <span>所在地区</span>
                      <span>湖南长沙</span>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div class="grid-content">
                      <span>业务类型</span>
                      <span>3D点云</span>
                    </div>
                  </el-col>

                </el-row>
                <el-row :gutter="20" style="margin-top: 16px">
                  <el-col :span="7">
                    <div class="grid-content">
                      <span>对接人员</span>
                      <span>吴健</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <span>联系电话</span>
                      <span>8808128</span>
                    </div>
                  </el-col>

                </el-row>

              </div>
            </div>
          </div>
        </div>
        <div class="top-text">
          <p>
            公会介绍：快速结算，轻松提现，低门槛体验收入乐趣！努力付出，即刻获得回报。您在这里投入的每一份心血都将有对应的收益回馈。我们专注于数据采集及标注众包任务，需要一定的计算机或手机操作技能。如果您拥有闲暇时间，并且具备这些技能，帷幄科技为您提供了赚取额外收入的机会。适合有空闲时间和技能的个人，帷幄科技致力于让您的时间变得更有价值。加入我们，将您的闲暇时间转化为收益，开启全新的赚钱方式！
          </p>
        </div>
      </div>
      <div class="main-center">
        <div class="section-shop gray-card">
          <span>工会任务列表</span>
          <div class="content_wrap">
            <div class="content_aboutus">
              <div class="cardList">
                <div class="card_wrap" v-for="(item, index) in cardList" :key="index">
                  <div class="card">
                    <!-- <el-image fit="cover"></el-image> -->
                    <div class="image-container">
                      <img :src="card1">
                    </div>
                    <div class="name">{{ item.name }}</div>
                    <div class="card_info">
                      <img src="@/assets/icons/home/icon.png" class="icon">
                      任务数：{{ item.num }}
                    </div>
                    <el-button type="primary" class="btn" @click="gotTaskDetails(item.id)">任务详情</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list gray-card">
          <div class="list-title">
            <span>工会会员</span>
            <el-button type="default" plain style="float: right;">入会申请</el-button>
          </div>
          <div class="container">
            <div class="box" v-for="item in uniosList" :key="item.id">
              <div class="icon"><img :src="item.imgUrl" alt=""></div>
              <div class="text-container">
                <span class="text">{{ item.name }}</span>
                <small class="text">{{ item.Description }}</small>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
    <FooterVue />
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import FooterVue from './components/Footer.vue';
import HeaderTabtar from "./components/HeaderTabtar.vue";
import { CardList } from "./data";

// import Footer from './components/Footer.vue';
export default {
  components: {
    HeaderTabtar,
    FooterVue
  },
  data() {
    return {
      cardList: CardList,
      card1: require('@/assets/images/11.png'),
      card2: require('@/assets/images/12.png'),
      card3: require('@/assets/images/13.png'),
      uniosList: [{
        id: 1,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'

      },
      {
        id: 2,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'

      },
      {
        id: 3,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'

      },
      {
        id: 4,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'
      },
      {
        id: 5,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'

      },
      {
        id: 6,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'
      },
      {
        id: 7,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'
      },
      {
        id: 8,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'

      },
      {
        id: 9,
        imgUrl: require('@/assets/images/Frame3.png'),
        name: '工会名称',
        Description: '获得徽章“对话采集”'
      }]
    }
  },
  methods: {
    gotTaskDetails(id) {
      console.log(id)
      this.$router.push('/home/task/detail?id=' + id)
    },
    toManage() {
      this.$router.push('/home/union/myUnion/Unionmanagement')
    },
  },




}
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
    height: 1800px;
  }

  .main-top {
    width: 1200px;
    height: 430px;
    border-radius: 8px;
    background: var(--color-text-5, #FFF);
    padding-top: 15px;
    padding: 20px 20px;

    .top-content {
      height: 250px;
      border-bottom: 1px solid var(--color-border-1, #F2F3F5);
    }

    p {
      color: var(--color-text-3, #86909C);
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 28px;
      /* 175% */
    }
  }


  .top-img {
    float: left;
    width: 220px;
    height: 220px;
    padding: 20px;

    img {
      width: 180px;
      height: 180px;
    }
  }

  .top-primary {
    float: left;
    width: 935px;
  }

  .box {
    box-sizing: border-box;
    padding: 26px;
    border-radius: 8px;
    background: var(--color-text-5, #fff);
  }

  .sec_cont {

    .sec_cont_t {
      height: 88px;
    }

    .sec_l {
      float: left;

      .tit {
        color: #000;
        font-family: PingFang SC;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 44px;
      }

      .info {
        color: var(--primary, #3382FF);
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        border-radius: 20px;
        background: rgba(51, 130, 255, 0.12);
        padding: 8px 24px;
        vertical-align: middle;
      }
    }

    .sec_r {
      float: right;
      margin-top: 70px;
    }

    .sec_cont_b {
      width: 490px;
      box-sizing: border-box;
      padding: 10px;
      border-radius: 8px;
      background: var(--color-fill-1, #F7F8FA);

      .grid-content {
        span {
          font-size: 16px;
          color: #86909c;
        }

        span:last-child {
          margin-left: 5px;
          color: #1d2129;
        }
      }
    }
  }

  .top-text {
    width: 1125px;
    padding: 20px 50px;
  }
}

.main-center {
  margin-top: 20px;
  width: 1200px;
  min-height: 1000px;
  display: flex;


}

.section-list {
  width: 282px;
  min-height: 700px;

  .list-title {
    width: 100%;
    height: 50px;

    span {
      color: #000;
      font-family: PingFang SC;
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 44px;
      /* 183.333% */
    }

    ::v-deep .el-button {
      border-color: #1890ff;
      color: #1890ff;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .box {
    display: flex;
    width: 244px;
    height: 64px;
    // border: 1px solid black;
    align-items: center;
    margin-top: 30px;
  }

  .text-container {
    display: flex;
    flex-direction: column;

    span {
      color: #000;
      font-family: PingFang SC;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
    }

    small {
      color: var(--color-text-3, #86909C);
      font-family: PingFang SC;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px;
    }
  }


  .icon {
    width: 64px;
    height: 64px;
    margin-right: 8px;
  }

  img {
    width: 64px;
    height: 64px;
  }
}

.section-shop {
  width: calc(100% - 282px);
  margin-right: 24px;

  span {
    color: #000;
    font-family: PingFang SC;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 44px;
    /* 183.333% */
  }
}

.gray-card {
  border-radius: 8px;
  background: #FFF;
  padding: 20px;
}

.content_wrap {
  background-color: #f7f8fa;
}

.content_aboutus {
  background-color: #fff;
  box-sizing: border-box;
  // padding: 0 24px;


  .cardList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .card_wrap {
      margin-left: 25px;
    }

    .card_wrap:nth-child(3n+1) {
      margin-left: 0;
    }

    .card {
      width: 218px;
      height: 386px;
      margin: 24px;
      box-sizing: border-box;
      padding: 24px;
    }

    .image-container {
      width: 218px;
      height: 218px;
      overflow: hidden;

      img {
        width: 218px;
        height: 218px;
        transition: transform 0.3s ease-in-out;
        /* 缩放过渡效果 */
      }

      img:hover {
        transform: scale(1.2);
        /* 放大效果 */
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
}</style>
