<template>
  <div class="box">
    <div class="avatar" :class="active === index ? 'active' : ''" v-for="(item, index) in conf" :key="item" @click="changeMark(item)">
      <img :src="require(`@/assets/icons/marks/${active === index ? item + '_active' : item }.png`)" @click="clickTag(index)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conf: {
      type: Array,
       default(){
         return []
       }
    }
  },
  data() {
    return {
      active: 0,
    };
  },
  mounted() {},
  methods: {
    clickTag(i) {
      this.active = i;
    },
    changeMark(item) {
      this.$emit('changeTools', item)
    }
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: inline-flex;
  padding: 24px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 4px;
  background-color: #FFF;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.10);
  & .avatar {
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:#FFF;
    border-radius: 8px;
    padding: 8px;
    transition: background-color 0.3s linear;
    cursor: pointer;
  }
  & .avatar.active  {
    background-color: #3382FF;
  }
  .avatar:hover {
    background-color:  #F7F8FA;
  }
}
</style>
