<template>
  <div :id="eventCode">
    <div class="top" id="article">
      <div class="time">
        {{ userPlan.time }}
        <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
      </div>
      <div class="title flex-between">
        <div class="left flex-center">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/gongjiancao.png" />
        </div>
        <!-- <button class="check-btn" @click="onCheck">健康打卡</button> -->
        <van-checkbox class="check-box" v-model="checked" :disabled="lockCheck" @click="onCheck" />
      </div>
    </div>
    <div class="waitered" v-if="userMission">
      <div class="repast" @click="toArticleDetail">
        <img v-if="userMission.picture" class="repastImg" :src="userMission.picture" />

        <img
          v-else
          class="repastImg"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/xuanjiao.png"
        />

        <div class="name">{{ userMission.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatTimeForBirth } from "@/utils/commonFun";
  import { getUserMission, saveUserMissionRecord, getUserMissionRecord } from "@/service/api";
  // import jumpToDanao from '@/utils/jumpToDanao'

  export default {
    props: {
      userPlan: {
        type: Object,
        default: {}
      },
      eventCode: {
        type: String
      }
    },
    data() {
      return {
        userMission: {},
        lockCheck: false,
        checked: false
      };
    },
    mounted() {
      this.getUserMissionFn();
      this.getUserMissionRecordFn();
    },
    methods: {
      // 获取文章
      async getUserMissionFn() {
        try {
          const { code, data, message } = await getUserMission();
          // //console.log("文章:", code, data, message);
          if (code === 0) {
            this.userMission = data;
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      // 获取用户是否已经看过该文章
      getUserMissionRecordFn() {
        getUserMissionRecord({ dateStr: formatTimeForBirth(new Date()) })
          .then(({ code, data, message }) => {
            //console.log("获取文章是否是已经查看状态:", code, data);
            if (code === 0) {
              if (data) {
                this.checked = this.lockCheck = true;
              }
            } else {
              //console.log(message);
            }
          })
          .catch(error => {
            //console.log(error.message);
          });
      },
      // 文章详情
      toArticleDetail() {
        // //console.log('this.userMission', this.userMission);
        this.zgStatistics("健康新奥-健康-点击其他具体内容", {
          频道: "文章",
          按钮名称: this.userMission.title ? this.userMission.title : "",
          时间: this.userPlan.time,
          标签: "概念"
        });
        this.$router.push("/articleDetail");
      },
      // 点击checkbox保存查看状态
      onCheck() {
        if (this.lockCheck) {
          return false;
        }

        saveUserMissionRecord({
          content: this.userMission.info,
          dateStr: formatTimeForBirth(new Date())
        }).then(({ code, message }) => {
          if (code === 0) {
            this.lockCheck = true;
          } else {
            //console.log(message);
          }
        });

        this.zgStatistics("健康新奥-点击’打卡‘类型按钮", {
          按钮名称: "健康打卡",
          类型: "健康打卡",
          所属功能: "健康",
          频道: "文章",
          时间: this.userPlan.time
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
    .repast {
      position: relative;
      width: 100%;
      height: 380px;
      .repastImg {
        width: 100%;
        height: 100%;
        background: #d8d8d8;
        border-radius: 16px;
        object-fit: cover;
      }

      .name {
        position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 0 0 16px 16px;
        width: 100%;
        height: 88px;
        padding-left: 24px;
        line-height: 88px;
        text-align: left;
        font-size: 28px;
        color: #ffffff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  // .check-btn {
  //     width: 144px;
  //     height: 48px;
  //     font-size: 24px;
  //     color: #fff;
  //     line-height: 48px;
  //     background: #4b7aff;
  //     border-radius: 44px;
  //     border: none;
  // }
  // .check-btn:active {
  //     filter: brightness(0.5);
  //     transition: 0.2s;
  // }

  .check-box {
    ::v-deep.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
      color: #fff;
      background-color: #1989fa;
      border-color: #1989fa;
    }
  }
</style>
