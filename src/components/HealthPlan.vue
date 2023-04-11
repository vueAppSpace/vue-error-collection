<!--
 * @Description: 健康计划视频播放控件
 * @Author: IFLS
 * @Date: 2022-06-24 09:54:10
 * @LastEditTime: 2023-03-31 16:04:52
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import { Toast } from "vant";
  import playerOptions from "@/utils/playerOptions";
  import { queryHealthPlan /*  clockIn, queryClockState */ } from "@/service/mine";
  import { formatVideoTime /* formatTimeForBirth */ } from "@/utils/commonFun";
  import AudioPlayer from "@/page/meals/audioPlayer.vue";
  import jumpToDanao from "@/utils/jumpToDanao";
  import Tips from "@/components/Tips";
  import { videoRecordStart, videoRecordEnd } from "@/hooks/useVideo";
  import { isIcomePC } from "@/utils/native/deviceEnv";
  import { jsBridge } from "@/utils/native/jsBridge";

  export default defineComponent({
    props: {
      // 只展示视频
      onlyVideo: {
        type: Boolean,
        defatul: true
      }
    },
    components: {
      AudioPlayer,
      Tips
    },
    setup(_, context) {
      const {
        refs,
        emit,
        root: { zgStatistics }
      } = context;

      const state = reactive({
        loading: true,
        sportsData: [],
        clockInData: {},
        playerOptions,
        showPlay: false,
        isFullscreen: undefined,
        eleIndex: -1,
        // checked: false,
        lockCheck: false,
        isVideo: true,
        audioOptions: {
          audioUrl: "",
          title: "",
          content: ""
        },
        currentVideoSrc: "",
        currentName: "",
        sportsDataIdx: -1,
        showNextBtn: false,
        currentTouchVideo: {},
        zgPlayData: {}, // 当前播放信息
        exp: 1,
        clockInSuccess: false
      });

      const queryList = () => {
        queryHealthPlan().then(({ code, data, message }) => {
          if (code === 0) {
            // 当天有运动
            if (data) {
              if (data.className) {
                const {
                  aiSportsAerobicDTO,
                  aiSportsStretchDTO,
                  aiSportsWarmUpDTO,
                  aiSportsStrengthDTO,
                  ...clockInData
                } = data;
                state.sportsData = [];
                state.clockInData = clockInData;
                aiSportsWarmUpDTO && state.sportsData.push(aiSportsWarmUpDTO);
                aiSportsAerobicDTO && state.sportsData.push(aiSportsAerobicDTO);
                aiSportsStrengthDTO && state.sportsData.push(aiSportsStrengthDTO);
                aiSportsStretchDTO && state.sportsData.push(aiSportsStretchDTO);
                emit("className", clockInData.className);
              } else {
                // 当天无运动
                state.sportsData = [];
              }
            } else {
              // 不适合运动
              state.sportsData = null;
            }
            state.loading = false;
          }
        });
      };

      // const queryClockIn = () => {
      //     const req = { type: "2", date: formatTimeForBirth(new Date()) };
      //     queryClockState(req).then(({ code, data, message }) => {
      //         if (code === 0) {
      //             if (data && data.length > 0) {
      //                 state.checked = state.lockCheck = true;
      //             }
      //         } else {
      //             //console.log("queryClockIn", message);
      //             // Toast(message);
      //         }
      //     });
      // };

      // const strengthDic = (type) => {
      //     const val = new Map([
      //         ["低等", "1"],
      //         ["中等", "2"],
      //         ["高等", "3"],
      //     ]);
      //     return val.get(type) || null;
      // };

      // const onCheck = () => {
      //     if (state.lockCheck) return;
      //     const { energy: calorie, heartRate: targetRate, intensity, duration } = state.clockInData;
      //     const strength = strengthDic(intensity);
      //     const req = { type: "2", calorie, targetRate, duration, strength };
      //     clockIn(req).then(({ code, data, message }) => {
      //         if (code === 0) {
      //             state.lockCheck = true;
      //             if (data.isAddPoints) {
      //                 state.clockInSuccess = true;
      //                 state.exp = data.healthPoints;
      //             }
      //         } else {
      //             Toast(message);
      //         }
      //     });
      // };

      const onCheck = () => {
        zgStatistics("健康新奥-点击’打卡‘类型按钮", {
          按钮名称: "运动打卡",
          所属功能: "健康",
          频道: "运动",
          类型: "运动",
          时间: "19:30"
        });

        jumpToDanao(2, "sportList");
      };

      const hideNextBtn = () => (state.showNextBtn = false);

      const onPlay = (video, item, idx) => {
        const { actions, exerciseName } = item;
        const url = video.url || actions[0].url;
        const type = url && url.endsWith(".mp4") ? "video/mp4" : "audio/mp3";
        if (type === "video/mp4") {
          state.isVideo = true;
          state.playerOptions.sources[0].type = type;
          state.playerOptions.sources[0].src = url;
          // 当前播放视频在全部视频的索引
          state.sportsDataIdx = idx;
          // 保存当前播放的url
          state.currentVideoSrc = url;
          // 当前播放组的名字
          state.currentName = exerciseName;
          // 保存全部播放列表
          state.playerOptions.sourcesList = actions.map(item => {
            return {
              src: item.url,
              type: "video/mp4"
            };
          });
          // 延迟1s留出组件加载及视频加载时间
          setTimeout(() => {
            refs.videoPlayer.player.play();
            videoRecordStart({ name: video.name, type: item.exerciseName });
            hideNextBtn();
            const zgData = {
              视频名称: video.name,
              视频类别: item.exerciseName,
              所属位置: state.clockInData.className,
              页面名称: "健康",
              视频时长: video.set
            };
            state.zgPlayData = zgData;
            zgStatistics("健康新奥-视频-点击播放", zgData);
          }, 1000);
        } else {
          state.isVideo = false;
          state.audioOptions = {
            audioUrl: url,
            title: video.name,
            content: "音频播放中..."
          };
          setTimeout(() => {
            refs.audio.onPlay();
          }, 1000);
        }
        state.showPlay = true;
      };

      const onPlayerTimeupdate = player => {
        if (isIcomePC) {
          // isFullscreen_: 未点击undefined 点击全屏true 关闭全屏false
          if (player.player_.isFullscreen_ === state.isFullscreen) return;
          // 避免函数多次调用
          state.isFullscreen = player.player_.isFullscreen_;
          // 点击全屏
          if (player.player_.isFullscreen_ === true) {
            // 静音
            document.getElementsByTagName("video")[0].muted = true;
            jsBridge.invoke("openModal", { url: state.playerOptions.sources[0].src });
            // 关闭全屏
          } else if (player.player_.isFullscreen_ === false) {
            // 恢复声音
            document.getElementsByTagName("video")[0].muted = false;
          }
        }
      };

      const onPlayerEnded = () => {
        const { sourcesList } = state.playerOptions;
        let currentVideoSrc = "";
        sourcesList.forEach((v, i) => {
          if (state.currentVideoSrc === v.src) {
            // 当前视频位置
            const index = i === sourcesList.length - 1 ? 0 : ++i;
            zgStatistics("健康新奥-视频-播放完成", state.zgPlayData);
            if (index === 0) {
              Toast({
                duration: 4000,
                message: `${state.currentName} 播放完成`
              });
              state.showNextBtn = true;
              return;
            }
            state.playerOptions.sources = [sourcesList[index]];
            setTimeout(() => {
              refs.videoPlayer.player.play();
            }, 200);
            currentVideoSrc = sourcesList[index].src;
          }
        });
        state.currentVideoSrc = currentVideoSrc;
      };

      const playNextVideo = () => {
        const idx = state.sportsDataIdx;
        const item = state.sportsData[idx + 1];
        // 全部播放完成
        if (!item) {
          Toast({
            duration: 4000,
            message: "视频全部播放完成"
          });
          return;
        }
        const video = item.actions[0];
        onPlay(video, item, idx);
        state.sportsDataIdx = state.sportsDataIdx + 1;
        zgStatistics("健康新奥-健康-运动-点击播放下一组", {
          类型: state.clockInData.className,
          视频类别: item.exerciseName
        });
      };

      // 查询目标离数组元素最近的索引值
      const findLimit = (arr, target) => {
        let newArr = [];
        arr.forEach(x => newArr.push(Math.abs(x - target)));
        const index = newArr.indexOf(Math.min.apply(null, newArr));
        return index;
      };

      const scroll = e => {
        // nodelist伪数组转换为数组
        const arr = [...new Set(e.target.childNodes)];
        // 获取标题宽度
        const titleWidth = e.target.childNodes[0].getElementsByClassName("video-total-title")[0].clientWidth;
        // 获取元素滚动间距
        const eleWidthArr = arr.reduce((total, currentVal, currentIdx) => {
          total.push(currentIdx > 0 ? currentVal.offsetLeft - titleWidth : currentVal.offsetLeft);
          return total;
        }, []);
        const index = findLimit(eleWidthArr, e.target.scrollLeft);
        if (state.eleIndex !== index) {
          state.sportsData[index].index = index;
          state.eleIndex = index;
          zgStatistics("健康新奥-健康-健康运动-点击滚动", {
            视频名称: state.currentTouchVideo.name || "",
            视频类别: state.sportsData[index].exerciseName
          });
          emit("onsrcoll", state.sportsData[index]);
        }
      };

      // 记录当前触摸的视频 用于埋点
      const onVideoTouch = curretVideo => (state.currentTouchVideo = curretVideo);

      onMounted(() => {
        queryList();
        // queryClockIn();
      });

      // 弹窗播放的场景
      watch(
        () => state.showPlay,
        newValue => {
          if (!newValue && state.isVideo) {
            videoRecordEnd();
          }
        }
      );

      return {
        ...toRefs(state),
        onPlay,
        onPlayerTimeupdate,
        onPlayerEnded,
        playNextVideo,
        hideNextBtn,
        formatVideoTime,
        scroll,
        onVideoTouch,
        onCheck
      };
    }
  });
