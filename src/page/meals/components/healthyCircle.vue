<!--
 * @Description: 环形进度条
 * @Author: IFLS
 * @Date: 2021-12-23 14:01:18
 * @LastEditTime: 2023-03-23 17:38:07
-->
<template>
  <div class="circle-containter">
    <div class="circle-box" v-for="(item, index) of chartData" :key="index">
      <van-circle
        v-model="item.ratio"
        :rate="item.ratio"
        :text="item.ratio + '%'"
        :clockwise="false"
        :color="fillColor(index)"
        layer-color="#eee"
        :stroke-width="70"
        :speed="100"
        size="60px"
      />
      <div class="circle-name">{{ item.name }}</div>
      <div>{{ item.value }}{{ item.unit }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      chartData: {
        type: Array,
        defalut: []
      }
    },
    methods: {
      fillColor(index) {
        const color = {
          0: "#97B5F7",
          1: "#F6A55F",
          2: "#ed6066"
        };
        const C = new Map(Object.entries(color));
        return C.get(String(index));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .circle-containter {
    display: flex;
    justify-content: space-around;
    padding-top: 45px;
    .circle-box {
      display: inline-block;
      height: 245px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      .circle-name {
        margin-top: 20px;
      }
    }
  }
</style>
