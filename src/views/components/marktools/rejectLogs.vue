<template>
  <div class="wrap">
    <div class="title">
      <div class="text">驳回记录</div>
    </div>
    <div class="card_list">
      <el-card class="box-card" v-for="(item, index) in list" :key="index">
        <p>
          <span>驳回时间：</span>
          <span class="txt">{{ item.cTime }}</span>
        </p>
        <p>
          <span>驳回人员：</span>
          <span class="txt">{{ item.checkNickName }}</span>
        </p>
        <p>
          <span>驳回原因：</span>
          <span class="txt">{{ item.checkNote }}</span>
        </p>
      </el-card>
      <el-empty description="暂无记录" v-if="list.length === 0"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rejectLogs',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 5px -4px rgba(0, 0, 0, 0.1);
}
.card_list {
  height: calc(100% - 20px);
  overflow-y: auto;
}
.box-card {
  margin-top: 10px;
}
.title {
  display: flex;
  align-items: center;
  padding: 10px;

  gap: 24px;
  border-bottom: 1px solid var(--color-border-2, #E5E6EB);

  .text {
    flex: 1;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
  }

  i {
    font-size: 16px;
  }
}


</style>
