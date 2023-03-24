<!--
 * @Description: 二维码弹窗
 * @Author: IFLS
 * @Date: 2022-11-03 11:06:07
 * @LastEditTime: 2023-03-23 17:32:31
-->

<script>
  import { defineComponent, reactive, toRefs, watch } from "@vue/composition-api";
  import Tips from "@/components/Tips";
  import { queryQRCode } from "@/service/mine";

  export default defineComponent({
    components: {
      Tips
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const seconds = 30;
      const state = reactive({
        visible: props.value,
        QRCodeImg: null,
        timer: null,
        seconds
      });

      watch(
        () => props.value,
        newVal => {
          state.visible = newVal;
          if (newVal) {
            showQRCode();
          }
        }
      );

      const content = localStorage.getItem("empNo");
      const req = { seconds, type: 1000, content };
      const showQRCode = () => {
        clearInterval(state.timer);
        state.QRCodeImg = null;
        queryQRCode(req).then(({ code, data, message }) => {
          if (code === 0) {
            state.seconds = 30;
            state.QRCodeImg = data.img;
            state.timer = setInterval(() => {
              state.seconds--;
              if (state.seconds == 0) {
                clearInterval(state.timer);
              }
            }, 1000);
          } else {
            console.log("queryQRCode", message);
          }
        });
      };

      const hiddenQRCode = () => {
        emit("update:value", false);
        clearInterval(state.timer);
      };

      return {
        ...toRefs(state),
        showQRCode,
        hiddenQRCode
      };
    }
  });
</script>

<template>
  <tips :value.sync="visible" :duration="0" :exp="0" title="" @onClose="hiddenQRCode">
    <div class="qr-box">
      <van-image class="qr-code" :src="QRCodeImg">
        <template v-slot:loading>
          <van-loading type="spinner" />
        </template>
      </van-image>
    </div>
    <div class="code-left-time font-regular"
      >（{{ seconds > 0 ? `有效时间${seconds}s` : "已过期，请刷新二维码" }}）</div
    >
    <div class="refresh-btn" @click="showQRCode">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/refresh.png" alt="" />
      <div class="font-regular">点击刷新二维码</div>
    </div>
  </tips>
</template>

<style lang="scss" scoped>
  .qr-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 360px;
    height: 360px;
    background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/qrcode_box.png")
      no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    ::v-deep.qr-code {
      padding: 30px;
      width: 100%;
      height: 100%;
      .van-image__loading {
        background-color: transparent;
      }
      .van-image__img[src=""],
      .van-image__img:not([src]) {
        opacity: 0;
      }
    }
  }
  .code-left-time {
    color: #737782;
    font-size: 26px;
    line-height: 36px;
  }
  .refresh-btn {
    width: 328px;
    height: 72px;
    border-radius: 36px;
    border: 2px solid #4b7aff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px auto;
    img {
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }
    div {
      color: #4b7aff;
      font-size: 28px;
      line-height: 40px;
    }
  }
</style>
