<template>
  <div :id="eventCode" v-if="userEmotion && userEmotion.length > 0">
    <div class="top" id="emotion">
      <div class="time">
        {{ userPlan.time }}
        <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
      </div>
      <div class="title flex-between">
        <div class="left flex-center">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/xinlizixun.png" />

          <div>
            <div v-if="userPlan.event_code == 'yinpin'">自己给自己的关爱, 是前进的动力。</div>
            <div v-else-if="userPlan.event_code == 'shuiqianyoushengshu'">安抚疲惫一天的身心</div>
            <div v-else-if="userPlan.event_code == 'zhumianyinyue'">好的睡眠, 为身心充能!</div>
          </div>
        </div>
        <van-checkbox class="check-box" v-model="checked" :disabled="lockCheck" @click="onCheck" />
      </div>
    </div>
    <div class="waitered audio" v-if="userEmotion && userEmotion.length > 0">
      <div class="repast" @click="onPlay">
        <img class="repastImg" :src="userEmotion[idx].image" />
        <img
          class="audioTag"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/audioTag.png"
        />
        <img
          class="audioRefresh"
          @click.stop="audioRefreshHandle"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/audio_refresh.png"
        />
        <div class="audioInfo">
          <div class="audioTop flex-between">
            <div class="audioName">{{ userEmotion[idx].name }}</div>
            <!-- <div class="playTimes flex-center">
                            <img
                                class="sanjiaoRight"
                                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/sanjiaoRight.png"
                            />
                            <span>{{ userEmotion.playCount }}次</span>
                        </div> -->
          </div>
          <div class="audioBottom">{{ userEmotion[idx].intro }}</div>
        </div>
      </div>
    </div>

    <van-popup class="video-popup" v-model="showPlayAudio">
      <img
        class="closeBtn"
        @click="closeAudio"
        v-if="showPlayAudio"
        src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/clsoeBtn.png"
      />
      <audio-player
        v-if="showPlayAudio"
        ref="audio"
        :loop="false"
        :audioUrl="userEmotion[idx].url"
        :title="userEmotion[idx].name"
        :content="userEmotion[idx].intro"
      ></audio-player>
    </van-popup>
  </div>
</template>

