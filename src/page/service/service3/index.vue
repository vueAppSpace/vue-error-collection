<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import Service from "./components/service";
  import { getHealthShufflingFigure, bannerAddClick } from "@/service/service";
  import useNavigate from "@/hooks/useNavigate";

  export default defineComponent({
    components: {
      Service
    },
    setup(_, ctx) {
      const { $router: router } = ctx.root;
      const autoplay = ref(3000);
      const bannerList = ref([]);

      getHealthShufflingFigure({ status: 1, type: "service", pageSize: 1, pageIndex: 1 })
        .then(({ data, code, message }) => {
          if (code === 0) {
            const { duration, imgList } = data[0];
            autoplay.value = duration * 1000;
            bannerList.value = imgList;
          } else {
            console.log("getHealthShufflingFigure: ", message);
          }
        })
        .catch(err => {
          console.log("getHealthShufflingFigure: ", err);
        });

      async function jumpTo(url, id) {
        try {
          await bannerAddClick({ id });
        } catch (err) {
          console.log("bannerAddClick", err);
        }

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
  <div class="content">
    <van-swipe v-if="bannerList.length" class="banner box-style t-3d" :autoplay="autoplay" indicator-color="white">
      <van-swipe-item class="t-3d" v-for="item in bannerList" :key="item.id" @click="jumpTo(item.imgHref, item.id)">
        <img class="banner-item t-3d" :src="item.imgUrl" alt="" />
      </van-swipe-item>
    </van-swipe>

    <Service />
  </div>
</template>

<style lang="scss" scoped>
  .content {
    min-height: 100%;
    background: #f2f4f8;
    padding-bottom: 240px;
    overflow: hidden;
    .t-3d {
      transform: translate3d(0, 0, 0);
    }
    .box-style {
      width: 690px;
      margin: 30px auto 0;
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
    }
    .banner {
      height: 300px;
      .banner-item {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
</style>
