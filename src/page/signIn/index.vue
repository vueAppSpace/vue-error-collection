<script>
  import { defineComponent, ref, reactive, computed } from "@vue/composition-api";
  import Banner from "@/components/banner.vue";
  import Popup from "./compoents/popup.vue";

  export default defineComponent({
    components: {
      Banner,
      Popup
    },
    setup() {
      // TODO banner 类型
      const type = "service";

      // 签到数据
      const weekData = reactive([
        { point: 3, text: "周一", isSigned: 1, isRemind: 0, isCurrent: 0 },
        { point: 3, text: "周二", isSigned: 1, isRemind: 0, isCurrent: 0 },
        { point: 3, text: "周三", isSigned: 0, isRemind: 0, isCurrent: 0 },
        { point: 3, text: "周四", isSigned: 1, isRemind: 0, isCurrent: 0 },
        { point: 3, text: "周五", isSigned: 0, isRemind: 1, isCurrent: 1 },
        { point: 3, text: "周六", isSigned: 0, isRemind: 0, isCurrent: 0 },
        { point: 10, text: "周日", isSigned: 0, isRemind: 0, isCurrent: 0 }
      ]);
      // signType: 签到样式  0 累计、1 连续
      // sundayLimitDays: 要求连续/累计(最小天数)
      // sundaySignType：周日积分获取方式 0 签到领取、1 连续/累计领取
      // TODO isSignedNum: 实际连续/累计天数
      const activeData = reactive({ sundayLimitDays: 3, signType: 0, sundaySignType: 1, isSignedNum: 3 });
      const lastDay = weekData.slice(-1)[0];
      const currentDay = weekData.find(item => item.isCurrent === 1);

      const isDisableSignIn = computed(
        () =>
          currentDay.isSigned === 1 ||
          (activeData.sundaySignType && lastDay.isCurrent === 1 && activeData.isSignedNum < activeData.sundayLimitDays)
      );
      const signText = computed(() => (activeData.signType === 1 ? "连续" : "累计"));

      /* 获取接口数据 */
      getSignInData();
      function getSignInData() {
        console.log("接口获取签到数据");
      }

      /* 控制签到线条样式 */
      function isActiveDayLine(index) {
        return index < weekData.length - 1 && weekData[index].isSigned === 1 && weekData[index + 1].isSigned === 1;
      }

      /* 签到提醒 */
      const isSigned = ref(currentDay.isRemind === 1);
      function toggleRemind(value) {
        console.log("签到提醒" + value);
        currentDay.isRemind = Number(value);
      }

      /* 立即签到弹窗 */
      const popupShow = ref(false);
      function signIn() {
        if (isDisableSignIn.value) return;
        console.log("签到");
        // TODO 调接口，然后更新数据
        popupShow.value = true;
      }

      return {
        type,
        weekData,
        activeData,
        lastDay,
        currentDay,
        isSigned,
        popupShow,
        signText,
        isDisableSignIn,
        toggleRemind,
        isActiveDayLine,
        signIn
      };
    }
  });
</script>

