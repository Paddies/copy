<template>
  <div class="layout-container">
    <HeaderTabtar :current="0"></HeaderTabtar>
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
    <div class="content_aboutus" :style="{ 'background-image': `url(${image_2})` }">
      <div class="top_gap"></div>
      <div class="aboutus">
        <svg-icon icon-class="Union" class="icon_aboutus"></svg-icon>
        <div class="aboutus_title">在帷幄科技，您的碎片时间也能变现</div>
        <div class="rect"></div>
        <div class="aboutus_text">
          快速结算，轻松提现，低门槛体验收入乐趣！努力付出，即刻获得回报。您在这里投入的每一份心血都将有对应的收益回馈。我们专注于数据采集及标注众包任务，需要一定的计算机或手机操作技能。如果您拥有闲暇时间，并且具备这些技能，帷幄科技为您提供了赚取额外收入的机会。适合有空闲时间和技能的个人，帷幄科技致力于让您的时间变得更有价值。加入我们，将您的闲暇时间转化为收益，开启全新的赚钱方式！
        </div>
        <div class="flow">
          <div v-for="svg in svgs" :key="svg.name" class="flow_unit">
            <svg-icon :icon-class="svg.className" class="flow_icon"
              :class="svg.className === 'polygon_5' ? 'polygon_5' : ''"></svg-icon>
            <span v-if="svg.text" class="flow_text">{{ svg.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_task">
      <div class="content_task_main">
        <div class="content_task_main_header">
          <div>
            <div class="content_task_main_title">多样任务，尽在帷幄科技</div>
            <div class="content_task_main_text">持续参与，持续收益；图片采集精细标注，多种选择；发现兴趣，赚取回报</div>
          </div>
          <el-button type="default" round @click="toTask">
            <span>任务大厅</span>
            <i class="el-icon-right" style="transform: translateX(5px)" />
          </el-button>
        </div>
        <div class="content_task_block">
          <div v-for="task in tasks" :key="task.name">
            <svg-icon :icon-class="task.name" class="task_icon"></svg-icon>
            <span class="task_title">{{ task.title }}</span>
            <span class="task_content">{{ task.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_consortia">
      <div class="consortia_back_top"></div>
      <div class="consortia_back_bottom"></div>
      <div class="content_consortia_main">
        <div class="content_consortia_main_header">
          <div>
            <div class="content_consortia_main_title">共创公会，享受福利与乐趣</div>
            <div class="content_consortia_main_text">Co-Creation Guild</div>
          </div>
          <el-button type="default" round @click="toUnion">
            <span>了解工会</span>
            <i class="el-icon-right" style="transform: translateX(5px)" />
          </el-button>
        </div>
        <div class="content_consortia_block">
          <div v-for="consortia in consortias" :key="consortia.name">
            <svg-icon :icon-class="consortia.name" class="consortia_icon"></svg-icon>
            <span class="consortia_title">{{ consortia.title }}</span>
            <span class="consortia_content">{{ consortia.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_institude" :style="{ 'background-image': `url(${bg_institude})` }">
      <div class="content_institude_wrap">
        <div class="content_institude_left">
          <div class="content_institude_left_title">
            <span>领袖之选</span>
            <svg-icon icon-class="institude_dot" class="institude_dot"></svg-icon>
          </div>
          <div class="content_institude_left_title">
            引领成功路
          </div>
          <div class="content_institude_left_text">
            10000+培训见证丰富大数据经验
          </div>
        </div>
        <div class="content_institude_right">
          <div class="content_institude_right_wrap">
            <div class="content_institude_right_text1">
              <div>欢迎来到我们的培训学院，为您提供全面的培训支持</div>
              <div>从零开始，快速掌握各种任务所需的技能，助您更轻松完成任务；我们关注您的能力提升，为您创造更多成功机会。更强的技能，更高的信心，更满意的体验！</div>
            </div>
            <div class="content_institude_right_text2">
              <span>帷幄科技凭借卓越的实力，稳坐行业领导地位，彰显非凡专业智慧。我们的经验和知识能引导您踏上成功之路。累计培训超过10000人次，突显丰富大数据行业经验，展现我们对教育和知识传承的高度重视。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_skill" :style="{ 'background-image': `url(${bg_skill})` }">
      <div class="content_skill_wrap">
        <div class="content_skill_title">
          <div>INDUSTRYWISDOM</div>
          <div>深耕行业智慧，协助您精通任务技能</div>
        </div>
        <div class="content_skill_types">
          <div class="content_skill_type" v-for="skill in skills" :key="skill.name">
            <svg-icon :icon-class="skill.name" class="svg_icon"></svg-icon>
            <div class="title">{{ skill.title }}</div>
            <div class="count">{{ skill.content }}</div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <RightTools></RightTools>
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import HeaderTabtar from './components/HeaderTabtar.vue';
import RightTools from './components/RightTools.vue';
export default {
  data () {
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
        { name: 'jdpx', className: 'jdpx', text: '简单培训' },
        { name: 'polygon_1', className: 'polygon_5' },
        { name: 'lqrw', className: 'lqrw', text: '领取任务' },
        { name: 'polygon_2', className: 'polygon_5' },
        { name: 'rwzx', className: 'rwzx', text: '任务执行' },
        { name: 'polygon_3', className: 'polygon_5' },
        { name: 'htsh', className: 'htsh', text: '后台审核' },
        { name: 'polygon_4', className: 'polygon_5' },
        { name: 'tgjs', className: 'tgjs', text: '通过结算' },
        { name: 'polygon_5', className: 'polygon_5' },
        { name: 'jetx', className: 'jetx', text: '金额提现' },
        { name: 'polygon_6', className: 'polygon_5' }
      ],
      tasks: [
        { name: 'task_01', title: '做选择题', content: '做选择题目' },
        { name: 'task_02', title: '人体图像抠图', content: '人体图像抠图' },
        { name: 'task_03', title: '车辆属性标注', content: '车辆属性标注' },
        { name: 'task_04', title: '家庭命令词录制', content: '家庭命令词录制' },
        { name: 'task_05', title: '手机录制方言', content: '手机录制方言' },
        { name: 'task_06', title: '手机发票拍摄', content: '手机发票拍摄' }
      ],
      consortias: [
        { name: 'consortia_01', title: '高收益任务', content: '高收益任务，独家供公会成员，增加收入机会' },
        { name: 'consortia_02', title: '任务收入加成', content: '任务收入加成，1%~25%提升，合作获更多收益' },
        { name: 'consortia_03', title: '定期公会津贴', content: '定期公会津贴，奖励优秀公会与成员，期待额外惊喜' },
        { name: 'consortia_04', title: '公会成长体系', content: '公会评价成长体系，激励高质任务合作，脱颖而出' }
      ],
      skills: [
        { name: 'skill_01', title: '培训', content: '10000+' },
        { name: 'skill_02', title: '视频', content: '100+' },
        { name: 'skill_03', title: '文档', content: '1000+' },
        { name: 'skill_04', title: '资料', content: '800+' },
      ]
    }
  },
  components: {
    HeaderTabtar,
    RightTools,
    Footer
  },
  mounted () {
    window.addEventListener("resize", () => {
      this.imgLoad();
    }, false);
  },
  methods: {
    imgLoad () {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerImg[0]?.height
      })
    },
    toTask () {
      this.$router.push('/home/task')
    },
    toUnion () {
      this.$router.push('/home/union')
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

      >div {
        font-size: 20px;
        line-height: 28px;
        flex: 1;
        text-align: center;
        padding: 26px 0;
        cursor: pointer;
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
      line-height: 44px;
      /* 122.222% */
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
      line-height: 32px;
      /* 200% */
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
        line-height: 24px;
        /* 150% */
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

      >div {
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
          line-height: 56px;
          /* 116.667% */
        }

        .content_task_main_text {
          color: var(--color-text-3, #86909C);
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px;
          /* 160% */
          text-transform: uppercase;
        }
      }
    }

    .content_task_block {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;

      >div {
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
          line-height: 44px;
          /* 122.222% */
        }

        .task_content {
          color: var(--color-text-2, #4E5969);
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px;
          /* 140% */
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
    background-color: #F7F8FA;
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

      >div {
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
          line-height: 56px;
          /* 116.667% */
        }

        .content_consortia_main_text {
          color: var(--color-text-5, #FFF);
          font-family: DINPro;
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 56px;
          /* 116.667% */
          text-transform: uppercase;
        }
      }
    }

    .content_consortia_block {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;

      >div {
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
          line-height: 32px;
          /* 133.333% */
        }

        .consortia_content {
          color: var(--color-text-3, #86909C);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px;
          /* 175% */
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
        line-height: 88px;

        /* 157.143% */
        .institude_dot {
          color: var(--primary, #3382FF);
          font-size: 80px;
          font-style: normal;
          font-weight: 700;
          line-height: 88px;
          /* 110% */
        }
      }

      .content_institude_left_text {
        color: var(--color-text-2, #4E5969);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        /* 140% */
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
          line-height: 32px;
          /* 133.333% */
          border-radius: 8px 48px 0px 48px;
          background: var(--primary, #3382FF);
          display: inline-flex;
          padding: 48px;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;

          >div:nth-child(1) {
            font-size: 24px;
          }

          >div:nth-child(2) {
            font-size: 16px;
          }
        }

        .content_institude_right_text2 {
          width: 100%;
          color: var(--color-text-5, #4E5969);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px;
          /* 133.333% */
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
        line-height: 56px;
        /* 155.556% */
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
        line-height: 44px;
        /* 122.222% */
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
          line-height: 28px;
          /* 140% */
        }

        .count {
          color: var(--color-text-5, #FFF);
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          /* 50% */
        }
      }
    }
  }
}

</style>
