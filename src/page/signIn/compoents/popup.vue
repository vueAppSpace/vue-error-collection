<script>
  import { defineComponent, ref, watch } from "@vue/composition-api";

  export default defineComponent({
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      getPoint: {
        type: Number,
        required: true
      },
      activeData: {
        type: Object,
        required: true
      },
      lastDay: {
        type: Object,
        required: true
      }
    },
    setup(props, ctx) {
      const show = ref(props.modelValue);

      watch(
        () => props.modelValue,
        value => {
          show.value = value;
        }
      );

      function onClose() {
        ctx.emit("update:modelValue", false);
      }

      return { show, onClose };
    }
  });
</script>

<template>
  <van-popup v-model="show" :style="{ padding: '64px' }" :close-on-click-overlay="false">
    <div class="content">
      <img
        class="icon"
        src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/signIn/popup-img.png"
        alt=""
      />
      <div class="title font-regular">
        已获得<span class="font-medium">{{ getPoint }}</span
        >个健康积分
      </div>
      <div class="desc font-regular">
        <p v-if="activeData.sundaySignType === 1 && lastDay.isCurrent === 0">
          {{ activeData.signType === 1 ? "连续" : "累计" }}签到{{ activeData.sundayLimitDays }}天，周日可领取{{
            lastDay.point
          }}积分，
        </p>
        <p>每天都要关注健康哦~</p>
      </div>
      <div class="btn" @click="onClose">知道了</div>
      <img
        class="close"
        src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/signIn/popup-close.png"
        alt=""
        @click="onClose"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
  .content {
    width: 670px;
    height: 516px;
    background: #fff;
    border-radius: 24px;
    position: relative;
    background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/signIn/popup-bg.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding-top: 136px;
    .icon {
      display: block;
      width: 324px;
      height: 198px;
      position: absolute;
      left: 50%;
      top: -86px;
      transform: translateX(-50%);
    }
    .title {
      font-size: 30px;
      line-height: 42px;
      color: #3d3e42;
      span {
        font-size: 36px;
        line-height: 42px;
        color: #f86e11;
      }
    }
    .desc {
      font-size: 28px;
      line-height: 40px;
      color: #3d3e42;
      margin-top: 90px;
    }
    .btn {
      width: 320px;
      height: 80px;
      border-radius: 50px;
      background: #4b7aff;
      position: absolute;
      left: 50%;
      bottom: 40px;
      transform: translateX(-50%);
      font-size: 32px;
      line-height: 80px;
      color: #fff;
    }
    .close {
      display: block;
      width: 72px;
      height: 72px;
      position: absolute;
      left: 50%;
      bottom: -120px;
      transform: translateX(-50%);
    }
  }
</style>
<style>
  .van-popup {
    /* padding: 0 !important; */
    background: rgba(0, 0, 0, 0);
  }
</style>
