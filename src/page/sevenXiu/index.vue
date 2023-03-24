<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { videoCategoryList, getSelectListByType } from "@/service/sevenXiu";
  import List from "./components/list.vue";
  import Banner from "./components/banner";
  import { useVideo, reportAllVideoDuration } from "@/hooks/useVideo";
  import { clickTab, clickViewAll, clickCard } from "./buryPoints";

  export default defineComponent({
    components: {
      Banner,
      List
    },
    setup(_, context) {
      const { _router: router, _route: route, zgStatistics } = context.root;

      // 每日一修
      const jumpTo = () => {
        clickViewAll(zgStatistics);
        router.push("/daily-xiu");
      };

      // 七修 tab
      const tabData = ref([]);
      const active = ref(0);
      getVideoCategoryList();

      async function getVideoCategoryList() {
        try {
          const { success, data, msg } = await getSelectListByType({ dictType: "xinaohealth_catalogue_type" });
          if (success) {
            const catalogue = data.find(item => item.dictValue === "七修养生");
            if (!catalogue) return;

            videoCategoryList({ catalogueType: catalogue.dictId })
              .then(({ code, data, message }) => {
                if (code === 0) {
                  tabData.value = data;
                } else {
                  console.log("videoCategoryList", message);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            console.log("getSelectListByType", msg);
          }
        } catch (error) {
          console.log(error.message);
        }
      }

      // 视频播放器
      const videoData = useVideo(true);

      return {
        tabData,
        active,
        jumpTo,
        clickTab,
        clickCard,
        ...videoData
      };
    },
    deactivated() {
      reportAllVideoDuration(this.zgStatistics);
    }
  });
</script>

<template>
  <div class="box">
    <div class="box-top">
      <div class="title font-medium">
        <div class="title-left">每日一修</div>
        <div class="title-right" @click="jumpTo">
          <div class="font-regular">查看全部</div>
          <img
            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/sevenXiu/arrow_right.png"
            alt=""
          />
        </div>
      </div>
      <Banner @playVideo="playVideo" @clickCard="clickCard" />
    </div>

    <div class="box-tab">
      <van-tabs
        v-model="active"
        shrink
        :line-width="32"
        :line-height="8"
        title-inactive-color="#565961"
        title-active-color="#4B7AFF"
        animated
        @click="clickTab"
      >
        <van-tab :title="item.categoryName" v-for="item in tabData" :key="item.id"
          ><List :id="item.id" :type="item.categoryName" @playVideo="playVideo" @clickCard="clickCard"
        /></van-tab>
      </van-tabs>
    </div>

    <van-popup
      :class="['video-popup', { activeIphoneX: adjustCloseBtn }]"
      v-model="showPlay"
      closeable
      get-container="#app"
    >
      <video-player
        v-if="showPlay"
        v-show="showVideo"
        ref="videoPlayer"
        :webkit-playsinline="true"
        :x-webkit-airplay="true"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    padding: 32px 0;
    .box-top {
      padding: 0 32px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #1e201e;
        margin-bottom: 24px;
        .title-left {
          font-size: 36px;
        }
        .title-right {
          display: flex;
          align-items: center;
          font-size: 24px;
          img {
            width: 12px;
            height: auto;
            margin-left: 10px;
          }
        }
      }
    }
    .box-tab {
      margin-top: 40px;
      ::v-deep .van-tabs--line .van-tabs__wrap {
        height: auto;
        padding: 0 32px;
      }
      ::v-deep .van-tab {
        flex: none;
        margin-right: 80px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        font-size: 28px;
        line-height: 40px;
        padding: 0;
      }
      ::v-deep .van-tab--active {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-size: 36px;
        line-height: 50px;
      }
      ::v-deep .van-tabs__line {
        background: linear-gradient(270deg, rgba(130, 178, 255, 0.2) 0%, #4b7aff 100%);
        border-radius: 4px;
        bottom: 0;
      }
    }
  }
  .video-popup {
    width: 100%;
    // height: 100vh;
    background-color: transparent;
  }
  .activeIphoneX {
    ::v-deep.van-popup__close-icon--top-right {
      top: 108px;
      font-size: 64px;
    }
  }
</style>
