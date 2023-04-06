<template>
  <!-- 特色餐 -->
  <div class="special-meal">
    <RecommendHeader
      :typeName="typeName"
      :lunchCanteenName="lunchCanteenName"
      :isShowRight="true"
      :isSpecialMeal="isSpecialMeal"
    />
    <template v-if="orderInfo">
      <FoodCard :foodInfo="orderInfo"></FoodCard>
      <RecommendSnack v-if="recommendSnack" :recommendSnack="recommendSnack"></RecommendSnack>
    </template>
    <div class="no-data" v-else>{{ noData }}</div>
  </div>
</template>

<script>
  import RecommendSnack from "../RecommendSnack";
  import FoodCard from "../FoodCard";
  import { orderListByEmployeeId } from "@/service/api";
  import { getEatAdjust } from "@/service/health";
  import RecommendHeader from "./RecommendHeader.vue";
  import { mapState, useUserStore } from "@/pinia";

  export default {
    components: {
      RecommendSnack,
      FoodCard,
      RecommendHeader
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    data() {
      return {
        orderInfo: null,
        recommendSnack: null,
        typeName: "已点套餐",
        noData: "您昨天没有点餐哦～",
        isSpecialMeal: true,
        lunchCanteenName: ""
      };
    },
    mounted() {
      // 获取个人点餐列表是否有食堂名称信息
      orderListByEmployeeId({
        date: dayjs().format("YYYY-MM-DD"),
        employeeId: this.userInfo.empNo ? this.userInfo.empNo : 10104970
      })
        .then(({ code, data, message }) => {
          console.log("特色餐：", code, data, message);
          if (code === 0) {
            if (data && data.length > 0) {
              const temp = data[0];
              this.orderInfo = { ...temp, score: temp.star, rec: temp.tags };
              this.fetchEatAdjust(this.orderInfo.canteenId);
              localStorage.setItem("isHidden", 1);
              this.$emit("special", true);
              // 反解析食堂
              const columns = JSON.parse(localStorage.getItem("columns"));
              const canteen = columns.filter(item => item.canteenId === this.orderInfo.canteenId);
              this.lunchCanteenName = canteen[0].canteenName;
            } else {
              this.$emit("special", false);
              this.isSpecialMeal = false;
            }
          } else {
            console.log(message);
            this.$emit("special", false);
            this.noData = "服务开小差了，请稍候重试！";
            this.isSpecialMeal = false;
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    methods: {
      // 获取副菜
      async fetchEatAdjust(canteenId) {
        try {
          const { code, message, data } = await getEatAdjust({ canteenId });
          if (code === 0) {
            const arr =
              data &&
              data.map(item => {
                item.dishImg = item.img;
                item.dishName = item.recipe_name;
                return item;
              });
            console.log(arr);
            this.recommendSnack = arr;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .meal-info {
    position: relative;
    img {
      width: 100%;
      // height: 380px;
      background: #d8d8d8;
      border-radius: 16px;
    }
    .food-name {
      position: absolute;
      bottom: 0;
      font-size: 28px;
      width: 100%;
      height: 80px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 0px 0px 8px 8px;
      color: #ffffff;
      display: flex;
      align-items: center;
      padding-left: 16px;
    }
  }
  .no-data {
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3d3e42;
    line-height: 40px;
    text-align: center;
  }
</style>
