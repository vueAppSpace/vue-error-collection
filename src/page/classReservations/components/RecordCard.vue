<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:35:20
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\components\RecordCard.vue
 * @Description: 动感团操 - 约课记录卡片
-->

<template>
  <div class="item-card">
    <div class="left">
      <div class="courseName">
        {{ courseName }}
      </div>
      <div class="clockTimerArea">
        <img src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/clock.png" />
        <div class="timerText">
          {{ timerText }}
        </div>
      </div>
      <div class="locationArea">
        <img
          src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/location.png"
        />
        <div class="locationText">{{ gym.address + "" + gym.name }}</div>
      </div>
    </div>

    <!-- 未完成 和 进行中 记录 -->
    <template v-if="type == RecordState.notFinish && signBtnText">
      <div class="btnText" @click="handleClick" :class="{ active: signBtnText == activeBtnText }">
        {{ signBtnText }}
      </div>
    </template>

    <!-- 已经完成记录: 上过课，未上过课 -->
    <template v-else-if="type == RecordState.finished && reportUrl">
      <div class="btnText" @click="handleClick">查看报告</div>
    </template>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";
  import { CheckinState, CheckinProgressState, RecordState } from "../util/constant";

  export default defineComponent({
    props: {
      //根据type区分是 0.未完成 1.已完成
      type: {
        type: String | Number,
        default: "" | 0
      },
      reportUrl: {
        type: String,
        default: ""
      },
      classId: {
        type: String | Number,
        default: "" | 0
      },
      courseName: {
        type: String,
        default: ""
      },
      startTimeText: {
        type: String,
        default: ""
      },
      endTimeText: {
        type: String,
        default: ""
      },
      checkin: {
        type: Number,
        default: 0
      },
      checkinProgress: {
        type: Number,
        default: 0
      },
      //体育馆
      gym: {
        type: Object,
        default: () => {}
      }
    },
    setup(
      { classId, maxNumber, subNumber, startTimeText, endTimeText, type, reportUrl, checkin, checkinProgress },
      context
    ) {
      const { emit } = context;

      const state = reactive({
        CheckinState,
        CheckinProgressState,
        RecordState,
        activeBtnText: "绑定设备"
      });

      const timerText = computed(() => {
        return startTimeText + "~" + endTimeText;
      });

      //签到按钮文本计算属性
      const signBtnText = computed(() => {
        let text = "";
        if (CheckinState.notSign == checkin) {
          if (CheckinProgressState.no_sign_time == checkinProgress) {
            text = "等待开始";
          } else if (CheckinProgressState.in_sign_time == checkinProgress) {
            text = state.activeBtnText;
          } else if (CheckinProgressState.out_sign_time == checkinProgress) {
            text = "已迟到";
          }
        } else if (CheckinState.signed == checkin) {
          text = state.activeBtnText;
        }

        return text;
      });

      function handleClick() {
        if (RecordState.notFinish == type) {
          if (signBtnText.value == state.activeBtnText) {
            emit("click", { classId });
          }
        } else if (RecordState.finished == type) {
          emit("click", { reportUrl });
        }
      }

      return {
        ...toRefs(state),
        timerText,
        signBtnText,
        handleClick
      };
    }
  });
</script>

<style lang="scss" scoped>
  .item-card {
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular, PingFang SC;
    padding: 24px;
    padding-bottom: 30px;
    text-align: left;
    background: #ffffff;
    border-radius: 16px;
    align-items: center;

    .left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .courseName {
      font-size: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1c1c1e;
      line-height: 42px;
    }

    .clockTimerArea {
      display: flex;
      align-items: center;
      margin-top: 8px;

      .timerText {
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #737782;
        margin-left: 8px;
      }

      img {
        display: block;
        width: 24px;
        height: 24px;
      }
    }

    .locationArea {
      display: flex;
      align-items: center;
      margin-top: 16px;
      min-height: 48px;
      background: #fdf4e7;
      border-radius: 8px;
      padding: 4px 6px;

      .locationText {
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f86e11;
        margin-left: 8px;
      }

      img {
        display: block;
        width: 32px;
        height: 32px;
      }
    }

    .btnText {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 136px;
      height: 56px;
      min-width: 136px;
      background: #edf1ff;
      border-radius: 30px;
      font-size: 26px;
      font-weight: 400;
      color: #4b7aff;
      margin-left: 30px;

      &.active {
        background: #4b7aff;
        color: #ffffff;
      }
    }
  }
</style>
