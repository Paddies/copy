<template>
  <div class="footer">
    <div class="footer_content">
      <svg-icon icon-class="logo_reverse" class="logo_reverse"></svg-icon>
      <span class="footer_text">Copyright © www.weiwo.com, All Rights Reserved.</span>
    </div>
    <div class="beian">
      <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023027613号-2</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
<style scoped lang="scss">
.footer {
  background-color: #1D2129;
  padding: 40px 0;

  .footer_content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .logo_reverse {
      width: 160px;
      height: 36px;
    }

    .footer_text {
      color: var(--color-text-5, #FFF);
      font-size: 20px;
      font-style: normal;
      font-weight: 400;  
      line-height: 28px;
      /* 140% */
    }
  }
}

.beian {
  text-align: center;
  color: #fff;
  display: block;
}
</style>