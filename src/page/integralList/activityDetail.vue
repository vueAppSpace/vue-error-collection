<script>
  import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  const imagesArr = ["https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/guide/home1.jpg"];
  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        images: [],
        current: 0,
        timer: null
      });

      const randomArr = () => (Math.random() > 0.5 ? -1 : 1);

      const jumpTo = (url, query) => {
        router.push({
          path: url,
          query: query || {
            source: route.value.query.source
          }
        });
      };

      const onChange = idx => (state.current = idx);

      onMounted(() => {
        // state.timer = setTimeout(routerPush, 3000)
        state.images = imagesArr.sort(randomArr);
      });

      onBeforeUnmount(() => {
        clearTimeout(state.timer);
      });

      return {
        ...toRefs(state),
        jumpTo,
        onChange
      };
    }
  });
</script>

<template>
  <div class="guide-box">
    <van-swipe @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="img-item" v-lazy="image" />
      </van-swipe-item>
    </van-swipe>

    <div class="btn" @click="jumpTo('/health')">继续运动</div>
  </div>
</template>

<style lang="scss" scoped>
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .guide-box {
    padding-bottom: 120px;
    .img-item {
      width: 100%;
      height: auto;
    }

    .skip-button {
      position: fixed;
      z-index: 999;
      right: 40px;
      top: 40px;
      width: 124px;
      height: 60px;
      line-height: 60px;
      background: #000;
      border-radius: 30px;
      font-size: 28px;
      color: #fff;
      opacity: 0.3;
    }
  }
  .btn {
    position: fixed;
    left: 32px;
    bottom: 32px;
    width: 686px;
    height: 88px;
    background: #4b7aff;
    border-radius: 44px;

    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 88px;
  }
</style>
