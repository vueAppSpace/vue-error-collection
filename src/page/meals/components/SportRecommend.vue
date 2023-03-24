<template>
  <div class="sport-box">
    <div class="left-box">
      <div class="text">运动风险</div>
      <div class="value">{{ item.riskLevel }}</div>
    </div>
    <div class="line"></div>

    <div class="middle-box">
      <div class="text">运动消耗</div>
      <div class="value">{{ item.targetHeat }}kcal</div>
    </div>
    <div class="line"></div>

    <div class="right-box">
      <div class="text">运动等级</div>
      <div class="value">{{ item.intensity }}</div>
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
  .sport-box {
    height: 132px;
    color: #3d3e42;
    font-size: 24px;
    padding: 0 34px 0 24px;
    line-height: 34px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: saturate(150%) blur(35px);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    .line {
      width: 2px;
      height: 48px;
      opacity: 0.31;
      background: #4b7aff;
    }
    .value {
      font-size: 32px;
      color: #4b7aff;
      line-height: 38px;
    }
  }
</style>
