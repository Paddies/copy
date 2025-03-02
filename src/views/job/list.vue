<template>
  <div class="layout-container common-buttom
">
    <div class="header">
      <div class="header-container">
        <svg-icon icon-class="logo" class="logo"></svg-icon>
        <div class="menus">
          <div></div>
          <div>首页</div>
          <div>任务</div>
          <div>工会</div>
          <div>学院</div>
          <div>帮助</div>
          <div></div>
        </div>
        <div class="login_1">
          <p>欢迎，请<a>登录</a></p>
          <el-button type="primary" round>立即注册</el-button>
        </div>
      </div>
    </div>
    <div class="banner">
      <el-carousel trigger="click" :height="bannerHeight + 'px'">
        <el-carousel-item v-for="(item, index) in carousels" :key="index">
          <div class="carousel">
            <img ref="bannerImg" :src="item.bg" @load="imgLoad">
            <div class="banner_content">
              <div class="banner_content_title">{{ item.title }}</div>
              <div class="banner_content_text">{{ item.text }}</div>
              <div class="banner_content_bts">
                <el-button type="primary" round>联系我们</el-button>
                <el-button type="primary" plain round>了解详情</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="content_aboutus" :style="{'background-image': `url(${image_2})`}">
      <div class="top_gap">
        <div class="header_div" style="padding: 0px 48px;">全部</div><div class="header_div">3D点云拉宽</div><div class="header_div">2D点人像拉框</div><div class="header_div">语音</div>
      </div>
      <div class="aboutus">
        <el-row style="width: 100%">
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511274484568064" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">3D点云拉框</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511243706765312" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">2D点云拉框</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px'  }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511298127859712" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">长沙话转写</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row style="width: 100%">
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511274484568064" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">3D点云拉框</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511243706765312" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">2D点云拉框</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col class="card-box" :span="8">
            <el-card :body-style="{ padding: '0px'  }">
              <img src="http://localhost:9080/dev-api/tools/downFile?fileId=1702511298127859712" class="image">
              <div style="padding: 14px;">
                <el-row calss="box-text">长沙话转写</el-row>
                <el-row >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke="#86909C" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      </span>
                  <span class="box-job">
                      任务数：2334
                    </span>
                </el-row>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="primary" class="button">领取任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="footer">
      <div class="footer_content">
        <svg-icon icon-class="logo_reverse" class="logo_reverse"></svg-icon>
        <span class="footer_text">Copyright © www.weiwo.com, All Rights Reserved.</span>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/scss/commonButtom.scss"; //  css

