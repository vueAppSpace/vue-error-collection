<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:35:18
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\components\ClassCard.vue
 * @Description: 动感团操 - 课程卡片
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
      <div class="tipText">
        {{ tipText }}
      </div>
    </div>

    <div class="btnText" @click="handleClick" :class="{ disable: optStatus !== OptStatusMap.booking }">
      {{ OptStatusTextMap[optStatus] }}
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";

  import { OptStatusTextMap, OptStatusMap } from "../util/constant";

  export default defineComponent({
    props: {
      index: {
        type: Number,
        default: 0
      },
      courseName: {
        type: String,
        default: ""
      },
      startDateText: {
        type: String,
        default: ""
      },
      endDateText: {
        type: String,
        default: ""
      },
      maxNumber: {
        type: Number,
        default: 0
      },
      subNumber: {
        type: Number,
        default: 0
      },
      optStatus: {
        type: Number,
        default: 0
      }
    },
    setup(props, context) {
      const { emit } = context;
      const state = reactive({
        OptStatusTextMap,
        OptStatusMap
      });

      const timerText = computed(() => {
        return props.startDateText + "~" + props.endDateText;
      });

      const tipText = computed(() => {
        if (props.subNumber < props.maxNumber) {
          return `剩余${props.maxNumber - props.subNumber}个名额，请尽快预约！`;
        } else {
          return `已约满，赶紧约其他课程吧！`;
        }
      });

      function handleClick() {
        if (props.optStatus === OptStatusMap.booking) {
          emit("click", props.index);
        }
      }

      return {
        ...toRefs(state),
        timerText,
        tipText,
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

    .tipText {
      margin-top: 22px;
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #f86e11;
      background-color: #fdf4e7;
      border-radius: 8px;
      padding: 6px 12px;
    }

    .btnText {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 136px;
      height: 56px;
      min-width: 136px;
      background: #4b7aff;
      border-radius: 30px;
      font-size: 26px;
      font-weight: 400;
      color: #ffffff;
      margin-left: 30px;

      &.disable {
        font-size: 26px;
        font-weight: 400;
        color: #4b7aff;
        background: #edf1ff;
        border-radius: 30px;
      }
    }
  }
</style>
