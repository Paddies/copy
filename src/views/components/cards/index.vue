<template>
  <div class="cards">
    <el-card v-if="attr.type && attr.type === 'Calender'" style="height: 100%;">
      <el-calendar disabled>
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <span :class="data.isSelected ? 'is-selected' : ''" @click="preventClick">
            {{ data.day.split('-').slice(2)[0] }}
          </span>
        </template>
      </el-calendar>
    </el-card>
    <el-card class="box-card" v-else>
      <div class="header">
        <span class="title">{{ attr.title }}</span>
        <DateSwitch @switch="switchGranularity"></DateSwitch>
      </div>
      <div v-for="item in attr.cards" :key="item.title" class="card" :class="item.icon">
        <div class="texts">
          <span class="texts-title">{{ item.title }}</span>
          <span class="texts-value">{{ item.value }}</span>
        </div>
        <div>
          <svg-icon class="svg-icon" :icon-class="item.icon"></svg-icon>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import DateSwitch from './dateSwitch'
export default {
  components: {
    DateSwitch
  },
  props: {
    granularity: {
      type: String,
      default: ''
    },
    attr: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    switchGranularity(val) {
      this.$emit('update:granularity', val)
      this.$emit('switchGranularity')
    },
    preventClick(event) {
      event.preventDefault();
    }
  }
}
</script>

<style lang="scss" scoped>
.cards {
  height: 100%;
  ::v-deep .el-calendar-table .el-calendar-day {
    height: auto;
  }
  ::v-deep .el-calendar__body {
    padding: 12px 20px 10px;
  }
  ::v-deep .el-calendar-table td.is-today {
    background-color: #1890ff;
    color: #FFF;
  }
  ::v-deep .el-calendar__button-group {
    display: none;
  }
}
.box-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  .title {
    line-height: 32px;
  }
}
.card {
  width: 100%;
  // height: 106px;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  .texts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    .texts-title {
      font-size: 14px;
      color: #FFF;
    }
    .texts-value {
      font-size: 18px;
      color: #FFF;
      font-weight: bold;
    }
  }
  .svg-icon {
    font-size: 56px;
  }
}
.box-card {
  padding: 10px 0;
  ::v-deep .el-card__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
  }
}
.grade_01 {
  background: var(--unnamed, linear-gradient(90deg, #3382FF 1.75%, #1BADFF 100%));
}
.grade_02 {
  background: linear-gradient(94deg, #4AB2F7 1.63%, #62CEF2 95.76%);
}
.production_01 {
  background: linear-gradient(95deg, #7BA0FF 3.81%, #8AC0F6 98.14%);
}
.production_02 {
  background: linear-gradient(94deg, #50B6ED 5.09%, #4ABAD2 94.49%);
}
</style>
