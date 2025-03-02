<template>
  <div class="dot-container">
    <div class="fonts">
      <span :class="active === 1 ? 'active' : ''" @click="switchDate(1)">日</span>
      <span :class="active === 2 ? 'active' : ''"  @click="switchDate(2)">周</span>
      <span :class="active === 3 ? 'active' : ''"  @click="switchDate(3)">月</span>
    </div>
    <span class="dot" :class="activePosition"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1
    }
  },
  computed: {
    activePosition() {
      return `position${this.active}`
    }
  },
  methods: {
    switchDate(val) {
      this.active = val
      let granularity = 'day'
      switch(this.active) {
        case 1 : granularity = 'day'
          break;
        case 2: granularity = 'week'
          break;
        default: granularity = 'month'
          break;
      }
      this.$emit('switch', granularity)
    }
  }
}
</script>

<style lang="scss" scoped>
.dot-container {
  width: 138px;
  height: 32px;
  border-radius: 16px;
  position: relative;
  background-color: #F7F8FA;
  .fonts {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    display: flex;
    z-index: 1;
    span {
      flex: 1;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      transition: all .3s;
    }
    span.active {
      color: #FFF;
    }
  }
  .dot {
    position: absolute;
    width: 33.33%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 16px;
    background-color: #3382FF;
    transition: all .3s linear;
  }
  .dot.position1 {
    left: 0;
  }
  .dot.position2 {
    left: 33.33%;
  }
  .dot.position3 {
    left: 66.66%;
  }
}
</style>
