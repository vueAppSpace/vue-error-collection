<!--
 * @Description: 即将上线版面-提示
 * @Author: IFLS
 * @Date: 2022-05-13 10:41:46
 * @LastEditTime: 2023-03-23 17:32:29
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  export default defineComponent({
    setup() {
      return {};
    }
  });
</script>

<template>
  <div class="tips-box">
    <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/panel_tips.png" />
    <span class="content">
      <slot></slot>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .tips-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 54px;
    img {
      // margin-left: -150px;
      width: 630px;
      height: 338px;
    }
    .content {
      position: absolute;
      // right: 0;
      top: 72px;
      // padding: 12px 26px;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      // background: #467ffc;
      // border-radius: 32px 32px 32px 4px;
    }
  }
</style>
