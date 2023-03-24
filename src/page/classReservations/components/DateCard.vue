<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:35:19
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\components\DateCard.vue
 * @Description: 动感团操 - 日期卡片
-->

<template>
  <div class="item-card">
    <template v-for="(item, index) in dateList">
      <div :key="item.id" class="dateItem" :class="{ active: index === activeIndex }" @click="handleClick(item, index)">
        <div class="weekName">{{ item.weekName }}</div>
        <div class="dateName">{{ item.dateName }}</div>
      </div>
    </template>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";

  export default defineComponent({
    props: {
      dateList: {
        type: Array,
        default: []
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    setup({}, context) {
      const { emit } = context;

      function handleClick(item, index) {
        emit("click", index);
      }

      return {
        handleClick
      };
    }
  });
</script>

<style lang="scss" scoped>
  .item-card {
    display: flex;
    justify-content: space-around;
    font-family: PingFangSC-Regular, PingFang SC;

    .dateItem {
      width: 88px;
      height: 152px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8d8e;
      display: flex;
      justify-content: center;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      align-items: center;
      padding-top: 16px;
      padding-bottom: 12px;

      &.active {
        background: #4b7aff;
        border-radius: 40px;

        .weekName {
          color: #ffffff;
        }

        .dateName {
          background: #ffffff;
          font-size: 32px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #4b7aff;
          border-radius: 32px;
        }
      }

      .weekName {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8c8d8e;
        line-height: 40px;
      }

      .dateName {
        height: 64px;
        width: 64px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1b1c1e;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
