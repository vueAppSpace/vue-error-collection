<!--
 * @Description: 积分商城
 * @Author: IFLS
 * @Date: 2022-11-16 09:53:19
 * @LastEditTime: 2023-03-23 17:37:06
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
  <div>
    <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/empty_mall.png" alt="" />
    <span>即将开启，敬请期待</span>
  </div>
</template>

<style lang="scss" scoped>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-top: 192px;
    img {
      width: 502px;
      height: 420px;
    }
    span {
      font-size: 28px;
      font-weight: 400;
      color: #737782;
    }
  }
</style>
