<template>
  <div class="navbar">
    <div class="item">
      <img src="@/assets/icons/home/2.png" class="icon">
      <span>关注我们</span>
    </div>
    <div class="item active">
      <img src="@/assets/icons/home/3.png" class="icon">
      <span>在线联系</span>
    </div>
    <div class="item" @click="gotop" v-show="tops">
      <img src="@/assets/icons/home/1.png" class="icon">
      <span>返回顶部</span>
    </div>
  </div>
</template>
script部分
<script>
export default {
  name: 'RightBar',
  data () {
    return {
      showQR: false,
      tops: false,
      heights: window.innerHeight,
      scrolltop: '',
    };
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    hideQRCode () {//隐藏二维码
      this.showQR = false
    },
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrolltop = scrollTop
      if (parseInt(this.scrolltop) > (parseInt(this.heights) / 3)) {
        this.tops = true
      } else {
        this.tops = false
      }
    },
    gotop () {
      let timer = setInterval(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.scrolltop - 90
        if (this.scrolltop === 0) {
          clearInterval(timer)
        }
      }, 15)
    },
  }
}
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
}

.navbar {
  position: fixed;
  top: 68%;
  right: 1%;
  z-index: 999;
}


.item {
  color: #4E5969;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  padding-top: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.active {
  background-color: #3382ff;
  color: #fff;
}
</style>