<template>
  <div :id="eventCode" v-if="gongFaArr.length > 0">
    <div class="top" id="emotion">
      <div class="time">
        {{ userPlan.time }}
        <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
      </div>
      <div class="title flex-between">
        <div class="left flex-center">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/gongjiancao.png" />

          <div>
            <div>今日功法课程</div>
          </div>
        </div>
        <button class="check-btn" @click="onCheck">运动打卡</button>
      </div>
    </div>
    <div class="waitered audio">
      <div class="repast" @click="toGongFaDetail">
        <img class="repastImg" :src="gongFaArr[idx].img" />
        <img
          class="audioRefresh"
          v-if="gongFaArr.length > 1"
          @click.stop="audioRefreshHandle"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/audio_refresh.png"
        />
        <div class="audioInfo">
          {{ gongFaArr[idx].title }}
        </div>
      </div>
    </div>

    <!-- <van-popup class="video-popup" v-model="showPlayAudio">
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
        </van-popup> -->
  </div>
</template>

<script>
  import { formatTimeForBirth } from "@/utils/commonFun";
  import { searchSuggestGongfa, interestSave, queryInterestByUserId } from "@/service/api";

  import audioPlayer from "../audioPlayer.vue";

  import { gongfaUrl } from "@/config/env";

  import jumpToDanao from "@/utils/jumpToDanao";
  import { useUserStore, mapState } from "@/pinia";

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
      gongFaArr: {
        type: Array,
        default: []
      }
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    data() {
      return {
        lockCheck: false,
        checked: false,
        showPlayAudio: false,
        userEmotion: {},
        idx: 0
      };
    },
    methods: {
      toGongFaDetail() {
        const phrId = this.userInfo.phrId;
        const appKey = "6KRoN5rng";

        const url = `${gongfaUrl}?title=${
          this.gongFaArr[this.idx].title
        }&userId=${phrId}&appKey=${appKey}&dd_full_screen=true&isNavBar=1`;

        console.log("url", url);
        window.location.href = url;
      },
      audioRefreshHandle() {
        this.idx += 1;
        if (this.idx > this.gongFaArr.length - 1) {
          this.idx = 0;
        }
        // let name = '';
        // if (this.eventCode == 'shuiqianyoushengshu' || ( this.eventCode == 'zhumianyinyue' )) {
        //     name = '晚间情致'
        // } else if (this.eventCode == 'yinpin') {
        //     name = '午间情致'
        // }
        // this.zgStatistics('健康新奥-健康-点击换一换', {
        //     '类别': name,
        //     "内容名称": this.userEmotion[this.idx].name ? this.userEmotion[this.idx].name : ''
        // })
      },
      onCheck() {
        this.zgStatistics("健康新奥-点击’打卡‘类型按钮", {
          按钮名称: "运动打卡",
          所属功能: "健康",
          频道: "今日功法课程",
          类型: "今日功法课程",
          时间: this.userPlan.time
        });
        jumpToDanao(2, "sportList");
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
      async searchSuggestGongfaFn() {
        try {
          const { code, data, message } = await searchSuggestGongfa();
          console.log("功法推荐", code, data, message);
          if (code === 0) {
            if (data) {
              this.gongFaArr = data;
            }
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      queryInterestByUserIdFn() {
        queryInterestByUserId({
          date: formatTimeForBirth(new Date()),
          timePoint: this.userPlan.time
        }).then(({ code, data, message }) => {
          // console.log("情志是否已标记：", code, data, message);
          if (code === 0) {
            if (data && data.length) {
              this.checked = this.lockCheck = true;
            }
          } else {
            console.log(message);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/less/checkBtn.css";
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
      position: relative;
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
        height: 380px;
        background: #d8d8d8;
        border-radius: 16px;
        /* border: 1px solid; */
        display: block;
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
        top: 24px;
        width: 54px;
        height: 54px;
      }
      .audioInfo {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        font-size: 28px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: 16px;
        border-bottom-left-radius: 16px;
        text-align: left;
        height: 72px;
        line-height: 72px;
        padding-left: 20px;
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
