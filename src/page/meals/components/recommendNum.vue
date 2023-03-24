<!--
 * @Description: 推荐指数评分
 * @Author: IFLS
 * @Date: 2021-12-23 09:42:38
 * @LastEditTime: 2023-03-23 17:39:38
-->
<template>
  <div class="r-num">
    推荐指数
    <span v-if="isShow">{{ fixNum(rate) }}</span>
    <span>
      <van-rate v-model="rate" :size="14" allow-half readonly color="#FF9C00" void-icon="star" void-color="#ffebcc" />
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      rate: {
        type: Number,
        default: 0
      },
      isShow: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      fixNum(num) {
        if (Number.isInteger(num)) {
          return num + ".0";
        }
        return num + "";
      }
    }
  };
</script>

<style lang="scss" scoped>
  .r-num {
    display: flex;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999;
    span {
      margin-left: 10px;
    }
  }
</style>
