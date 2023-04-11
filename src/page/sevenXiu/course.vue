<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { videoInfoList } from "@/service/sevenXiu";
  import { useVideo, reportAllVideoDuration } from "@/hooks/useVideo";

  export default defineComponent({
    setup(_, ctx) {
      const list = ref([]);
      const { query: query } = ctx.root._route;
      videoInfoList({ categoryId: query.categoryId, courseId: query.courseId })
        .then(({ code, data, message }) => {
          if (code === 0) {
            list.value = list.value.concat(data);
          } else {
            //console.log("healthEverydayStudy: ", message);
          }
        })
        .catch(err => {
          //console.log(err);
        });

      // 视频播放器
      const videoData = useVideo(true);

      return {
        list,
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
    <div
      class="video-box"
      v-for="item in list"
      :key="item.id"
      @click="playVideo({ ...item, type: item.categoryName, name: item.videoName })"
    >
      <img class="cover" :src="item.videoImgUrl" alt="" />
      <div class="play-icon">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/sevenXiu/video_2.png" />
      </div>
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
    padding: 32px;
    .video-box {
      position: relative;
      margin-bottom: 24px;
      .cover {
        display: block;
        width: 686px;
        height: 320px;
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
