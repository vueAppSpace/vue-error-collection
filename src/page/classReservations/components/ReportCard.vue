<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:35:21
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\components\ReportCard.vue
 * @Description: 动感团操 - 运动报告卡片
-->

<template>
  <div class="item-card" :class="{ exception: reportStatusText }">
    <div class="label" v-if="reportStatusText">{{ reportStatusText }}</div>
    <div class="classCardWrap" :class="{ exception: reportStatusText }">
      <div>
        <div class="courseNameArea">
          <div class="courseName">
            {{ courseName }}
          </div>
          <div class="starArea">
            <template v-for="(item, index) in starArray">
              <template v-if="index < star">
                <img
                  src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/lightStar.png"
                  :key="index"
                />
              </template>
              <template v-else>
                <img
                  src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/greyStar.png"
                  :key="index"
                />
              </template>
            </template>
          </div>
        </div>
        <div class="clockTimerArea">
          <div class="timerText">上课时间：{{ formatDateText }}</div>
        </div>
        <div class="locationArea">
          <div class="locationText">消耗：{{ trainCalorie + "kcal" }}</div>
        </div>
      </div>
      <div class="btnText" @click="handleClick">查看详情</div>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, ref, toRefs } from "@vue/composition-api";
  import { ReportStatusMap } from "../util/constant";

  export default defineComponent({
    props: {
      url: {
        type: String,
        default: ""
      },
      courseName: {
        type: String,
        default: ""
      },
      startDate: {
        type: Number,
        default: 0
      },
      trainCalorie: {
        type: Number,
        default: 0
      },
      star: {
        type: Number,
        default: 0
      },
      reportStatus: {
        type: Number,
        default: 0
      }
    },
    setup({ star, startDate, url, reportStatus }, context) {
      const { emit } = context;

      const formatDateText = ref(dayjs(startDate).format("YYYY-MM-DD HH:mm"));
      const starArray = ref(Array(5).fill(0));
      const reportStatusText = computed(() => {
        if (reportStatus === ReportStatusMap.exception) {
          return "异常";
        } else {
          return "";
        }
      });

      function handleClick() {
        emit("click", url);
      }

      return {
        handleClick,
        starArray,
        formatDateText,
        reportStatusText
      };
    }
  });
</script>

<style lang="scss" scoped>
  .item-card {
    position: relative;

    .label {
      position: absolute;
      right: 0;
      width: 108px;
      height: 46px;
      background: #f55858;
      border-radius: 0px 16px 0px 20px;
      text-align: center;
      line-height: 46px;
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }

    &.exception::before {
      position: absolute;
      display: block;
      content: " ";
      width: 8px;
      height: 100%;
      background-color: #f55858;
      border-radius: 16px 0px 0px 16px;
    }

    .classCardWrap {
      display: flex;
      justify-content: space-between;
      font-family: PingFangSC-Regular, PingFang SC;
      padding: 24px;
      padding-bottom: 30px;
      text-align: left;
      background: #ffffff;
      border-radius: 16px;
      align-items: center;

      &.exception {
        background: #fff2f2;
      }

      .courseNameArea {
        display: flex;
        align-items: flex-start;
        justify-content: center;

        .courseName {
          font-size: 30px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1c1c1e;
          line-height: 42px;
        }

        .starArea {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 30px;
          height: 40px;

          img {
            width: 22px;
            height: 22px;
            margin: 0 3px;
          }
        }
      }

      .clockTimerArea {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .timerText {
          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #f86e11;
        }
      }

      .locationArea {
        display: flex;
        align-items: center;
        margin-top: 10px;
        height: 48px;
        border-radius: 8px;

        .locationText {
          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #9195a1;
        }
      }

      .btnText {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 144px;
        height: 56px;
        border: 2px solid #4b7aff;
        border-radius: 30px;
        font-size: 25px;
        font-weight: 400;
        color: #4b7aff;

        &.disable {
          visibility: hidden;
        }
      }
    }
  }
</style>
