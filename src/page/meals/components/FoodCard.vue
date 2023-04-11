<template>
  <div class="food-info" @click="toDetail(foodInfo.dishName, 1)">
    <div class="left-box">
      <van-image class="bg" :src="foodInfo.dishImg" fit="cover">
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
    </div>
    <div class="right-box">
      <div class="top-box">
        <div class="food-name">{{ foodInfo.dishName }}</div>
        <div class="label-box">
          <div class="label" v-for="(item, index) in foodInfo.rec" :key="index">{{ item.name }}</div>
          <!-- <div class="label high">高嘌呤</div>
                    <div class="label">高w-3脂肪酸</div>
                    <div class="label">高w-3脂肪酸</div> -->
        </div>
      </div>
      <div class="bottom-box">
        推荐指数
        <van-rate
          v-model="foodInfo.score"
          :size="14"
          color="#FF9C00"
          void-icon="star"
          void-color="rgba(255, 156, 0, .2)"
        />
      </div>
    </div>
    <div class="number-box" v-if="isDeputyFood">{{ foodInfo.num }}g</div>
  </div>
</template>

<script>
  export default {
    props: {
      foodInfo: {
        type: Object
      },
      isDeputyFood: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toDetail(name, type) {
        this.zgStatistics("健康新奥-餐食-进入食物详情", {
          食物名称: name,
          供应类别: "特色餐",
          餐次类别: "午餐",
          来源: this.$route.path == "/health" ? "健康" : "我的"
        });
        // this.$router.push({ path: "/dietDetail", query: { type, name } });
        //console.log("this.foodInfo.lkcode", this.foodInfo);
        //console.log("this.foodInfo.lkcode", this.foodInfo.score);
        this.$router.push({
          path: "/foodDetail",
          query: { type, name: this.foodInfo.dishName, star: this.foodInfo.score }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .food-info {
    display: flex;
    position: relative;
    .left-box {
      width: 200px;
      height: 200px;
      background: #dadae1;
      border-radius: 12px;
      margin-right: 20px;
      .bg {
        width: 100%;
        height: 100%;
      }
    }
    .right-box {
      flex: 1;
      position: relative;
      .food-name {
        width: 300px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 40px;
        margin-bottom: 12px;
      }
      .label-box {
        display: flex;
        flex-wrap: wrap;
        max-height: 96px;
        overflow: hidden;
        .label {
          max-width: 430px;
          height: 40px;
          padding: 0 12px;
          margin-right: 8px;
          border-radius: 4px;
          background: rgba(0, 200, 99, 0.1);
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #00c863;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 8px;
          &.high {
            background-color: rgba(237, 96, 102, 0.1);
            color: #ed6066;
          }
        }
      }
      .bottom-box {
        position: absolute;
        bottom: 6px;
        .van-rate {
          ::v-deep.van-rate__item:not(:last-child) {
            padding-right: 2px;
          }
        }
      }
    }
    .number-box {
      position: absolute;
      right: 0;
      top: 0;
      padding: 4px 18px;
      height: 48px;
      background: #edf1ff;
      border-radius: 114px 0px 0px 114px;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #4b7aff;
      line-height: 48px;
    }
  }
</style>