export default {
  data() {
    return {
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
      image_2: require('@/assets/images/image_2.png'),
      bg_institude: require('@/assets/images/bg_institude.png'),
      bg_skill: require('@/assets/images/bg_skill.png'),
      bannerHeight: 0,
      svgs: [
        {name: 'jdpx', className: 'jdpx', text: '简单培训'},
        {name: 'polygon_1', className: 'polygon_5'},
        {name: 'lqrw', className: 'lqrw', text: '领取任务'},
        {name: 'polygon_2', className: 'polygon_5'},
        {name: 'rwzx', className: 'rwzx', text: '任务执行'},
        {name: 'polygon_3', className: 'polygon_5'},
        {name: 'htsh', className: 'htsh', text: '后台审核'},
        {name: 'polygon_4', className: 'polygon_5'},
        {name: 'tgjs', className: 'tgjs', text: '通过结算'},
        {name: 'polygon_5', className: 'polygon_5'},
        {name: 'jetx', className: 'jetx', text: '金额提现'},
        {name: 'polygon_6', className: 'polygon_5'}
      ],
      tasks: [
        {name: 'task_01', title: '做选择题', content: '做选择题目'},
        {name: 'task_02', title: '人体图像抠图', content: '人体图像抠图'},
        {name: 'task_03', title: '车辆属性标注', content: '车辆属性标注'},
        {name: 'task_04', title: '家庭命令词录制', content: '家庭命令词录制'},
        {name: 'task_05', title: '手机录制方言', content: '手机录制方言'},
        {name: 'task_06', title: '手机发票拍摄', content: '手机发票拍摄'}
      ],
      consortias: [
        {name: 'consortia_01', title: '高收益任务', content: '高收益任务，独家供公会成员，增加收入机会'},
        {name: 'consortia_02', title: '任务收入加成', content: '任务收入加成，1%~25%提升，合作获更多收益'},
        {name: 'consortia_03', title: '定期公会津贴', content: '定期公会津贴，奖励优秀公会与成员，期待额外惊喜'},
        {name: 'consortia_04', title: '公会成长体系', content: '公会评价成长体系，激励高质任务合作，脱颖而出'}
      ],
      skills: [
        {name: 'skill_01', title: '培训', content: '10000+'},
        {name: 'skill_02', title: '视频', content: '100+'},
        {name: 'skill_03', title: '文档', content: '1000+'},
        {name: 'skill_04', title: '资料', content: '800+'},
      ]
    }
  },
  mounted() {
    window.addEventListener("resize",() => {
      this.imgLoad();
    },false);
  },
  methods: {
    imgLoad() {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerImg[0]?.height
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: lightblue;
}
.box-job{
  color: var(--color-text-3, #86909C);
  vertical-align: text-bottom;
  /* 20/CN-Medium */
  font-family: PingFang SC;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 140% */
}
.box-text{
  color: var(--color-text-2, #4E5969);
  font-family: PingFang SC;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 133.333% */
}
.header_div{
  display: inline-block;
  padding: 24px;
  justify-content: center;
  align-items: center;
  color: var(--color-text-2, #4E5969);
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 133.333% */

  //border-bottom: 2px solid var(--primary, #3382FF);
}
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #FFF;
  .header-container {
    display: flex;
    align-items: center;
    width: 1200px;
    .logo {
      width: 160px;
      height: 36px;
    }
    .menus {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      > div {
        font-size: 20px;
        line-height: 28px;
        flex: 1;
        text-align: center;
        padding: 26px 0;
      }
    }
    .login_1 {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
}
.banner {
  .carousel {
    display: block;
    width: 100vw;
    position: relative;
    > img {
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
        line-height: 64px; /* 114.286% */
      }
      .banner_content_text {
        width: 467px;
        color: var(--color-text-2, #4E5969);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px; /* 160% */
      }
      .banner_content_bts {
        padding-top: 16px;
      }
    }
  }
}
.content_aboutus {
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  padding-bottom: 200px;
  .top_gap {
    width: 1200px;
    height: 80px;
    position: absolute;
    text-align: left;
    top: -80px;
    left: calc((100% - 1200px) / 2);
    background-color: #FFF;
    z-index: 2;
    border-radius: 8px 8px 0 0;
  }
  .aboutus {
    display: flex;
    width: 1200px;
    padding: 0 80px 80px 80px;
    flex-direction: column;
    align-items: flex-start;
    gap: 56px;
    border-radius: 8px;
    background: var(--color-text-5, #FFF);
    margin: 0 auto;
    .icon_aboutus {
      width: 240px;
      height: 40px;
    }
    .aboutus_title {
      color: var(--color-text-2, #4E5969);
      font-size: 36px;
      font-style: normal;
      font-weight: 400;
      line-height: 44px; /* 122.222% */
    }
    .rect {
      width: 56px;
      height: 4px;
      background-color: #4E5969;
    }
    .aboutus_text {
      color: var(--color-text-3, #86909C);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px; /* 200% */
    }
  }
  .flow {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    .flow_unit {
      display: flex;
      padding: 24px 0px;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      .flow_icon {
        width: 80px;
        height: 80px;
      }
      .flow_icon.polygon_5 {
        width: 24px;
        height: 20px;
      }
      .flow_text {
        color: var(--color-text-3, #86909C);
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
    }
  }
}
.content_task {
  .content_task_main {
    display: flex;
    width: 1200px;
    padding: 200px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 64px;
    margin: 0 auto;
    .content_task_main_header {
      width: 100%;
      display: flex;
      align-items: flex-end;
      > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        flex: 1 0 0;
        .content_task_main_title {
          color: var(--color-text-1, #1D2129);
          font-size: 48px;
          font-style: normal;
          font-weight: 400;
          line-height: 56px; /* 116.667% */
        }
        .content_task_main_text {
          color: var(--color-text-3, #86909C);
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px; /* 160% */
          text-transform: uppercase;
        }
      }
    }
    .content_task_block {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      > div {
        width: 384px;
        padding: 56px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 36px;
        .task_icon {
          width: 184px;
          height: 184px;
        }
        .task_title {
          color: var(--color-text-1, #1D2129);
          font-size: 36px;
          font-style: normal;
          font-weight: 400;
          line-height: 44px; /* 122.222% */
        }
        .task_content {
          color: var(--color-text-2, #4E5969);
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 140% */
        }
      }
    }
  }
}
.content_consortia {
  width: 100%;
  position: relative;
  .consortia_back_top {
    width: 100%;
    padding-top: 552px;
    background-color: #3382FF;
  }
  .consortia_back_bottom {
    width: 100%;
    padding-top: 378px;
    background-color:  #F7F8FA;
  }
  .content_consortia_main {
    display: flex;
    width: 1200px;
    flex-direction: column;
    align-items: flex-start;
    gap: 48px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    .content_consortia_main_header {
      width: 100%;
      display: flex;
      align-items: flex-end;
      > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        flex: 1 0 0;
        .content_consortia_main_title {
          color: var(--color-text-5, #FFF);
          font-size: 48px;
          font-style: normal;
          font-weight: 400;
          line-height: 56px; /* 116.667% */
        }
        .content_consortia_main_text {
          color: var(--color-text-5, #FFF);
          font-family: DINPro;
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 56px; /* 116.667% */
          text-transform: uppercase;
        }
      }
    }
    .content_consortia_block {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      > div {
        display: flex;
        padding: 48px 40px;
        flex-direction: column;
        align-items: flex-start;
        gap: 32px;
        flex: 1 0 0;
        border-radius: 8px;
        background: var(--color-text-5, #FFF);
        .consortia_icon {
          width: 128px;
          height: 128px;
        }
        .consortia_title {
          color: var(--color-text-2, #4E5969);
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px; /* 133.333% */
        }
        .consortia_content {
          color: var(--color-text-3, #86909C);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 175% */
        }
      }
    }
  }
}
.content_institude {
  padding: 200px 0;
  background-size: 100%;
  background-repeat: no-repeat;
  .content_institude_wrap {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    .content_institude_left {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      .content_institude_left_title {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        color: var(--color-text-2, #4E5969);
        font-size: 56px;
        font-style: normal;
        font-weight: 400;
        line-height: 88px; /* 157.143% */
        .institude_dot {
          color: var(--primary, #3382FF);
          font-size: 80px;
          font-style: normal;
          font-weight: 700;
          line-height: 88px; /* 110% */
        }
      }
      .content_institude_left_text {
        color: var(--color-text-2, #4E5969);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px; /* 140% */
      }
    }
    .content_institude_right {
      width: 656px;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      .content_institude_right_wrap {
        display: flex;
        flex-direction: column;
        background: var(--color-text-5, #FFF);
        gap: 0;
        border-radius: 8px 48px;
        .content_institude_right_text1 {
          width: 100%;
          color: var(--color-text-5, #FFF);
          font-weight: 400;
          line-height: 32px; /* 133.333% */
          border-radius: 8px 48px 0px 48px;
          background: var(--primary, #3382FF);
          display: inline-flex;
          padding: 48px;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          > div:nth-child(1) {
            font-size: 24px;
          }
          > div:nth-child(2) {
            font-size: 16px;
          }
        }
        .content_institude_right_text2 {
          width: 100%;
          color: var(--color-text-5, #4E5969);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px; /* 133.333% */
          padding: 48px;
        }
      }
    }
  }
}
.content_skill {
  padding: 200px 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
  .content_skill_wrap {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 120px;
    .content_skill_title {
      width: 100%;
      height: 72px;
      position: relative;
      div:nth-child(1) {
        width: 100%;
        font-size: 36px;
        font-style: normal;
        font-weight: 700;
        line-height: 56px; /* 155.556% */
        text-transform: uppercase;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(69, 140, 254, 0.00) 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: absolute;
        top: 0;
        text-align: center;
      }
      div:nth-child(2) {
        width: 100%;
        position: absolute;
        bottom: 0;
        color: var(--color-text-5, #FFF);
        text-align: center;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 44px; /* 122.222% */
        text-align: center;
      }
    }
    .content_skill_types {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content_skill_type {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        .svg_icon {
          width: 112px;
          height: 112px;
        }
        .title {
          color: var(--color-text-5, #FFF);
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 140% */
        }
        .count {
          color: var(--color-text-5, #FFF);
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px; /* 50% */
        }
      }
    }
  }
}
.footer {
  // display: flex;
  background-color: #1D2129;
  padding: 40px 0;
  .footer_content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .logo_reverse {
      width: 160px;
      height: 36px;
    }
    .footer_text {
      color: var(--color-text-5, #FFF);
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 28px; /* 140% */
    }
  }
}
</style>
