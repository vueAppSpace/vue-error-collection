<template>
  <div class="box">
    <div v-if="foodInfo && foodInfo.detail">
      <div class="food-item" @click="toDetail(foodInfo, 1)">
        <div class="food-num" v-if="isRefresh">{{ `${foodInfo.foodTypeName}${foodInfo.weight}` }}g</div>
        <div class="picture-box">
          <!-- <img class="bg" :src="foodInfo.detail.pic" /> -->

          <van-image class="bg" :src="foodInfo.detail.pic">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>

          <img
            class="refresh"
            v-if="isRefresh && foodInfo.foodNum > 1"
            @click.stop="refresh(foodInfo)"
            src="https://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/images/meal/refresh.png"
          />

          <div class="food-name" v-if="foodInfo.rname">{{ foodInfo.rname }}</div>
        </div>
      </div>
      <div class="star-box" v-if="!isRefresh">
        <span :class="className">
          <van-icon name="star" />
          <div style="display: inline-block" v-if="foodInfo.detail.score[0].value != '-1'">{{
            foodInfo.detail &&
            foodInfo.detail.score[0] &&
            foodInfo.detail.score[0].value &&
            foodInfo.detail.score[0].value.toFixed(1)
          }}</div>
          <div style="display: inline-block" v-else>-1</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isRefresh: {
        //全菜品刷新功能
        type: Boolean
      },
      foodInfo: {
        type: Object
      }
    },
    computed: {
      className() {
        return this.foodInfo.detail.score[0].value >= 5
          ? "high"
          : this.foodInfo.detail.score[0].value >= 4
          ? "middle"
          : this.foodInfo.detail.score[0].value == -1
          ? "negative"
          : "";
      }
    },
    methods: {
      refresh(foodInfo) {
        this.$emit("refresh", foodInfo);
        const { recipeType, foodTime } = foodInfo;

        const mealType = {
          food_time_morning: "早餐",
          food_time_noon: "午餐",
          food_time_night: "晚餐",
          food_time_extra: "加餐"
        };
        const recipeTypes = {
          recipe_type_zs: "主食",
          recipe_type_zc: "豆鱼蛋肉",
          recipe_type_sc: "蔬菜"
        };
        this.zgStatistics("健康新奥-健康-点击换一换", {
          食物名称: foodInfo.rname,
          供应类别: recipeTypes[recipeType],
          类别: mealType[foodTime]
        });
      },
      toDetail(foodInfo, type) {
        console.log(foodInfo);
        if (!foodInfo.rname) return;
        if (this.$route.path !== "/health") {
          this.zgStatistics("健康新奥-我的-点击卡片", { 按钮名称: foodInfo.rname, 位置: "餐食" });
        }

        const mealType = {
          food_time_morning: "早餐",
          food_time_noon: "午餐",
          food_time_night: "晚餐"
        };

        this.zgStatistics("健康新奥-餐食-进入食物详情", {
          食物名称: foodInfo.rname,
          供应类别: this.isRefresh ? "全菜品" : "自助餐",
          餐次类别: mealType[foodInfo.foodTime],
          来源: this.$route.path == "/health" ? "健康" : "我的"
        });
        // this.$router.push({ path: "/dietDetail", query: { type, name: foodInfo.rname } });
        this.$router.push({
          path: "/foodDetail",
          query: { type, name: foodInfo.lkcode, star: foodInfo.detail.score[0].value }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .box {
    position: relative;
    padding-top: 8px;
    flex-shrink: 0;
    margin-right: 24px;
    &:last-child {
      margin-right: 0;
    }
    .star-box {
      position: absolute;
      right: 0;
      top: 8px;
      display: flex;
      justify-content: flex-end;
      span {
        padding: 0 6px;
        height: 36px;
        background: #ff9c00;
        border-radius: 200px 8px 0px 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        &.high {
          background: #16b57d;
        }
        &.middle {
          background: #4b7aff;
        }

        &.negative {
          background: #abafba;
          span {
            background: #abafba;
          }
        }

        .van-icon {
          margin-right: 4px;
        }
      }
    }
  }
  .food-item {
    width: 200px;
    position: relative;
    .picture-box {
      width: 200px;
      height: 200px;
      background: #d8d8d8;
      border-radius: 8px;
      position: relative;
      .bg {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }
      .refresh {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 8px;
        right: 8px;
      }
      .food-name {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 64px;
        line-height: 64px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 0px 0px 8px 8px;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        padding: 0 4px;
      }
    }

    .food-num {
      font-size: 24px;
      color: #3d3e42;
      margin-bottom: 10px;
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
