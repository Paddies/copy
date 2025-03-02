<template>
  <SiderBarLayout :menuList="personMenus">
    消息中心
  </SiderBarLayout>
</template>
<script>
import SiderBarLayout from "../components/SiderBarLayout.vue"
import { personMenus } from "../components/menuData";

export default {
  components: { SiderBarLayout },
  name: 'messageCenter',
  data() {
    return {
      personMenus: personMenus
    }
  },
}
</script>
<style lang="scss" scoped>
.account {}
</style>
