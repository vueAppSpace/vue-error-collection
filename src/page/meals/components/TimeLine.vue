<template>
  <div class="time">
    {{ userPlan.time }}
    <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      userPlan: {
        type: Object,
        default: {}
      }
    }
  };
</script>

<style lang="scss" scoped>
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
</style>
