<template>
  <div>
    <div class="header">
      <div class="collapse-item">
        <span>所有分类类目</span>
        <i class="el-icon-arrow-right arrow"></i>
      </div>
      <div class="collapse-item">
        <span>所有标注结果</span>
        <i class="el-icon-arrow-right arrow"></i>
      </div>
    </div>
    <!-- <div class="content">
      aaaaa
    </div> -->
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  border-top: 1px solid var(--color-border-2, #E5E6EB);
  border-bottom: 1px solid var(--color-border-2, #E5E6EB);
  background-color: #FFF;
  .collapse-item:nth-child(1) {
    border-right: 1px solid var(--color-border-2, #E5E6EB);
  }
  .collapse-item {
    display: flex;
    padding: 12px 12px 12px 24px;
    align-items: center;
    gap: 12px;
    flex: 1 0 0;
    .arrow {
      margin-left: auto;
      font-size: 13px;
    }
  }
}
.content {
  height: 0;
}
</style>
