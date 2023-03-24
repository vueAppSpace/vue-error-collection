<!--
 * @Description: 即将上线版面-列表
 * @Author: IFLS
 * @Date: 2022-05-13 10:41:38
 * @LastEditTime: 2023-03-23 17:32:26
-->

<script>
  import { defineComponent } from "@vue/composition-api";
  export default defineComponent({
    setup() {
      return {};
    }
  });
</script>

<template>
  <div class="list-box">
    <!-- <div class="title">陆续上线</div> -->
    <img
      class="img"
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/panel_card.png"
    />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  .list-box {
    // margin: 0 auto;
    // background: #fff;
    // box-shadow: 0px 4px 32px 0px rgba(195, 209, 255, 0.33);
    // border-radius: 8px;
    // border: 2px solid #467ffc;
    padding-bottom: 24px;
    margin-top: -100px;
    .img {
      width: 558px;
      height: 106px;
    }
    // .title {
    //     width: 216px;
    //     height: 52px;
    //     margin: 0 auto;
    //     line-height: 52px;
    //     font-size: 30px;
    //     font-weight: 500;
    //     color: #fff;
    //     background: linear-gradient(180deg, #467ffc 0%, #5aacf4 100%);
    //     border-radius: 0px 0px 30px 30px;
    // }
    ul {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: -5px;
      li {
        display: flex;
        justify-content: left;
        align-items: center;
        padding-left: 150px;
        margin-top: 24px;
        width: 630px;
        height: 100px;
        line-height: 100px;
        background-color: #fff;
        color: #333;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        box-shadow: 0px 4px 32px 0px rgba(195, 209, 255, 0.33);
        border-radius: 8px;
        img {
          width: 48px;
          height: 48px;
          margin-right: 50px;
        }
        i {
          width: 10px;
          height: 10px;
          background: #467ffc;
          border-radius: 50%;
          margin-right: 30px;
        }
        i:first-child {
          margin-left: 125px;
        }
      }
      // li::before {
      //     display: inline-block;
      //     content: ' ';
      //     width: 60px;
      //     height: 38px;
      //     margin-bottom: -6px;
      //     margin-right: 20px;
      //     background-image: url('https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/panel_dot.png');
      //     background-repeat: no-repeat;
      //     background-size: 60px 38px;
      // }
    }
  }
</style>
