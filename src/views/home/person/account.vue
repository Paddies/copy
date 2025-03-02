<template>
  <!-- <div class="account"> -->
  <SiderBarLayout :menuList="personMenus">
    <div class="account">
      <div class="center-bar">
        <div class="user-info">
          <div>
            <img :src="avatar" alt="" class="avatar mx-auto" />
          </div>
          <div class="nickname">帷幄科技</div>
        </div>

        <div class="desc-list">
          <div class="desc-item" v-for="item in dataList" :key="item.label">
            <div>{{ item.label }}</div>
            <div class="value-box">{{ item.value }}</div>
          </div>
        </div>

        <div class="medal-wrap">
          <div class="title">获得的勋章</div>
          <div class="list-box">
            <div class="medal-item" v-for="item in medalList" :key="item.icon">
              <div>
                <img :src="item.icon" class="medal-icon" alt="" />
              </div>
              <div class="medal-text">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-bar">
        <div class="user-points white">
          <p>我的积分</p>
          <span>98990</span>
        </div>
        <div class="user-chart white"></div>
        <div class="white user-list">
          <div class="listbox" v-for="item in userList" :key="item.name">
            <div class="left">
              <img :src="item.icon" alt="icon" />
            </div>
            <div class="right">
              <div class="line1">{{ item.name }}</div>
              <div class="line2">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SiderBarLayout>
  <!-- </div> -->
</template>
<script>
import SiderBarLayout from "../components/SiderBarLayout.vue";
import { personMenus } from "../components/menuData";

export default {
  components: { SiderBarLayout },
  name: "account",
  data() {
    return {
      personMenus: personMenus,
      avatar:
        "https://picx.zhimg.com/80/v2-9c23afe034e1cfc7c9185277926f7689_720w.png",
      dataMap: {
        gender: {
          label: "性别",
          value: "男",
        },
        age: {
          label: "年龄",
          value: "25周岁",
        },
        education: {
          label: "学历",
          value: "研究生",
        },
        profession: {
          label: "职业",
          value: "软件工程师",
        },
        city1: {
          label: "出身城市",
          value: "长沙",
        },
        city2: {
          label: "居住城市",
          value: "长沙",
        },
        nation: {
          label: "民族",
          value: "汉族",
        },
        dayWorkCount: {
          label: "每天可工作时长",
          value: "3 - 6 小时",
        },
        workTime: {
          label: "每天可工作时间段",
          value: "18：00 - 24：00",
        },
        hopeMoney: {
          label: "每月希望在平台赚多少钱",
          value: "10000元子",
        },
        useFor: {
          label: "赚钱用途",
          value: "给老婆花",
        },
        isWorkRest: {
          label: "是否在其他平台上工作",
          value: "百度/数据堂",
        },
        moneyText: {
          label: "赚钱宣言",
          value: "快乐工作，快乐生活！",
        },
      },
      medalList: [
        {
          icon: require("@/assets/images/Frame1.png"),
          text: "语言转写",
        },

        {
          icon: require("@/assets/images/Frame2.png"),
          text: "2D人体拉框",
        },
        {
          icon: require("@/assets/images/Frame3.png"),
          text: "3D云标注",
        },
      ],
      userList: [
        {
          icon: require("@/assets/images/Frame387.png"),
          name: "实名认证",
          text: "实名认证已认证",
        },
        {
          icon: require("@/assets/images/Frame387.png"),
          name: "对公账号",
          text: "6409********289",
        },
        {
          icon: require("@/assets/images/Frame387.png"),
          name: "绑定手机",
          text: "13712344321",
        },
        {
          icon: require("@/assets/images/Frame387.png"),
          name: "绑定微信",
          text: "WeiwoKeji2023",
        },
        {
          icon: require("@/assets/images/Frame387.png"),
          name: "绑定支付宝",
          text: "13712344321",
        },
      ],
    };
  },
  computed: {
    dataList() {
      const { dataMap } = this;

      return Object.keys(dataMap).map((key) => {
        const { value, label } = dataMap[key];
        return {
          key,
          value,
          label,
        };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mx-auto {
  margin: 0 auto;
}
.white {
  background: #fff;
  border-radius: 8px;
}
.account {
  display: flex;
  .center-bar {
    width: 588px;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }

  .desc-list {
    padding: 24px;
    padding-top: 0;
    color: #86909c;
    display: flex;
    flex-wrap: wrap;

    .desc-item {
      width: calc((100% - 24px) / 2);
      border-bottom: 1px solid #f2f3f5;
      padding-top: 24px;
      margin-right: 24px;

      &:nth-child(2n) {
        margin-right: 0;
      }
    }

    .value-box {
      color: #4e5969;
      line-height: 40px;
      margin-top: 8px;
    }
  }

  .user-info {
    padding: 24px;
    text-align: center;
    background: url(../../../assets/images/person-bg1.png) no-repeat 0 0;
    color: #fff;
    background-color: #3381ff;
    height: 164px;

    .nickname {
      margin-top: 8px;
      font-size: 24px;
    }
  }

  .nickname {
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #fff;
  }
}
.right-bar {
  width: calc(100% - 612px);
  margin-left: 24px;
  overflow: hidden;
  .user-points {
    background: url(../../../assets/images/Frame404.png);
    color: #fff;
    height: 164px;
    overflow: hidden;
    padding: 50px 20px;
    p {
      font-size: 16px;
      line-height: 0px; /* 150% */
    }
    span {
      font-size: 32px;
    }
  }
  .user-chart {
    margin-top: 20px;
    width: 282px;
    height: 356px;
    background: url(../../../assets/images/六边形.png);
  }
  .user-list {
    margin-top: 20px;
    padding: 15px 20px;
  }
  .listbox {
    margin-bottom: 35px;
    display: flex;
    align-items: center; /* 垂直居中 */
  }
  .left {
    margin-right: 1rem; /* 左右间距 */
  }

  .left img {
    width: 4rem; /* 图标大小 */
  }

  .right {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    justify-content: center; /* 垂直居中 */
  }

  .line1 {
    color: #000;
    font-family: PingFang SC;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 160% */
  }

  .line2 {
    color: var(--color-text-3, #86909c);

    /* 16/CN-Medium */
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}

.medal-wrap {
  padding: 24px;
  padding-top: 0;

  .title {
    color: #000;
    font-size: 20px;
    margin-bottom: 16px;
    font-weight: bold;
  }

  .list-box {
    display: flex;

    .medal-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }

    .medal-item {
      width: 96px;
      text-align: center;
      color: #86909c;
    }
  }
}
</style>
