<!--
 * @Description: 卡片
 * @Author: IFLS
 * @Date: 2023-02-08 11:15:05
 * @LastEditTime: 2023-03-23 17:37:16
-->
<script>
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({
    props: {
      list: {
        default: () => [], // 1: 可领取 2:等待自提/等待物流 3:完成
        type: Array
      }
    }
  });
</script>
<template>
  <div class="box-self">
    <template v-if="!$slots.default">
      <div class="title">
        <div v-for="(items, index) of list" :key="index">{{ items.title }}</div>
      </div>
      <div class="content">
        <div :class="{ 'color-blue': val.blue }" v-for="(val, idx) of list" :key="idx">{{ val.content }}</div>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .box-self {
    display: flex;
    justify-content: flex-start;
    margin: 42px 5px 29px;
    padding: 29px 33px;
    background: #fff;
    box-shadow: 0px 8px 12px 0px rgba(216, 216, 216, 0.2);
    border-radius: 15px;
    border: 2px solid #e6e8ef;
    font-size: 29px;
    line-height: 2;
    font-weight: 400;
    text-align: left;
    color: #565961;
    .title {
      width: 20%;
    }
    .content {
      width: 80%;
      padding-left: 29px;
      color: #1b1c1e;
      div {
        width: 100%;
      }
      :first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .color-blue {
      color: #4b7aff;
    }
  }
</style>