<script>
  import { formatTimeForBirth } from "@/utils/commonFun";
  import { getUserEmotion, getUserEmotion2, interestSave, queryInterestByUserId } from "@/service/api";

  import audioPlayer from "../audioPlayer.vue";

  export default {
    components: {
      audioPlayer
    },
    props: {
      userPlan: {
        type: Object,
        default: {}
      },
      eventCode: {
        type: String
      },
      userEmotion: {
        type: Array
      }
    },
    data() {
      return {
        lockCheck: false,
        checked: false,
        showPlayAudio: false,
        userEmotionArr: [],
        // userEmotion: {},
        idx: 0
      };
    },
    mounted() {
      // this.getUserEmotion2Fn(true);

      this.queryInterestByUserIdFn();
    },
    activated() {
      // this.getUserEmotion2Fn(true);
    },
    methods: {
      audioRefreshHandle() {
        this.idx += 1;
        if (this.idx > this.userEmotion.length - 1) {
          this.idx = 0;
        }
        let name = "";
        if (this.eventCode == "shuiqianyoushengshu" || this.eventCode == "zhumianyinyue") {
          name = "晚间情致";
        } else if (this.eventCode == "yinpin") {
          name = "午间情致";
        }
        this.zgStatistics("健康新奥-健康-点击换一换", {
          类别: name,
          内容名称: this.userEmotion[this.idx].name ? this.userEmotion[this.idx].name : ""
        });
      },
      onCheck() {
        if (this.lockCheck) {
          return false;
        }
        interestSave({
          code: this.userEmotion[this.idx].id,
          name: this.userEmotion[this.idx].name,
          duration: Math.ceil(this.userEmotion[this.idx].resDruation / 60),
          type: 2,
          timePoint: this.userPlan.time
        }).then(({ code, message }) => {
          if (code === 0) {
            this.lockCheck = true;
          } else {
            //console.log(message);
          }
        });

        let name = "";
        if (this.eventCode == "shuiqianyoushengshu" || this.eventCode == "zhumianyinyue") {
          name = "晚间情致";
        } else if (this.eventCode == "yinpin") {
          name = "午间情致";
        }
        this.zgStatistics("健康新奥-点击’打卡‘类型按钮", {
          按钮名称: "健康打卡",
          所属功能: "健康",
          频道: name,
          类型: "健康打卡",
          时间: this.userPlan.time
        });
      },
      onPlay() {
        this.showPlayAudio = true;
        setTimeout(() => {
          let audio = this.$refs.audio;
          audio.onPlay();
        }, 1000);

        this.zgStatistics("健康新奥-健康-点击其他具体内容", {
          频道: "情致",
          按钮名称: this.userEmotion.name ? this.userEmotion.name : "",
          时间: this.userPlan.time,
          标签: "概念"
        });
      },
      closeAudio() {
        this.showPlayAudio = false;
      },
      async getUserEmotion2Fn(isRefresh) {
        try {
          let param = {
            refresh: isRefresh
          };
          const { code, data, message } = await getUserEmotion2(param);
          //console.log("情志推荐:哄睡专家", code, data, message);
          if (code === 0) {
            if (data) {
              if (this.eventCode == "yinpin") {
                if (data.prescriptionDTOs && data.prescriptionDTOs.length) {
                  this.userEmotion = data.prescriptionDTOs;
                } else {
                  this.userEmotion = [];
                }
              } else if (this.eventCode == "shuiqianyoushengshu") {
                if (data.sleepHelps && data.sleepHelps.length) {
                  this.userEmotion = data.sleepHelps;
                } else {
                  this.userEmotion = [];
                }
              } else if (this.eventCode == "zhumianyinyue") {
                if (data.bedtimeDTOS && data.bedtimeDTOS.length) {
                  this.userEmotion = data.bedtimeDTOS;
                } else {
                  this.userEmotion = [];
                }
              }

              // if (!this.userEmotion.playCount) {
              //     this.userEmotion.playCount = 0;
              // }
            }
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      queryInterestByUserIdFn() {
        queryInterestByUserId({
          date: formatTimeForBirth(new Date()),
          timePoint: this.userPlan.time
        }).then(({ code, data, message }) => {
          // //console.log("情志是否已标记：", code, data, message);
          if (code === 0) {
            if (data && data.length) {
              this.checked = this.lockCheck = true;
            }
          } else {
            //console.log(message);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .top {
    text-align: left;
    color: #1c1c1e;
    .time {
      height: 56px;
      line-height: 56px;
      font-size: 30px;
      font-weight: bold;
      span {
        font-size: 24px;
        font-weight: normal;
      }
    }
    .title {
      height: 60px;
      margin-top: 16px;
      .left {
        img {
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }
        font-size: 28px;
        font-weight: bold;
      }
      .right {
        padding: 0 24px;
        height: 48px;
        border-radius: 44px;
        line-height: 48px;
        border: 1px solid #d0d4dc;
        color: #565961;
        font-size: 24px;
      }
    }
  }
  .waitered {
    margin-top: 36px;
    color: #1c1c1e;
    font-size: 28px;
    .orderBox {
      height: 48px;
      margin-bottom: 16px;
      .title {
        position: relative;
        .bg-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 12px;
          background: #4b7aff;
          opacity: 0.3;
        }
      }
      .btn {
        width: 144px;
        height: 48px;
        background: #4b7aff;
        border-radius: 44px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
      }
    }

    .repast {
      position: relative;

      .repastImg {
        width: 648px;
        height: 322px;
        background: #d8d8d8;
        border-radius: 16px;
      }
      .audioTag {
        position: absolute;
        right: 24px;
        top: 24px;
        width: 50px;
        height: 50px;
      }
      .audioRefresh {
        position: absolute;
        right: 24px;
        top: 89px;
        width: 54px;
        height: 54px;
      }
      .audioInfo {
        position: absolute;
        left: 24px;
        right: 68px;
        top: 202px;
        font-size: 36px;
        color: #fff;
        text-align: left;
        .audioTop {
          width: 526px;
          height: 50px;
          .audioName {
            width: 360px;
            flex-shrink: 0;
            line-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 10px;
          }
          .playTimes {
            width: 155px;
            height: 40px;
            background: #666262;
            border-radius: 20px;
            /* opacity: 0.8; */
            font-size: 26px;
            line-height: 40px;
            position: relative;
            .sanjiaoRight {
              width: 16px;
              height: 26px;
              margin-left: 22px;
              margin-right: 10px;
            }
          }
        }
        .audioBottom {
          font-size: 28px;
          margin-top: 6px;
          width: 570;
          line-height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .name {
        position: absolute;
        left: 24px;
        top: 316px;
        font-size: 28px;
        color: #ffffff;
        z-index: 105;
      }
      .opacityBac {
        position: absolute;
        left: 0;
        width: 648px;
        top: 292px;
        height: 88px;
        background-color: #000000;
        opacity: 0.3;
        border-radius: 0 0 16px 16px;
        z-index: 102;
      }
    }
    .repastTip {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 40px;
    }
  }
  .video-popup {
    width: 100%;
    background-color: transparent;
  }
  .closeBtn {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
  }
  .check-box {
    ::v-deep.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
      color: #fff;
      background-color: #1989fa;
      border-color: #1989fa;
    }
  }
</style>
