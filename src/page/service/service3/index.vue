<script>
  import { defineComponent } from "@vue/composition-api";
  import Service from "./components/service";
  import Banner from "@/components/banner.vue";

  export default defineComponent({
    components: {
      Banner,
      Service
    },
    setup() {
      const type = "service";

      const err2 = function () {
        try {
          let a = 123;
          let a = 456;
        } catch (err) {
          console.error("try-catch: err2收集到错误,", err);
        }
      };

      setTimeout(() => {
        err2();
      }, 2000);

      return {
        type
      };
    }
  });
</script>

<template>
  <div class="content">
    <Banner class="banner" :type="type" />

    <Service />
  </div>
</template>

<style lang="less" scoped>
  .content {
    min-height: 100%;
    background: #f2f4f8;
    padding-bottom: 240px;
    overflow: hidden;
    .banner {
      margin-top: 30px;
    }
  }
</style>
