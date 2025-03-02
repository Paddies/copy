<template>
  <div class="layout-container">
    <HeaderTabtar :current="4">
    </HeaderTabtar>
    <div class="middle">
      <div class="containerOne">
        <div class="top top1"><p>帮助中心</p>
          <p v-for="(item, index) in tabList" :key="index" @click="handleClick(index)" :class="{ active: cur === index }">
            <span>{{ item }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              v-if="cur === index">
              <path
                d="M15.8136 11.178C16.3876 11.5757 16.3876 12.4243 15.8136 12.822L11.0695 16.1088C10.4063 16.5683 9.5 16.0936 9.5 15.2868L9.5 8.71322C9.5 7.9064 10.4063 7.43175 11.0695 7.89123L15.8136 11.178Z"
                fill="#3382FF" />
            </svg>
          </p>
        </div>
        <div class="top top2">
          <div class="show">
            <div class="topnav-show" v-show="cur == 0">
              <p>帮助中心</p>
              <div class="top2-video"></div>
              <span>帷幄科技打造的供用户线上进行数据采集、标注的任务平台。您只需一台电脑或一台手机，注册登录帷幄科技平台，即可领取自己感兴趣的任务，通过数据验收审核后，即可获取佣金，并可提现到自己的银行账户中。</span>
            </div>
            <div class="topnav-show" v-show="cur == 1">
              <p>关于帷幄</p>
              <div class="top2-video"></div>
              <span>帷幄科技打造的供用户线上进行数据采集、标注的任务平台。您只需一台电脑或一台手机，注册登录帷幄科技平台，即可领取自己感兴趣的任务，通过数据验收审核后，即可获取佣金，并可提现到自己的银行账户中。</span>
            </div>
            <div class="topnav-show" v-show="cur == 2">
              <p>业务要求</p>
              <div class="top2-video"></div>
              <span>帷幄科技打造的供用户线上进行数据采集、标注的任务平台。您只需一台电脑或一台手机，注册登录帷幄科技平台，即可领取自己感兴趣的任务，通过数据验收审核后，即可获取佣金，并可提现到自己的银行账户中。</span>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
    <Footer class="Footer"></Footer>

  </div>
</template>

<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";
import Footer from './components/Footer.vue';

export default {
  components: {
    HeaderTabtar,
    Footer

  },
  data() {
    return {
      cur: 0,
      tabList: ['帮助中心', '关于帷幄', '业务要求']
    }


  },
  methods:{
    handleClick(index){
      this.cur = index
    }
  }
};
</script>
<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: #f7f8fa;
}

.middle {
  margin: 0 auto;
  width: 1200px;
}

.containerOne {
  display: flex;
  justify-content: space-between;
  margin: 25px 0px;
}

.top {
  padding: 24px;
  flex: 1;
  height: 680px;
  border-radius: 8px;
  background: #FFF;
}

.top1 {
  flex-grow: 1;
  margin-right: 10px;

}

.top2 {
  flex-grow: 3;
  margin-left: 10px;
}

.top p {
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 44px;
  /* 183.333% */
}

.top1 span {
  font-family: PingFang SC;
  font-size: 18px;
  cursor: pointer;

  
}
svg{
    float: right;
    font-size: 20px;
    margin: 3px 5px;
  }
.active {
  color: #3382ff;
}
.top2-video{
  width: 846px;
height: 475.875px;
background-image: url(../../assets/images/Frame343.png);
margin: 20px 0px;
}
.topnav-show span{
  color: #4E5969;
}
.Footer{
position: fixed;
bottom: 0;
left: 0;
right: 0;
}
</style>