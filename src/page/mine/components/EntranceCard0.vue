<!--
 * @Description: 动态 体检报告入口
 * @Author: IFLS
 * @Date: 2022-07-08 10:54:05
 * @LastEditTime: 2023-03-28 10:02:50
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const jumpTo = url => router.push(url);

      return {
        jumpTo
      };
    }
  });
</script>

<template>
  <div class="img-box">
    <img
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_dynamic.png"
      alt=""
      @click="jumpTo('/myUpdates')"
    />
    <!-- <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_report.png" alt="" @click="jumpTo('/report-analysis')" /> -->
  </div>
</template>

<style lang="scss" scoped>
  .img-box {
    display: flex;
    // justify-content: space-around;
    margin-bottom: 30px;
    img {
      width: 47%;
      height: 160px;
    }
    img:active {
      filter: brightness(0.8);
      transition: 0.2s;
    }
  }
</style>
