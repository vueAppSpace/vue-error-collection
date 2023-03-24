<template>
  <div class="question-box">
    <iframe class="iframe-class" :src="iframeUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
  // import { danaoQuestionUrl, danaoComprehensiveUrl } from "@/config/env";
  import { orderLunchUrl, dianCanUrl } from "@/config/env";

  export default {
    data() {
      return {
        iframeUrl: ""
      };
    },
    mounted() {
      let date = dayjs().add(1, "day").format("YYYY-MM-DD");
      let dishId = this.$route.query.dishId;
      let canteenId = this.$route.query.canteenId;
      let url =
        `${orderLunchUrl}` +
        encodeURIComponent(
          `${dianCanUrl}?ticket=ticket&dishId=${dishId}&canteenId=${canteenId}&dd_full_screen=true&date=${date}`
        );

      // console.log('urlxxx', url)
      this.iframeUrl = url;
    }
    // methods: {
    //     setTitle(title) {
    //         if (window.ic) {
    //             ic.run({
    //                 action: "webview.setTitle",
    //                 params: { title },
    //             });
    //         }
    //     },
    // },
  };
</script>

<style lang="scss" scoped>
  .question-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .iframe-class {
    width: 100%;
    height: 100%;
    pointer-events: unset !important;
  }
</style>
