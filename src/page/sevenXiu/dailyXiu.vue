<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { healthEverydayStudy } from "@/service/sevenXiu";
  import { useVideo, reportAllVideoDuration } from "@/hooks/useVideo";

  export default defineComponent({
    setup() {
      const pageData = { pageIndex: 1, pageSize: 10, status: 1 };
      const loading = ref(false);
      const finished = ref(false);
      const list = ref([]);

      function onLoad() {
        //console.log("loading");
        healthEverydayStudy(pageData)
          .then(({ code, data, message }) => {
            if (code === 0) {
              list.value = list.value.concat(data);
              pageData.pageIndex++;
              loading.value = false;
              if (data.length < pageData.pageSize) {
                finished.value = true;
              }
            } else {
              loading.value = false;
              finished.value = true;
              //console.log("healthEverydayStudy: ", message);
            }
          })
          .catch(err => {
            loading.value = false;
            finished.value = true;
            //console.log(err);
          });
      }

      const videoData = useVideo(true);

      return {
        list,
        loading,
        finished,
        onLoad,
        ...videoData
      };
    },
    beforeDestroy() {
      reportAllVideoDuration(this.zgStatistics);
    }
  });
</script>

<template>
  <div class="box">
    <van-list class="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div
        class="video-box"
        v-for="item in list"
        :key="item.id"
        @click="playVideo({ ...item, type: item.source, name: item.info })"
      >
        <img class="cover" :src="item.imgUrl" alt="" />
        <div class="play-icon">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/sevenXiu/video_2.png" />
        </div>
      </div>
    </van-list>

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
    padding: 32px;
    .list {
      .video-box {
        position: relative;
        margin-bottom: 24px;
        .cover {
          display: block;
          width: 686px;
          height: 282px;
          border-radius: 24px;
          object-fit: cover;
        }
        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img {
            display: block;
            width: 90px;
            height: 90px;
          }
        }
      }
    }
  }
  .video-popup {
    width: 100%;
    background-color: transparent;
  }
  .activeIphoneX {
    ::v-deep.van-popup__close-icon--top-right {
      top: 108px;
      font-size: 64px;
    }
  }
</style>
