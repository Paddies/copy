<template>
  <div class="layout-container">
    <HeaderTabtar :current="2"></HeaderTabtar>
    <div class="content">
      <div class="page-wrap">
        <div class="sidebar white-card">
          <UnionSiderBar :menuList="menuList" />
        </div>
        <div class="right-content">
          <slot></slot>
        </div>
      </div>
    </div>
    <FooterVue />
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import FooterVue from './Footer.vue';
import HeaderTabtar from "./HeaderTabtar.vue";
import UnionSiderBar from "./UnionSiderBar.vue";
import { unionSiderMenu } from './menuData';


// import Footer from './components/Footer.vue';
export default {
  name: 'SiderBarLayout',
  components: {
    HeaderTabtar,
    UnionSiderBar,
    FooterVue
  },
  data() {
    return {

    }
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return unionSiderMenu
      }
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

}
</style>
