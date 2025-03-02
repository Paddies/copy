<template>
  <div class="edit-tools-box">
    <div class="handler">
      <img src="@/assets/icons/marks/db_trangle_left.png" alt="" />
      <img src="@/assets/icons/marks/trangle_left.png" alt="" />
      <div class="pic_name">
        <img src="@/assets/icons/marks/pic.png" alt="" />
        <span>Picture...P3.jpg</span>
      </div>
      <img src="@/assets/icons/marks/trangle_right.png" alt="" />
      <img src="@/assets/icons/marks/db_trangle_right.png" alt="" />
    </div>
    <div>
      <el-button type="default">跳过</el-button>
      <el-button type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conf: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.edit-tools-box {
  display: inline-flex;
  height: 68px;
  padding: 0px 12px 0px 24px;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
  border-radius: 4px;
  background: var(--color-text-5, #fff);
  margin-left: 12px;
  .handler {
    display: flex;
    align-items: center;
    gap: 16px;
    .pic_name {
      display: flex;
      width: 156px;
      padding: 8px 12px;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