<template>
  <div class="content">
    <Banner class="banner" :type="type" customClass="h-380" />

    <div class="box-style">
      <div class="top">
        <!-- TODO 连续规则 -->
        <div class="title font-medium">
          本周已{{ signText }}签到 <span>{{ activeData.isSignedNum }}</span> 天
        </div>
        <div class="remind-btn">
          <div class="text font-regular">签到提醒</div>
          <van-switch class="switch" v-model="isSigned" @change="toggleRemind" />
        </div>
      </div>
      <div v-if="activeData.sundaySignType === 1" class="desc font-regular">
        {{ signText }}签到{{ activeData.sundayLimitDays }}天，周日可领<span>{{ lastDay.point }}个积分</span>哦～
      </div>
      <div class="week-box">
        <div class="day-box" v-for="(item, index) in weekData" :key="index">
          <div
            class="day-card"
            :class="{
              'isSigned-day-card': item.isSigned === 1,
              'inactive-day-card':
                item.isSigned === 0 && (index < weekData.length - 1 || activeData.sundaySignType === 0),
              'active-day-card': item.isSigned === 0 && index === weekData.length - 1 && activeData.sundaySignType === 1
            }"
          >
            <img
              v-if="item.isSigned === 1"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/signIn/right.png"
              alt=""
            />
            <img
              v-else
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/signIn/star.png"
              alt=""
            />
            <div :class="activeData.sundaySignType === 1 ? 'font-medium' : 'font-regular'">+{{ item.point }}</div>
          </div>
          <div
            class="day-point"
            :class="{
              'inactive-day-point': !item.isSigned === 1,
              'active-day-point': item.isSigned === 1,
              'day-line': index < weekData.length - 1,
              'inactive-day-line': !isActiveDayLine(index),
              'active-day-line': isActiveDayLine(index)
            }"
          ></div>
          <div class="day-text font-regular">{{ item.isSigned === 1 ? "已签" : item.text }}</div>
        </div>
      </div>
      <div class="sign-btn font-medium" :class="{ 'inactive-sign-btn': isDisableSignIn }" @click="signIn">
        {{ currentDay.isSigned === 1 ? "已签到" : "立即签到" }}
      </div>
    </div>

    <Popup
      :modelValue="popupShow"
      @update:modelValue="popupShow = $event"
      :getPoint="currentDay.point"
      :signText="signText"
      :activeData="activeData"
      :lastDay="lastDay"
    />
  </div>
</template>

<style lang="scss" scoped>
  .content {
    min-height: 100%;
    background: #f2f4f8;
    overflow: hidden;
    .banner {
      margin-top: 30px;
    }
    .box-style {
      width: 690px;
      margin: 30px auto 0;
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
      padding: 30px 24px 48px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 32px;
          line-height: 44px;
          color: #1c1c1e;
          span {
            color: #f86e11;
          }
        }
        .remind-btn {
          display: flex;
          align-items: center;
          .text {
            font-size: 22px;
            color: #737782;
            margin-right: 8px;
          }
          .switch {
            font-size: 32px;
          }
        }
      }
      .desc {
        font-size: 26px;
        line-height: 36px;
        color: #565961;
        text-align: left;
        margin-top: 12px;
        span {
          color: #f86e11;
        }
      }
      .week-box {
        display: flex;
        justify-content: space-between;
        margin-top: 22px;
        .day-box {
          width: 80px;
          .day-card {
            width: 80px;
            height: 108px;
            border-radius: 16px;
            padding-top: 12px;
            img {
              display: block;
              width: 64px;
              height: 64px;
              object-fit: contain;
              margin: 0 auto;
            }
            div {
              font-size: 24px;
              line-height: 24px;
            }
          }
          .isSigned-day-card {
            background: linear-gradient(180deg, #4b7aff 0%, #4ea7ff 100%);
            div {
              color: #fff;
            }
          }
          .inactive-day-card {
            background: #f2f4f8;
            div {
              color: #f86e11;
            }
          }
          .active-day-card {
            background: #ffeed6;
            div {
              color: #c6470b;
            }
          }

          .day-point {
            width: 20px;
            height: 20px;
            margin: 24px auto 0;
            position: relative;
            &::after {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }
            &.inactive-day-point {
              &::after {
                background: #f2f4f8;
              }
            }
            &.active-day-point {
              &::after {
                background: #4b7aff;
              }
            }
          }
          .day-line {
            &::before {
              content: "";
              width: 92px;
              height: 4px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateY(-50%);
            }
            &.inactive-day-line {
              &::before {
                background: #f2f4f8;
              }
            }
            &.active-day-line {
              &::before {
                background: #4b7aff;
              }
            }
          }
          .day-text {
            font-size: 24px;
            line-height: 34px;
            color: #737782;
            margin-top: 8px;
          }
        }
      }
      .sign-btn {
        width: 480px;
        height: 80px;
        background: linear-gradient(310deg, #4b7aff 0%, #4ea7ff 100%);
        box-shadow: 0px 4px 16px 0px rgba(76, 134, 255, 0.37);
        border-radius: 40px;
        margin: 40px auto 0;
        font-size: 30px;
        line-height: 80px;
        color: #fff;
        &.inactive-sign-btn {
          opacity: 0.2;
        }
      }
    }
  }
</style>
