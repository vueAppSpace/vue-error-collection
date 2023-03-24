<template>
  <div class="recommend-snack">
    <div class="title">已点套餐热量偏低，推荐加餐哦～</div>
    <div class="recommend-food-box">
      <FoodCard
        v-for="(foodInfo, index) in recommendSnack"
        :key="index"
        :foodInfo="foodInfo"
        :isDeputyFood="true"
      ></FoodCard>
    </div>
  </div>
</template>

<script>
  import FoodCard from "./FoodCard";
  export default {
    components: { FoodCard },
    props: {
      recommendSnack: {
        type: [Array, Object]
      }
    }
  };
</script>

<style lang="scss" scoped>
  .recommend-snack {
    background: #ffffff;
    box-shadow: 0px 8px 16px 0px rgba(194, 197, 205, 0.29);
    border-radius: 16px;
    margin-top: 32px;
    .title {
      height: 72px;
      padding-left: 20px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 40px;
      background: linear-gradient(135deg, #f4f1fd 0%, #f1f9fc 100%);
      border-radius: 16px 16px 0px 0px;
      display: flex;
      align-items: center;
    }
    .recommend-food-box {
      padding: 24px 0 24px 24px;
    }
  }
</style>
