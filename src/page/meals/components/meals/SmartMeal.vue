<template>
  <div class="recommend-meal" v-if="recommendData">
    <RecommendHeader :typeName="typeName" :isRefresh="isRefresh" :columns="columns" :canteenName="canteenName" />
    <!-- <div class="tip" v-if="isRefresh">4～5星疗愈、适宜；&lt;3星含健康减分因素、不宜</div> -->

    <div class="tip">
      4～5星疗愈<span class="star_label green">适宜</span>
      <span class="line_cross_line">|</span>
      <3星含健康减分因素
      <span class="star_label red">不宜</span>
    </div>
    <!--  -->
    <div :class="['food-box', { scrollX: isRefresh }]">
      <FoodItem
        v-for="item in recommendData"
        :key="item.lkcode"
        :isRefresh="isRefresh"
        :foodInfo="item"
        @refresh="$emit('refresh', $event)"
      />
    </div>
  </div>
</template>

<script>
  import RecommendHeader from "./RecommendHeader.vue";
  import FoodItem from "./FoodItem.vue";

  export default {
    props: {
      typeName: {
        type: String
      },
      isRefresh: {
        type: Boolean,
        default: true
      },
      recommendData: {
        type: Array
      },
      canteenName: {
        type: String
      },
      columns: {
        type: Array
      }
    },
    components: {
      RecommendHeader,
      FoodItem
    },
    mounted() {
      //console.log("this.recommendDatazzz", this.recommendData);
    }
  };
</script>

<style lang="scss" scoped>
  .tip {
    height: 64px;
    padding-left: 12px;
    color: #333;
    background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/star_label_bg.png")
      no-repeat left center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-bottom: 16px;
    padding-top: 8px;
    .star_label {
      width: 64px;
      height: 36px;
      background: rgba(0, 200, 99, 0.1);
      border-radius: 4px;
      /* opacity: 0.1; */
      line-height: 36px;
      text-align: center;

      font-size: 24px;
    }
    .green {
      color: rgba(0, 200, 99, 1);
      margin-left: 4px;
    }
    .line_cross_line {
      display: block;
      width: 2px;
      margin: 0 24px;
      color: #dadae1;
    }
    .red {
      margin-left: 4px;
      background: rgba(245, 88, 88, 0.1);
      color: rgba(245, 88, 88, 1);
    }
  }
  .food-box {
    display: flex;
    align-items: center;
    .food-item {
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
      }
    }
    &.scrollX {
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
</style>
