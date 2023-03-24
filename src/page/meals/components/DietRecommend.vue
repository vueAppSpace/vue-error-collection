<template>
  <div class="diet-box">
    <div class="left-box">
      <div class="top">卡路里</div>
      <div class="bottom">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/hot-arrow.png" />
        <span>{{ item.nutr_target.heat }}</span>
      </div>
    </div>
    <div class="right-box">
      <van-circle
        v-model="circle.rate"
        :rate="circle.rate"
        :stroke-width="60"
        size="1.12rem"
        :color="circle.color"
        v-for="circle in item.circleData"
        :key="circle.name"
      >
        <template slot>
          <div class="text-content">
            <div class="rate">{{ circle.rate.toFixed(0) }}</div>
            <div class="name">{{ circle.name }}</div>
          </div>
        </template>
      </van-circle>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: {}
      }
    }
  };
</script>

<style lang="scss" scoped>
  .diet-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 44px;
    color: #1c1c1e;
    font-size: 24px;
    height: 128px;
    .left-box {
      margin-right: 70px;
      text-align: left;
      .top {
        line-height: 34px;
        margin-bottom: 8px;
      }
      .bottom {
        height: 52px;
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 40px;
        }
        span {
          margin-left: 6px;
          font-size: 44px;
          font-weight: bold;
        }
      }
    }
    .right-box {
      display: flex;
      justify-content: space-between;
      flex: 1;
    }
    .text-content {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      margin-left: -56px;
      margin-top: -38px;
      .rate {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #1c1c1e;
        line-height: 40px;
      }
      .name {
        height: 36px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9195a1;
        line-height: 36px;
      }
    }
  }
</style>
