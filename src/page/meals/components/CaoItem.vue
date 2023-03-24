<template>
  <div :id="eventCode">
    <div class="top">
      <div class="time">
        {{ userPlan.time }}
        <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
      </div>
      <div class="title flex-between">
        <div class="left flex-center">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/gongjiancao.png" />
          <span>{{ userPlan.event }}</span>
        </div>
        <!-- <div class="right" @click="toGjc">
                    更多>
                </div> -->
        <button class="check-btn" @click="onCheck">运动打卡</button>
      </div>
    </div>

    <div class="bottom flex">
      <div class="biteCaoItem flex-between" v-for="(item, index) in exerciseWorkList" :key="index" @click="toGjc(item)">
        <div class="dishesvariety">
          <img :src="item.jobSquareImg" />
          <div class="foodNum">{{ item.jobName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { queryExerciseWorkJobList } from "@/service/health/index";
  import jumpToDanao from "@/utils/jumpToDanao";
  export default {
    data() {
      return {
        // exerciseWorkList: [],
      };
    },
    props: {
      userPlan: {
        type: Object,
        default: true
      },
      eventCode: {
        type: String
      },
      exerciseWorkList: {
        type: Array
      }
    },
    methods: {
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      },
      toGjc(item) {
        // this.$router.push('/health');
        if (this.$route.path !== "/health") {
          this.zgStatistics("健康新奥-我的-点击卡片", { 按钮名称: item.jobName, 位置: "焕能工间操" });
        }
        console.log("item", item);
        this.zgStatistics("健康新奥-健康-点击其他具体内容", {
          频道: "工间操",
          按钮名称: item.jobName,
          时间: this.userPlan.time,
          标签: "概念"
        });
        this.$router.push({
          path: "/workBreakExercisesDetail",
          query: {
            id: item.id
          }
        });
      },
      queryExerciseWorkJobListFn() {
        queryExerciseWorkJobList().then(({ code, data, message }) => {
          if (code === 0) {
            this.exerciseWorkList = data;
          } else {
            console.log("queryExerciseWorkJobList", message);
            // Toast(message);
          }
        });
      },
      onCheck() {
        this.zgStatistics("健康新奥-点击’打卡‘类型按钮", {
          按钮名称: "运动打卡",
          所属功能: "健康",
          频道: "工间操",
          类型: "工间操",
          时间: this.userPlan.time
        });
        jumpToDanao(2, "sportList");
      }
    },
    mounted() {
      // this.queryExerciseWorkJobListFn();
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
      position: relative;
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

  .bottom {
    margin-top: 24px;
    margin-right: 24px;
    overflow-x: scroll;
    .biteItem {
      width: 600px;
      height: 350px;
      /* background: #FFFFFF; */
      border-radius: 8px;
      margin-right: 24px;
      .title {
        height: 72px;
        background: linear-gradient(135deg, #f4f1fd 0%, #f1f9fc 100%);
        font-size: 28px;
        color: #3d3e42;
        line-height: 72px;
        text-align: left;
        padding-left: 20px;
        border-radius: 8px 8px 0px 0px;
      }
      .dishesvarietyBox {
        padding: 20px;
        box-shadow: 0px 8px 16px 0px rgba(194, 197, 205, 0.29);
        border-left: 1px solid #f4f1fd;
        width: 600px;
        border-radius: 8px;
        .dishesvariety {
          position: relative;
          width: 176px;

          img {
            width: 176px;
            height: 176px;
            /* background: #D8D8D8; */
            border-radius: 8px;
          }
          .foodName {
            position: absolute;
            left: 0px;
            top: 120px;
            width: 176px;
            height: 56px;
            color: #ffffff;
            line-height: 56px;
            font-size: 28px;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 0px 0px 8px 8px;
          }
          .foodNum {
            position: relative;
          }
          /* .opacityBg{
                                position: absolute;
                                left: 0px;
                                top: 120px;
                                width: 176px;
                                height: 56px;
                                background: #000000;
                                border-radius: 0px 0px 8px 8px;
                                opacity: 0.4;
                                z-index: 100;
                            } */
        }
      }
    }

    .biteCaoItem {
      width: 648px;
      .dishesvariety {
        margin-right: 8px;
        img {
          width: 200px;
          height: 200px;
        }
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

    /* <div class="waitered audio">
                        <div class="repast">
                            <img class="repastImg" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
                            <img class="audioTag" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/audioTag.png" />
                            <div class="audioInfo">
                                <div class="audioTop">
                                    <div class="name">初阶调节心情、舒缓舒缓舒缓</div>
                                    <div class="playTimes">
                                        3240次
                                    </div>
                                </div>
                                <div class="audioBottom">基础呼吸练习，随时助您放松身心，舒缓压呀呀呀呀呀呀呀</div>
                            </div>
                        </div>
            </div> */

    .repast {
      position: relative;
      .repastImg {
        width: 648px;
        height: 380px;
        background: #d8d8d8;
        border-radius: 16px;
      }

      .repastImg2 {
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

  .warmUp {
    margin-top: 24px;
    .left {
      width: 78px;
      height: 158px;
      font-size: 22px;
      line-height: 34px;
      flex-shrink: 0;
      color: #3d3e42;
      padding: 0 14px;
      padding-top: 45px;
      background: linear-gradient(135deg, #ffd7f0 0%, #d4f4ff 100%);
      border-radius: 8px;
      border: 1px solid;
      border-image: linear-gradient(135deg, rgba(250, 164, 225, 1), rgba(198, 232, 248, 1)) 1 1;
    }
    .activeLeft {
      margin-left: 8px;
    }
    .right-sport {
      .item {
        margin-left: 8px;
        position: relative;
        img {
          width: 280px;
          height: 158px;
          border-radius: 8px;
        }
        .sportBg {
          position: absolute;
          left: 0;
          top: 118px;
          width: 280px;
          height: 40px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0px 0px 8px 8px;
          backdrop-filter: blur(1px);
        }
        .sportTextBox {
          position: absolute;
          left: 8px;
          right: 8px;
          top: 118px;
          height: 40px;
          font-size: 22px;
          .text {
            flex-shrink: 0;
            width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
