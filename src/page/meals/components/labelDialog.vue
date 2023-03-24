<!--
 * @Description: 标签颜色说明
 * @Author: IFLS
 * @Date: 2021-12-23 17:17:43
 * @LastEditTime: 2023-03-23 17:38:11
-->
<template>
  <van-dialog v-model="labelDialogShow" :show-confirm-button="false">
    <div class="label-explain-box">
      <div class="title">标签颜色说明</div>
      <ul>
        <li>
          <img src="../../../assets/images/healthy/fit.png" />
          <em>适宜</em>
          <i>重点关注</i>
        </li>
        <li>
          <img src="../../../assets/images/healthy/unfit.png" />
          <em>不适宜</em>
          <i>重点关注</i>
        </li>
        <li>
          <img class="img last-img" src="../../../assets/images/healthy/fit.png" />
          <em>中性</em>
          <i>非重点关注</i>
        </li>
      </ul>
      <van-button round type="info" @click="confirm">确定</van-button>
    </div>
  </van-dialog>
</template>

<script>
  export default {
    props: {
      labelDialogShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      confirm() {
        this.$emit("update:labelDialogShow", false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .van-dialog {
    border-radius: 20px;
    .label-explain-box {
      padding: 40px 60px;
      .title {
        position: relative;
        font-size: 32px;
        font-weight: bold;
        color: #333;
      }
      .title::after {
        content: "";
        position: absolute;
        top: 25px;
        left: 150px;
        z-index: -1;
        width: 220px;
        height: 24px;
        background: linear-gradient(135deg, #ffd7f0 0%, #d4f4ff 100%);
        border-radius: 12px;
      }
      ul {
        display: flex;
        justify-content: space-between;
        margin: 64px 0;
        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          img {
            width: 88px;
            height: 88px;
            margin-left: 6px;
            margin-bottom: 12px;
          }
          .img {
            filter: hue-rotate(250deg);
            margin-left: 16px;
          }
          em {
            font-style: normal;
            font-size: 28px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: 700;
            color: #333;
          }
          i {
            font-style: normal;
            font-size: 24px;
            color: #666;
          }
        }
      }
      .van-button {
        width: 480px;
        background: #fc6294;
        border-radius: 50px;
      }
      .van-button--info {
        border: 1px solid #fc6294;
      }
      .van-button__text {
        font-size: 30px;
        color: ffff;
      }
    }
  }
</style>
