<template>
  <div class="UnionSiderBar">
    <ul>
      <li v-for="item in  menuList " :key="item.name" :class="{ 'menu-item': true, active: activePath === item.path }"
        @click="itemClick(item)">
        <img :src="activePath === item.path ? item.activeIcon : item.icon" alt="" class="icon">
        {{ item.name }}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          v-if="activePath === item.path">
          <path
            d="M15.8136 11.178C16.3876 11.5757 16.3876 12.4243 15.8136 12.822L11.0695 16.1088C10.4063 16.5683 9.5 16.0936 9.5 15.2868L9.5 8.71322C9.5 7.9064 10.4063 7.43175 11.0695 7.89123L15.8136 11.178Z"
            fill="#3382FF" />
        </svg>
      </li>
    </ul>


  </div>
</template>
<script>
export default {
  name: 'UnionSiderBar',
  data() {
    return {
      activePath: '/home/union/myUnion/Unionmanagement'
    }
  },
  methods: {
    itemClick(item) {
      this.$emit('onChange', { path: item.path })
      this.$router.push(item.path)
    },
  },
  created() {
    // 获取当前路由的路径名
    const currentPath = this.$route.path;
    this.activePath = currentPath
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return [
          {
            name: '管理首页',
            icon: require('@/assets/images/menuIcons/icon2.png'),
            path: "/home/union/myUnion/Unionmanagement",
            activeIcon: require('@/assets/images/menuIcons/icon2_act.png')
          },
          {
            name: '任务管理',
            icon: require('@/assets/images/menuIcons/icon1.png'),
            activeIcon: require('@/assets/images/menuIcons/icon1_act.png'),
            path: "/home/union/myUnion/taskManage"
          },
          {
            name: '会员管理',
            icon: require('@/assets/images/menuIcons/icon3.png'),
            activeIcon: require('@/assets/images/menuIcons/icon3_act.png'),
            path: "/home/union/myUnion/memberManage"
          },
          {
            name: '订单管理',
            icon: require('@/assets/images/menuIcons/icon4.png'),
            activeIcon: require('@/assets/images/menuIcons/icon4.png'),
            path: "/home/union/myUnion/Unionmanagement3"
          },
          {
            name: '结算记录',
            icon: require('@/assets/images/menuIcons/icon5.png'),
            activeIcon: require('@/assets/images/menuIcons/icon5.png'),
            path: "/home/union/myUnion/Unionmanagement4"
          },
          {
            name: '提现记录',
            icon: require('@/assets/images/menuIcons/icon6.png'),
            activeIcon: require('@/assets/images/menuIcons/icon6.png'),
            path: "/home/union/myUnion/Unionmanagement5"
          },
          {
            name: '工会信息',
            icon: require('@/assets/images/menuIcons/icon7.png'),
            activeIcon: require('@/assets/images/menuIcons/icon7_act.png'),
            path: "/home/union/myUnion/unionMessage"
          },
        ]
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.UnionSiderBar {
  .menu-item {
    padding: 18px 0;
    display: flex;
    align-items: center;
    cursor: pointer;

    &.active {
      color: #3382FF;
    }

    .icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }

  }

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  svg {

    font-size: 20px;
    margin-left: 120px;
  }
}
</style>