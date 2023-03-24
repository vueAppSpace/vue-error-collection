<template>
  <div class="container">
    <div class="canteenBox flex">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
      <div class="canteenInfo">
        <div class="canteenName">
          <span>科一食堂</span>
          <span class="canteenTag">明日特色餐</span>
        </div>
        <div class="addressInfo">廊坊新奥科技园东1区</div>
      </div>
    </div>

    <div class="canteenBox flex-between">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
      <div class="canteenInfo">
        <div class="canteenName">
          <span>科一食堂</span>
          <span class="canteenTag">明日特色餐</span>
        </div>
        <div class="addressInfo">廊坊新奥科技园东1区</div>
      </div>
    </div>
  </div>
</template>
<script>
  import loading from "../../components/Loading";

  export default {
    directives: {},
    components: {
      loading
    },
    data() {
      return {};
    },
    computed: {
      text() {
        return this.currentRate.toFixed(0) + "%";
      },
      text2() {
        return this.currentRate2.toFixed(0) + "%";
      }
    },
    methods: {
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      }
    },
    watch: {},
    mounted() {}
  };
</script>
<style lang="scss" scoped>
  @import "../../style/meal.css";

  .container {
    background: #f0f2f7;
    width: 100%;
    height: 100%;
    padding: 20px;
    .van-swipe {
      border-radius: 0.16rem;
      box-shadow: 0px 8px 16px 0px rgba(145, 149, 161, 0.2);
    }

    .canteenBox {
      width: 710px;
      height: 192px;
      background: #ffffff;
      border-radius: 16px;
      font-size: 26px;
      color: #737782;
      padding: 32px;
      margin-bottom: 24px;
      img {
        width: 128px;
        height: 128px;
        background: #dadae1;
        border-radius: 8px;
      }
      .canteenInfo {
        font-weight: bold;
        margin: 0 110px 0 20px;
        .canteenName {
          .canteenTag {
            font-weight: normal;
            padding: 0 12px;
            height: 40px;
            background: #dce5ff;
            border-radius: 8px;
            line-height: 40px;
            font-size: 24px;
            color: #4b7aff;
          }
        }
        .addressInfo {
          font-weight: normal;
        }
      }
      .changeCanteen {
        span {
          display: inline-block;
          width: 12px;
          height: 22px;
          font-size: 24px;
        }
      }
    }

    /* <div class="canteenList">
            <div class="canteenItem">
                <div class="left">
                    <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
                    <div class="tagTissue">
                        <div class="caiName">牛奶</div>

                        <div class="tagList">
                            <div class="tag">这是一个较长的标签文案</div>
                            <div class="tag">高嘌呤</div>
                            <div class="tag">健脾</div>
                        </div>
                    </div>
                </div>

                <div class="orderBtn"></div>

            </div>
        </div> */
    .canteenList {
      margin-top: 24px;
      width: 710px;
      background: #ffffff;
      border-radius: 16px;
      font-size: 28px;
      color: #333;
      padding: 32px;
      .canteenItem {
        position: relative;
        .left {
          img {
            width: 162px;
            height: 162px;
            border-radius: 12px;
            margin-right: 20px;
          }
          .tagTissue {
            width: 310px;
            text-align: left;
            .tag {
              display: inline-block;
              background: #d4c3c4;
              border-radius: 4px;
              padding: 4px 12px;
              margin-top: 8px;
              font-size: 24px;
              color: #ed6066;
            }
            .recommend {
              font-size: 22px;
              line-height: 26px;
              color: #999;
              margin-top: 8px;
            }
          }
        }
        .orderBtn {
          position: absolute;
          right: 24px;
          top: 102px;
          width: 120px;
          height: 56px;
          background: #4b7aff;
          border-radius: 44px;
          line-height: 56px;
          color: #fff;
        }
      }
    }
  }
</style>
