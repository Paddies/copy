<template>
  <div>
    <!-- <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" /> -->
    <div class="screenfull-svg">
      <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'Screenfull'" @click="click" />
    </div>
    

  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
} 
</script>

<style scoped>

.screenfull-svg{
  width: 35px;
  height: 35px;
background-color: #F2F3F5;
border-radius: 18px;
margin: 7px 0px;
}
.svg-icon{
  margin: 10px 8px;
}
</style>
