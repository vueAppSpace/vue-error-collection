<template>
  <div class="box" v-if="foodInfo">
    <div class="food-item" @click="toDetail(foodInfo, 2)">
      <!-- v-if="isRefresh" -->
      <div class="food-num">
        <div class="name">{{ `${foodInfo.name}` }}</div>
        <div class="weight">{{ `${foodInfo.weight}` }}g</div>

        <!-- <div class="name">{{ `${foodInfo.name}` }}{{ `${foodInfo.name}` }}</div>
                <div class="weight">9999g</div> -->
        <!-- {{ `${foodInfo.name}${foodInfo.weight}` }} -->
      </div>
      <div class="picture-box">
        <!-- <img class="bg" :src="foodInfo.detail.pic" /> -->

        <van-image class="bg" :src="foodInfo.img">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>

        <img
          class="refresh"
          v-if="isRefresh && foodInfo.foodNum > 1"
          @click.stop="refresh(foodInfo)"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/refresh.png"
        />

        <div class="food-name" v-if="foodInfo.cls">{{ foodInfo.cls }}</div>
      </div>
    </div>

    <!-- v-if="isRefresh" -->
    <div class="star-box">
      <span :class="className">
        <van-icon name="star" />
        <div style="display: inline-block" v-if="foodInfo.score != '-1'">{{ foodInfo.score.toFixed(1) }}</div>
        <div style="display: inline-block" v-else>-1</div>
      </span>
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
        return this.foodInfo.score >= 5
          ? "high"
          : this.foodInfo.score >= 4
          ? "middle"
          : this.foodInfo.score == -1
          ? "negative"
          : "";
      }
    },
    methods: {
      refresh(foodInfo) {
        console.log("foodInfoxxxx", foodInfo);
        this.$emit("refresh", foodInfo);

        this.zgStatistics("健康新奥-健康-点击换一换", {
          食物名称: foodInfo.name,
          供应类别: foodInfo.cls,
          类别: foodInfo.meal_time
        });
      },
      toDetail(foodInfo, type) {
        console.log(foodInfo);
        if (!foodInfo.name) return;

        this.$router.push({
          path: "/dietDetail",
          query: {
            type,
            name: foodInfo.name,
            score: foodInfo.score
          }
        });
        if (this.$route.path !== "/health") {
          this.zgStatistics("健康新奥-我的-点击卡片", { 按钮名称: foodInfo.name, 位置: "餐食" });
        }

        this.zgStatistics("健康新奥-餐食-进入食物详情", {
          食物名称: foodInfo.name,
          供应类别: this.isRefresh ? "全菜品" : "自助餐",
          餐次类别: foodInfo.meal_time,
          来源: this.$route.path == "/health" ? "健康" : "我的"
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
      left: 0;
      top: 59px;
      display: flex;
      justify-content: flex-end;
      span {
        padding: 0 6px;
        height: 36px;
        background: #ff9c00;
        border-radius: 80px 200px 200px 0px;
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
      /* border: 1px solid red; */
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
      // border: 1px solid;
      font-size: 24px;
      color: #3d3e42;
      margin-bottom: 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      .name {
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .weight {
        max-width: 96px;
      }
      // text-align: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
  }
</style>