</script>

<template>
  <div :class="{ 'box-card': !onlyVideo }">
    <div v-if="!onlyVideo">
      <van-skeleton title title-width="70" round :row="1" :loading="loading" class="mt10">
        <div class="title">健康计划</div>
        <div class="subtitle">训练课程</div>
      </van-skeleton>
    </div>

    <van-skeleton title-width="70" round :row="3" :loading="loading" class="mt30">
      <div class="containter">
        <!-- <van-checkbox class="check-box" v-model="checked" :disabled="lockCheck" @click="onCheck" v-if="sportsData && sportsData.length > 0"/> -->
        <button v-if="sportsData && sportsData.length > 0" class="check-btn" @click="onCheck">运动打卡</button>
        <div
          :class="['sport', { 'mt-70': sportsData === null || (sportsData && sportsData.length == 0) }]"
          @scroll="scroll"
        >
          <template v-if="sportsData && sportsData.length > 0">
            <div class="sport-item-box" v-for="(item, index) in sportsData" :key="index">
              <div class="video-total-title">
                <span>{{ item.exerciseName }} {{ item.actions.length !== 0 ? item.actions.length + "个" : "" }}</span>
              </div>
              <div class="video-item" v-if="item.actions.length === 0">
                <img
                  class="video-cover-img"
                  src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/walk.png"
                  alt=""
                />
              </div>
              <div v-for="(video, idx) in item.actions" class="video-item" :key="idx">
                <div
                  class="video-cover-img"
                  :style="{ background: 'url(' + (video.img ? video.img : video.firstImg) + ') 0% 0% / 100%' }"
                  @mouseenter="onVideoTouch(video)"
                  @touchmove="onVideoTouch(video)"
                >
                  <div class="play-icon">
                    <img
                      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/video_2.png"
                      @click="onPlay(video, item, index)"
                    />
                  </div>

                  <div class="video-bottom">
                    <div class="video-description" v-if="video.name">
                      {{ video.name.length > 6 ? video.name.slice(0, 6) + "..." : video.name }}
                    </div>
                    <div class="video-description">{{ formatVideoTime(video.duration) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="sportsData && sportsData.length === 0">
            <div class="empty">今日无运动课程</div>
          </template>
          <template v-else>
            <!-- <div class="empty">因您存在健康风险，建议在医生指导下谨慎运动。</div> -->
          </template>
        </div>
      </div>
    </van-skeleton>

    <van-popup class="video-popup" v-model="showPlay" closeable @close="hideNextBtn">
      <video-player
        v-if="showPlay && isVideo"
        class="video-player"
        ref="videoPlayer"
        :webkit-playsinline="true"
        :x-webkit-airplay="true"
        :playsinline="true"
        :options="playerOptions"
        @timeupdate="onPlayerTimeupdate($event)"
        @ended="onPlayerEnded($event)"
      />
      <audio-player
        class="audio-player"
        v-if="showPlay && !isVideo"
        ref="audio"
        :loop="false"
        :audioUrl="audioOptions.audioUrl"
        :title="audioOptions.title"
        :content="audioOptions.content"
      />
      <button class="common-btn fix-btn" v-if="showNextBtn" @click="playNextVideo">播放下一组</button>
    </van-popup>

    <tips :value.sync="clockInSuccess" :exp="exp"> 恭喜您，健康积分+{{ exp }} ! </tips>
  </div>
</template>

<style lang="scss" scoped>
  @import "../assets/less/btn.css";
  @import "../assets/less/checkBtn.css";
  .box-card {
    padding: 20px 0 20px 20px;
    margin-bottom: 30px;
    text-align: left;
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
  .containter {
    position: relative;
    // .check-box {
    //     position: absolute;
    //     right: 0;
    //     top: -74px;
    // }
    ::v-deep.van-checkbox__icon--disabled .van-icon {
      color: #fff;
      background-color: #1989fa;
      border-color: #1989fa;
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
        width: 80px;
        height: 158px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        padding: 0 5px;
        text-align: center;
        font-size: 22px;
        font-weight: 400;
        color: #3d3e42;
        background: linear-gradient(135deg, #ffd7f0 0%, #d4f4ff 100%);
        border-image: linear-gradient(135deg, rgba(250, 164, 225, 1), rgba(198, 232, 248, 1)) 1 1;
        border-radius: 8px;
        overflow: scroll;
        span {
          max-height: 158px;
        }
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
      .empty {
        padding-left: 80px;
        color: #1c1c1e;
        font-size: 24px;
        font-weight: 700;
      }
    }
    .mt-70 {
      margin-top: -70px;
    }
  }

  .video-popup {
    width: 100%;
    // padding-top: 100px;
    background-color: transparent;
    overflow-y: inherit;
    ::v-deep.audio-player {
      margin: 100px auto;
    }
    .fix-btn {
      bottom: -120px;
    }
  }
  .mt10 {
    margin-top: 10px;
  }
  .mt30 {
    margin-top: 30px;
  }
</style>
