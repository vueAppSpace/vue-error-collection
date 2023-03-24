<!--
 * @Description: 全屏loading
 * @Author: IFLS
 * @Date: 2022-01-13 10:41:38
 * @LastEditTime: 2023-03-23 17:32:23
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import DotsLoader from "./dotsLoader.vue";
  export default defineComponent({
    components: {
      DotsLoader
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    }
  });
</script>

<template>
  <van-overlay :show="loading">
    <div class="loading-wrapper">
      <dots-loader />
    </div>
  </van-overlay>
</template>

<style lang="scss" scoped>
  .van-overlay {
    z-index: 999999;
    .loading-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      position: relative;
      z-index: 99999;
    }
  }
</style>
