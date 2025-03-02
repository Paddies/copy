<template>
  <div class="CheckListButtons">

    <el-button size="mini" type="text" v-hasPermi="[getButtonsByStatus[0].permission]"
      @click="handleUpdateStatus(row, getButtonsByStatus[0].status)">
      <p><img :src="require(`@/assets/icons/list/${getButtonsByStatus[0].icon}.png`)"
          style="vertical-align: bottom;margin-right: 5px;"><span>{{ getButtonsByStatus[0].text }}</span></p>
    </el-button>
    <el-button size="mini" type="text" v-hasPermi="[getButtonsByStatus[1].permission]"
      @click="handleUpdateStatus(row, getButtonsByStatus[1].status)">
      <p><img :src="require(`@/assets/icons/list/${getButtonsByStatus[1].icon}.png`)"
          style="vertical-align: bottom;margin-right: 5px;"><span>{{ getButtonsByStatus[1].text }}</span></p>
    </el-button>
    <el-dropdown v-if="getButtonsByStatus.length > 2" trigger="click" size="mini" class="dropdown">
      <el-button size="mini" type="text">
        <span style="display: flex;align-items: center;gap: 2px;">...更多</span>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="btn in moreButtons" :key="btn.permission">
          <p style="display: flex;align-items: center;gap: 5px;color: #1890ff;margin: 0"
            @click="handleUpdateStatus(row, btn.status)"><img
              :src="require(`@/assets/icons/list/${btn.icon}.png`)"><span>{{ btn.text }}</span></p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'CheckListButtons',
  props: {
    buttons: { // 按钮的数组
      type: Array,
      default() {
        return []
      }
    },
    row: { // 单行的数据
      type: Object,
      default() {
        return {}
      }
    },
    statusKey: { // 根据状态判断的key值   默认是 groupStatus
      type: String,
      default: 'groupStatus'
    },
    type: { // 类型  check => 质检员 job => 标注员
      type: String,
      default: 'check'
    },
  },
  methods: {
    handleUpdateStatus(row, status) {
      this.$emit('clickButton', {
        row: row,
        status
      })
    }
  },
  computed: {

    buttonsMap() {

      const map = {}
      this.buttons.forEach(item => {
        map[item.text] = item
      });

      return map

    },
    // 根据任务状态获取按钮列表
    getButtonsByStatus() {

      const { row, buttonsMap ,type } = this

      const _buttonsMap = { ...buttonsMap }
      if (row.groupStatus === '3' && type === 'check') {
        delete _buttonsMap.质检完成

      }
      return Object.values(_buttonsMap)

    },

    moreButtons() {
      return this.getButtonsByStatus.slice(2)
    }

  }
}
</script>
