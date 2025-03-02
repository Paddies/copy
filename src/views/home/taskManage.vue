<template>
  <div class="layout-container">
    <HeaderTabtar :current="2"></HeaderTabtar>
    <div class="content">
      <div class="page-wrap">
        <div class="sidebar white-card">
          <UnionSiderBar @onChange="handleSideChange" />
        </div>
        <div class="right-content">
          <div class="white-card">
            <h2 class="h2 flex-between">
              <div>
                任务进度
              </div>
              <div>
                <el-select v-model="value" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </h2>
            <div class="manageList" v-for="(item, index) in  questList " :key="index">
              <div class="list-left ">
                <div class="img item"></div>
                <div class="item">
                  <p>{{ item.name }}</p>
                  <span>{{ item.name }}类型</span>
                </div>
              </div>
              <div class="list-right">
                <div class="item">
                  <p>{{ item.Price }}</p>
                  <span>执行日期{{ item.date }}</span>
                </div>
                <div> <el-button type="primary">执行详情</el-button></div>
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
import UnionSiderBar from "./components/UnionSiderBar.vue";


// import Footer from './components/Footer.vue';
export default {
  components: {
    HeaderTabtar,
    UnionSiderBar,
    FooterVue
  },
  data() {
    return {
      questList: [
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
        {
          name: "3D点云标注", Price: "300.00元", date: " 2023-10-15"
        },
      ],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',

    }
  },
  methods: {
    handleSideChange(e) {
      // console.log('handleSideChange', e)
      // this.$router.push(e.path)
    }
  }

}
</script>

<style lang="scss" scoped>
.white-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.gray-card {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 20px;
}

.h2 {
  font-size: 24px;
  color: #000;
}

.gray {
  color: #86909c;
}

.content {

  // border: 1px solid #000;
  padding: 24px;
  padding-bottom: 50px;
  background-color: #f6f7f9;

  .page-wrap {
    width: 1200px;
    margin: 0 auto;
    // background: #fff;
    min-height: 1000px;
    display: flex;



    .white-card {
      margin-bottom: 24px;
    }
  }

  .sidebar {
    width: 282px;
    min-height: 500px;
  }

  .right-content {
    width: calc(100% - 282px);
    padding-left: 24px;
  }

  .h2 {
    font-size: 24px;
    color: #000;
  }

  .manageList {
    width: 850px;
    height: 115px;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.06);
    margin-top: 15px;
    padding: 20px;

    .list-left {
      float: left;
      display: flex;
      justify-content: space-between;
      width: 200px;

      .img {
        width: 75px;
        height: 75px;
        // border-radius: 50%;
        border: 5px solid #ffffff;
        background-image: url("../../assets/images/Frame438.png");
        background-repeat: no-repeat;
      }

      .item {
        p {
          vertical-align: middle;
          color: var(--color-text-1, #1D2129);
          font-size: 20px;
          line-height: 0px;
        }

        span {
          color: var(--color-text-2, #4E5969);
          font-size: 16px;

        }

      }
    }

    .list-right {
      float: right;
      display: flex;
      justify-content: space-between;
      width: 300px;
      height: 75px;

      p {
        color: var(--primary, #3382FF);
        line-height: 0px;
        text-align: right;
        font-size: 24px;

      }

      span {
        color: var(--color-text-4, #C9CDD4);
        font-size: 14px;

      }

      ::v-deep .el-button {
        margin: 10px;
      }
    }
  }
}
</style>
