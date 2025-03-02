<template>
  <div class="header">
    <div class="header-container">
      <svg-icon icon-class="logo" class="logo"></svg-icon>
      <div class="menus">
        <div v-for="(item, index) in tablist" :key="index" :class="[tabIndex === index ? 'active' : '']"
          @click="handleTab(item, index)">{{ item.label }}</div>
      </div>
      <div class="login_1">
        <p>欢迎，请<a @click="openLogin">登录</a></p>
        <el-button type="primary" round @click="openRegist">立即注册</el-button>
      </div>
    </div>
    <!-- 注册弹框 -->
  </div>
</template>

<script>
export default {
  name: 'HeaderTabtar',
  props: {
    // 当前点击
    current: {
      type: Number,
      default: 0
    },
    // 是否显示当前tab高亮
    isShowCurr: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tablist: [
        {
          label: '首页',
          url: '/home'
        },
        {
          label: '任务',
          url: '/home/task'
        },
        {
          label: '工会',
          url: '/home/union'
        },
        {
          label: '学院',
          url: '/home/school'
        },
        {
          label: '帮助',
          url: '/home/help'
        }],
      tabIndex: 0,
      dialogFormVisible: true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
    }
  },
  mounted () {
    this.tabIndex = this.current
  },
  methods: {
    handleTab (item, index) {
      this.tabIndex = index
      this.$router.push(item.url)
    },
    openLogin () {
      this.$router.push({ path: '/home/login', query: { type: 1 } })
    },
    openRegist () {
            this.$router.push({ path: '/home/login', query: { type: 2 } })


    }
  }
}
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background: #FFF;

  .header-container {
    display: flex;
    align-items: center;
    width: 1200px;
    box-sizing: border-box;

    .logo {
      width: 160px;
      height: 36px;
    }

    .menus {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      padding: 0 50px;
      box-sizing: border-box;

      >div {
        font-size: 20px;
        line-height: 28px;
        flex: 1;
        text-align: center;
        padding: 26px 0;
        cursor: pointer;
      }

      .active {
        background-color: #3382ff;
        color: #fff;
      }
    }

    .login_1 {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
}
</style>