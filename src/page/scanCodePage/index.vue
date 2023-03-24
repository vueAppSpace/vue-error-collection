<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-02 15:25:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:41:47
 * @FilePath: \lk-xinaohealth-h5\src\page\scanCodePage\index.vue
 * @Description: ****
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount } from "@vue/composition-api";

  import { Toast } from "vant";
  import { useScanQRcodeStore } from "@/pinia";
  import { jsBridge } from "@/utils/native/jsBridge";

  export default defineComponent({
    setup(_, context) {
      const { $route: route } = context.root;
      const { type, randomId } = route.query;

      const store = useScanQRcodeStore();
      const { getUnifyQRCodeCallbackFn } = store;

      onMounted(async () => {
        try {
          if (type && randomId) {
            await getUnifyQRCodeCallbackFn({ type, randomId });
          } else {
            Toast("未获取到icome回调参数!");
          }
        } catch (e) {
          Toast("统一回调接口调用失败!" + e);
        }
      });

      //移动端处理
      const onScancode = () => {
        jsBridge.invoke("closeWebView");
      };

      return {
        onScancode
      };
    }
  });
</script>

<template>
  <div class="scanCodePage">
    <van-empty
      class="custom-image"
      image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
    />
    <div class="scanBtn" @click="onScancode">点击重新扫码</div>
  </div>
</template>

<style lang="scss" scoped>
  .scanCodePage {
    height: 100%;

    .scanBtn {
      font-size: 0.3rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #1c1c1e;
      line-height: 0.42rem;
      color: #1989fa;
      text-decoration: underline;
    }

    ::v-deep .van-empty {
      padding-top: 300px;
    }
  }
</style>
