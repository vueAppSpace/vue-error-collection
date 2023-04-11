<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { getHealthShufflingFigure, bannerAddClick } from "@/service/service";
  import useNavigate from "@/hooks/useNavigate";

  export default defineComponent({
    name: "banner",
    props: {
      type: {
        type: String,
        required: true
      },
      // 自定义样式类，因为 banner 高度不统一
      customClass: {
        type: String,
        default: "h-300"
      }
    },
    setup(props, ctx) {
      const { $router: router } = ctx.root;
      const autoplay = ref(3000);
      const bannerList = ref([]);

      getHealthShufflingFigure({ status: 1, type: props.type, pageSize: 1, pageIndex: 1 })
        .then(({ data, code, message }) => {
          if (code === 0) {
            const { duration, imgList } = data[0];
            autoplay.value = duration * 1000;
            bannerList.value = imgList;
          } else {
            //console.log("getHealthShufflingFigure: ", message);
          }
        })
        .catch(err => {
          //console.log("getHealthShufflingFigure: ", err);
        });

      async function jumpTo(url, id) {
        try {
          await bannerAddClick({ id });
        } catch (err) {
          //console.log("bannerAddClick", err);
        }

        if (!url) return;
        const { navigateTo } = useNavigate(router);
        navigateTo(url);
      }

      return {
        autoplay,
        bannerList,
        jumpTo
      };
    }
  });
</script>

<template>
  <van-swipe
    v-if="bannerList.length"
    class="banner t-3d"
    :class="customClass"
    :autoplay="autoplay"
    indicator-color="white"
  >
    <van-swipe-item class="t-3d" v-for="item in bannerList" :key="item.id" @click="jumpTo(item.imgHref, item.id)">
      <img class="banner-item t-3d" :src="item.imgUrl" alt="" />
    </van-swipe-item>
  </van-swipe>
</template>

<style lang="scss" scoped>
  .t-3d {
    transform: translate3d(0, 0, 0);
  }
  .banner {
    width: 690px;
    margin: 0 auto;
    border-radius: 16px;
    .banner-item {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .h-300 {
    height: 300px;
  }
  .h-380 {
    height: 380px;
  }
</style>
