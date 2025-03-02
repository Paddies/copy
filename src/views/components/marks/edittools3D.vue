<template>
  <div class="edit-tools-box">
    <div
      v-for="(item, index) in conf"
      :key="item.prop"
      class="btn"
      :class="index !== conf.length - 1 ? 'stroke' : ''"
    >
      <template v-if="item.icon" class="btn_wrap">
        <img :src="require(`@/assets/icons/marks/${item.icon}.png`)" alt="" />
        <span>{{ item.name }}</span>
      </template>
      <template v-else>
        <p>
          <span>{{ item.name }}</span>
          <span>{{ item.slot }}</span>
        </p>
      </template>
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
  created() {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.edit-tools-box {
  display: flex;
  padding: 0px 6px;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  background: var(--color-text-5, #303234);
  margin-left: 12px;
  .btn {
    display: flex;
    padding: 8px 12px;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #86909c;
    position: relative;
    img {
      cursor: pointer;
    }
  }
  .stroke::after {
    content: "";
    position: absolute;
    right: -3px;
    top: 25%;
    width: 1px;
    height: 26px;
    background-color: #303234;
  }
}
</style>
