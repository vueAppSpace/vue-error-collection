<!--
 * @Description: 健康计划视频播放控件
 * @Author: IFLS
 * @Date: 2022-06-24 09:54:10
 * @LastEditTime: 2023-03-28 09:58:56
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { Toast } from "vant";
  import playerOptions from "@/utils/playerOptions";
  import { queryHealthPlan } from "@/service/mine";
  import { formatVideoTime } from "@/utils/commonFun";
  export default defineComponent({
    props: {
      // 只展示视频
      onlyVideo: {
        type: Boolean,
        defatul: true
      },
      imgUrl: {
        type: "String",
        default: ""
      },
      videoUrl: {
        type: "String",
        default: ""
      }
    },
    setup(_, context) {
      const refs = context.refs;

      const state = reactive({
        loading: true,
        sportsData: [],
        showCard: true,
        playerOptions,
        showPlay: false,
        isFullscreen: undefined
      });

      const queryList = () => {
        queryHealthPlan().then(({ code, data, message }) => {
          if (code === 0) {
            if (data) {
              state.sportsData = [];
              data.aiSportsAerobicDTO && state.sportsData.push(data.aiSportsAerobicDTO);
              data.aiSportsStretchDTO && state.sportsData.push(data.aiSportsStretchDTO);
              data.aiSportsWarmUpDTO && state.sportsData.push(data.aiSportsWarmUpDTO);
              data.aiSportsStrengthDTO && state.sportsData.push(data.aiSportsStrengthDTO);
              state.loading = false;
            } else {
              state.showCard = false;
            }
          } else {
            // Toast(message)
            console.log("queryHealthPlan", message);
            state.showCard = false;
          }
        });
      };

      const onPlay = videoUrl => {
        state.playerOptions.sources[0].src = videoUrl;
        state.showPlay = true;
        // 延迟1s留出组件加载及视频加载时间
        setTimeout(() => {
          refs.videoPlayer.player.play();
        }, 1000);
      };

      const onPlayerTimeupdate = player => {
        if (!ic.isIOS && !ic.isAndroid) {
          // isFullscreen_: 未点击undefined 点击全屏true 关闭全屏false
          if (player.player_.isFullscreen_ === state.isFullscreen) return;
          // 避免函数多次调用
          state.isFullscreen = player.player_.isFullscreen_;
          // 点击全屏
          if (player.player_.isFullscreen_ === true) {
            // 静音
            document.getElementsByTagName("video")[0].muted = true;
            ic.run({
              action: "util.openModal",
              params: {
                title: "视频详情",
                url: state.playerOptions.sources[0].src
              }
            });
            // 关闭全屏
          } else if (player.player_.isFullscreen_ === false) {
            // 恢复声音
            document.getElementsByTagName("video")[0].muted = false;
          }
        }
      };

      onMounted(queryList);

      return {
        ...toRefs(state),
        onPlay,
        onPlayerTimeupdate,
        formatVideoTime
      };
    }
  });
</script>

<template>
  <div>
    <img :src="imgUrl" @click="onPlay(videoUrl)" />
    <div class="video-popup" v-if="showPlay"> </div>

    <video-player
      v-if="showPlay"
      class="video-player"
      ref="videoPlayer"
      :webkit-playsinline="true"
      :x-webkit-airplay="true"
      :playsinline="true"
      :options="playerOptions"
      @timeupdate="onPlayerTimeupdate($event)"
    ></video-player>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    padding: 20px 0 20px 20px;
    margin-bottom: 30px;
    text-align: left;
    position: relative;
    z-index: 78888;
  }

  .title {
    font-size: 40px;
    font-weight: 500;
    color: #1c1c1e;
  }
  .subtitle {
    padding: 12px 0 28px;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1c1c1e;
  }
  .sport {
    display: flex;
    justify-content: flex-start;
    overflow-y: hidden;
    overflow-x: auto;
    width: 100%;
    .sport-item-box {
      display: flex;
      justify-content: flex-start;
    }
    .video-total-title {
      width: 76px;
      height: 158px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      padding: 0 12px;
      font-size: 22px;
      font-weight: 400;
      color: #3d3e42;
      background: linear-gradient(135deg, #ffd7f0 0%, #d4f4ff 100%);
      border-image: linear-gradient(135deg, rgba(250, 164, 225, 1), rgba(198, 232, 248, 1)) 1 1;
      border-radius: 8px;
    }
    .video-item {
      width: 270px;
      height: 158px;
      margin-right: 8px;
      border-radius: 8px;

      .video-cover-img {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img {
            width: 70px;
            height: 70px;
          }
        }
        .play-icon:active {
          filter: brightness(0.5);
          transition: 0.2s;
        }
        .video-bottom {
          position: absolute;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 40px;
          padding: 0 8px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0px 0px 8px 8px;
          backdrop-filter: blur(1px);
        }
        .video-description {
          font-size: 22px;
          font-weight: 400;
          color: #3d3e42;
        }
      }
    }
  }
  .video-popup {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .mt10 {
    margin-top: 10px;
  }
  .mt30 {
    margin-top: 30px;
  }
</style>
