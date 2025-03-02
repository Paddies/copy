<template>
  <div class="layout-container">
    <HeaderTabtar :current="2"></HeaderTabtar>
    <div class="middle">
      <div class="containerOne">
        <div class="top top1"></div>
        <div class="top top2">
          <div class="containerOne-left">
            <div class="avatar"></div>
            <div class="text">公匠赋能</div>
            <button class="button" @click="tomyUnion()">进入我的工会</button>
          </div>
        </div>
      </div>
      <div class="containerTwo message-containe">
        <div class="message ">
          <svg t="1695714619582" class="icon" viewBox="0 0 1024 1024" style="margin: -5px 15px" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1478" width="24" height="24">
            <path
              d="M512 895.930093h-85.286729l-234.748225 128.069907V789.391589C75.080284 707.180776 0 589.317313 0 447.405789 0 200.633534 229.295467 0 512 0s512 200.633534 512 447.405789c0 259.774986-229.155653 447.405789-512 447.405789z m1.817586-837.068269c-247.471327 0-454.536319 174.628072-454.536319 386.726379a380.714364 380.714364 0 0 0 188.609503 321.572911v160.227198L425.0355 838.885855s65.153468-0.9787 102.623703-0.9787c247.471327 0 438.178045-176.445658 438.178044-388.543965S768 59.980339 513.817586 58.861824z m254.182414 452.998362A64.034954 64.034954 0 1 1 832.034954 447.405789a64.034954 64.034954 0 0 1-64.034954 64.034954z m-256 0A64.034954 64.034954 0 1 1 576.034954 447.405789a64.034954 64.034954 0 0 1-64.034954 64.034954z m-256 0A64.034954 64.034954 0 1 1 320.034954 447.405789a64.034954 64.034954 0 0 1-64.034954 64.034954z"
              fill="#3382FF" p-id="1479"></path>
          </svg>
          <span>工会动态：目前已经有234家工会加入帷幄科技</span>
        </div>
      </div>
      <div class="containerOne">
        <div class="bottom bottom1">
          <div class="screen">
            <el-select v-model="value1" multiple placeholder="工会区域">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

            <el-select v-model="value2" multiple collapse-tags style="margin-left: 20px" placeholder="工会类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="input" placeholder="搜索公告">
              <el-button slot="append" icon="el-icon-search" class="edit"></el-button></el-input>
          </div>
          <div class="rightTab">
            <span v-for="(item, index) in tabList" :key="index" @click="handleClick(index)"
              :class="{ active: cur2 === index }">
              <span>{{ item }}</span>
            </span>
          </div>
          <div class="containerbottom-right-1">

            <div class="check">
              <div class="checkTab" @click="cur = 0" :class="{ active: cur == 0 }">月度账单</div>
              <div class="checkTab" @click="cur = 1" :class="{ active: cur == 1 }">年度账单</div>
              <div class="checkTab" @click="cur = 2" :class="{ active: cur == 2 }">总榜单</div>

            </div>
            <div class="tab-content">
              <div v-show="cur == 0">
                <div class="check_Tab">
                  <img src="../../assets/images/Group26.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab" style="margin-top: -50px;">
                  <img src="../../assets/images/Group1.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab">
                  <img src="../../assets/images/Group2.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>

              </div>

              <div v-show="cur == 1">
                <div class="check_Tab">
                  <img src="../../assets/images/Group26.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab" style="margin-top: -50px;">
                  <img src="../../assets/images/Group1.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab">
                  <img src="../../assets/images/Group2.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
              </div>
              <div v-show="cur == 2">
                <div class="check_Tab">
                  <img src="../../assets/images/Group26.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab" style="margin-top: -50px;">
                  <img src="../../assets/images/Group1.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
                <div class="check_Tab">
                  <img src="../../assets/images/Group2.png" alt="">
                  <div class="avatar"></div>

                  <p class="text">公匠赋能</p>
                  <div class="text-row">
                    <p>会员数量 872</p>
                    <p>工会地区 湖南长沙</p>
                    <p>结算金额 ￥417309.65</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg">
            <div class="enterpriseUnion" v-for="(item, index)  in unionList " :key="index">
              <div class="containerbottom-right-2">
                <div class="icon">
                  <img :src="item.img" alt="" />
                </div>
                <div class="avatar"></div>
                <div class="text-row">
                  <div class="text">
                    {{ item.name }}<span class="Enterprise-icon" style="color: aliceblue">{{ item.type }}</span>
                  </div>
                  <div class="text2">
                    会员数量<span>{{ item.Number }}</span>工会地区<span>{{ item.district }}</span>结算金额<span
                      style="color: #3382ff">{{ item.money }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom bottom2 marquee-container">
          <div class="tx-title">
            <svg t="1695716230915" class="icon" style="margin: -5px 5px" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="3998" width="24" height="24">
              <path
                d="M613.230878 300.392162A182.330522 182.330522 0 0 0 430.900356 482.755524v210.474841a72.249126 72.249126 0 0 1-13.825856 42.692665l-33.628684 47.356018H843.015939l-33.563003-47.290337a72.249126 72.249126 0 0 1-13.858696-42.692665V482.755524a182.363362 182.363362 0 0 0-182.363362-182.330522z"
                fill="#3382FF" p-id="3999"></path>
              <path
                d="M353.955037 958.614541a35.336391 35.336391 0 0 1 0-70.672782h297.797761a35.336391 35.336391 0 1 1 0 70.672782zM138.127193 822.720503A46.83057 46.83057 0 0 1 99.999359 748.76367l68.341105-95.927135a33.136076 33.136076 0 0 0 6.338219-19.441583v-286.237901a314.776306 314.776306 0 0 1 629.519771 0v286.205061a33.464482 33.464482 0 0 0 6.371059 19.507264l68.308265 95.894294A46.797729 46.797729 0 0 1 840.717103 822.720503zM489.323627 99.211186a247.978705 247.978705 0 0 0-247.978705 247.945865v286.205061a98.521536 98.521536 0 0 1-18.784773 58.160546l-45.582631 64.400244h624.954941l-45.681152-64.334563a98.225971 98.225971 0 0 1-18.850454-58.226227v-286.205061A247.913024 247.913024 0 0 0 489.323627 99.211186z"
                fill="#3382FF" p-id="4000"></path>
            </svg>
            <span>提现公告</span>
          </div>
          <div class="containerbottom-left ">
            <div class="ontainerbottom-box marquee" v-for="item  in WithdrawalList " :key="item.id">
              <div class="ontainerbottom-text">
                <svg t="1695718157280" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="5425" id="mx_n_1695718157280" width="18" height="18">
                  <path
                    d="M853.333333 682.666667l-113.777777-284.444445 113.777777-284.444444H227.555556V56.888889H170.666667v853.333333H113.777778v56.888889h170.666666v-56.888889H227.555556v-227.555555h625.777777z m-85.333333-512l-91.022222 227.555555 91.022222 227.555556H227.555556V170.666667h540.444444z"
                    fill="#333333" p-id="5426"></path>
                </svg>
                <span>{{ item.name }}</span>
              </div>
              <div class="ontainerbottom-text">
                <p>成功提现<span class="green">{{ item.amount }}</span></p>
              </div>
              <div class="ontainerbottom-text">
                <small>{{ item.date }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>

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
      options: [
        {
          value: "选项1",
          label: "湖南",
        },
        {
          value: "选项2",
          label: "广东",
        },
        {
          value: "选项3",
          label: "上海",
        },
        {
          value: "选项4",
          label: "湖北",
        },
        {
          value: "选项5",
          label: "四川",
        },
      ],
      cur2: 0,
      tabList: ["工会列表", "工会收益排行榜"],
      WithdrawalList: [
        { id: 1, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 2, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 3, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 4, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 5, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 6, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 7, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 8, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 9, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 10, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 11, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 12, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
        { id: 13, name: '公匠赋能团队', amount: '$4173.5', date: '2023-8-6 14:43:23' },
      ],
      unionList: [{ name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Rectangle147.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Group27.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Group28.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Rectangle147.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Group30.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Group31.png') },
      { name: "公匠赋能", type: "企业工会", Number: "872", district: "湖南长沙", money: "￥417309.65", img: require('@/assets/images/Group32.png') },


      ],
      value1: [],
      value2: [],
      input: "",

    }


  },
  methods: {
    handleClick(index) {
      this.cur2 = index;
    },
    tomyUnion() {
      this.$router.push('/home/union/myUnion')
    }
  },
};
</script>
<style scoped lang="scss">
.layout-container {
  width: 100%;
  // height: 100vh;
  background-color: #f7f8fa;
}

.middle {
  margin: 0 auto;
  width: 1200px;
}

.containerOne {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.top {
  flex: 1;
  height: 240px;
  border-radius: 8px;
  background-color: #3382ff;
}

.top1 {
  flex-grow: 3;
  margin-right: 10px;
  background-image: url("../../assets/images/Group58.png");
}

.top2 {
  flex-grow: 1;
  margin-left: 10px;
  background-image: url("../../assets/images/Frame248.png");
}

.containerOne-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px;
}

.avatar {
  width: 90px;
  height: 90px;
  //  background-image: url();
  border-radius: 50%;
  border: 5px solid #ffffff;
  background-image: url("../../assets/images/Ellipse65.png");
  background-repeat: no-repeat;
}

.top2 .text {
  margin-top: 10px;
  color: white;
}

.button {
  width: 140px;
  height: 44px;
  margin-top: 10px;
  border-radius: 22px;
  color: #3382ff;
  background-color: #ffffff;
  border: 0px;
  font-size: 16px;
  cursor: pointer;

}

.containerTwo {
  height: 76px;
  background: #e8f3ff;
  padding: 23px;
  margin-top: 24px;
}

.containerTwo span {
  font-size: 20px;
  font-weight: 400;
  margin-top: 25px;
  color: #3382ff;
}

.bottom1 {
  flex-grow: 2;
  margin-right: 10px;
}

.bg {
  background-color: #ffffff;
}

.bottom2 {
  background-color: #ffffff;
  padding: 20px 20px;
  flex-grow: 5;
  margin-left: 10px;
  // background-image: url();
}

.bottom2 span {
  font-size: 20px;
}

.containerbottom-left {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ontainerbottom-box {
  width: 100%;
  height: 140px;
  margin-bottom: 10px;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  font-size: 18px;
}

.ontainerbottom-text {
  margin-bottom: 5px;
}

.ontainerbottom-text .green {
  font-size: 15px;
  color: #3382ff;
}

.ontainerbottom-text small {
  font-size: 13px;
  color: #86909c;
}

.ontainerbottom-text p {
  font-size: 15px;
  color: #4e5969;
}

.containerbottom-right-1 {
  background-image: url("../../assets/images/Frame406.png");
  height: 904px;
  position: relative;

  span {
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
    margin: 0px 10px;
    padding-bottom: 20px;
    vertical-align: middle;
  }

  .active {
    color: #3382ff;
    border-bottom: #3382ff 3px solid;
  }

}

.rightTab {
  background-color: #ffffff;
  height: 60px;
  padding: 5px 5px;

  span {
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
    margin: 0px 10px;
    padding-bottom: 20px;
    vertical-align: middle;
    cursor: pointer;
  }

  .active {
    color: #3382ff;
    border-bottom: #3382ff 3px solid;
  }
}

.containerbottom-right-2 {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 10px;
}

.containerbottom-right-2 .icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  margin-left: 35px;
}

.containerbottom-right-2 .avatar {
  flex-shrink: 0;
  margin: 0px 20px;
}

.containerbottom-right-2 .text-row {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.containerbottom-right-2 .text {
  color: #4e5969;

  font-size: 22px;
  margin-bottom: 5px;
  float: left;
}

.containerbottom-right-2 .text2 {
  font-size: 16px;
  color: var(--color-text-3, #86909c);
  float: left;
}

.containerbottom-right-2 .text2 span {
  font-size: 16px;
  padding: 0px 20px;
  color: var(--color-text-2, #4e5969);
}

.Enterprise-icon {
  font-size: 14px;
  margin-left: 30px;
  padding: 5px 15px;
  display: inline-block;
  border-radius: 14px 14px 14px 2px;
  background: var(--primary, #3382ff);
}

.checkTab {
  height: 60px;
  list-style: none;
}

.checkTab {
  color: #fff;
  margin: 8px 0px;
  padding: 16px 0px;
  text-align: center;
  font-size: 20px;
  float: left;
  width: 33%;
  border-radius: 32px;
  text-align: center;
  cursor: pointer;
  // background: var(--color-text-5, #FFF);
}

/* 点击对应的标题添加对应的背景颜色 */

.active {
  background: var(--color-text-5, #FFF);
  color: #3382ff;
}

.tab-content {
  width: 100%;
  position: absolute;
  bottom: 0%;
  right: -2%;
  width: 850px;
  height: 400px;
}

.tab-content div {
  text-align: center;
  margin: 0px 20px;
}

.check {
  position: absolute;
  top: 25%;
  right: 45%;
  width: 420px;
  height: 80px;
  border-radius: 46px;
  border: 2px solid var(--color-text-5, #FFF);

}

.check_Tab {
  width: 200px;
  height: 260px;
  background-color: #ffffff;
  float: left;
  padding: 5px 9px;
  border-radius: 8px;
  position: relative;

  .avatar {
    margin: 0px 40px;
  }

  .text {
    font-size: 20px;
    color: #000;
  }

  p {
    font-size: 14px;
    color: #86909C;
  }

  img {
    position: absolute;
    top: -17%;
    left: 33%;
  }

}

.message-container {
  height: 200px;
  overflow: hidden;
}

.message {
  position: relative;
  animation: message-animation 5s infinite;
}

@keyframes message-animation {
  0% {
    top: 100%;
    opacity: 0;
  }

  10%,
  90% {
    top: 0;
    opacity: 1;
  }

  100% {
    top: -100%;
    opacity: 0;
  }
}

.marquee-container {
  height: 1860px;
  overflow: hidden;

  &.bottom2 {
    padding-top: 0;
  }
}

.tx-title {
  position: relative;
  z-index: 1000;
  background: #fff;
  padding-top: 20px;
  padding-bottom: 10px;

}

.marquee {

  position: relative;
  z-index: 0;
  display: block;
  animation: marquee 5s linear infinite;
  // margin-top: -20px; /* 文字垂直间距 */
}

@keyframes marquee {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

.screen {
  margin-bottom: 20px;
  height: 70px;
  border-radius: 8px;
  background: var(--color-text-5, #fff);
  padding: 15px 10px;

}

.el-input-group {
  width: 350px;
  margin-left: 20px;
}

.edit {
  background-color: #4f8ef4;
  color: #f7f8fa;
}

.enterpriseUnion {
  // padding: 20px 0px;
  margin: 10px 15px;
  height: 115px;
  background: var(--color-text-5, #fff);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.06);
}
</style>
