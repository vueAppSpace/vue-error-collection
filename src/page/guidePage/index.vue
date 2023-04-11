<!--
 * @Description: 引导页
 * @Author: IFLS
 * @Date: 2022-05-30 16:40:42
 * @LastEditTime: 2023-03-28 10:14:47
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import { queryGuidePageList } from "@/service/guidePage";
  import { getURLParameters, getFullURLFromParameters } from "@/utils/commonFun";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { useRouter, useRoute } from "@/hooks/useRouter";

  export default defineComponent({
    beforeRouteEnter(to, from, next) {
      // 从其他页返回引导页时 直接关闭webview
      if (to.path === "/guide" && from.path !== "/") {
        return jsBridge.invoke("closeWebView");
      }
      next();
    },
    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        imageData: {},
        current: 0,
        timer: null
      });

      const routerPush = () => {
        let path = decodeURIComponent(route.value.fullPath.split("url=")[1]);
        const paramsArr = path.split("&source=icome");
        // 来源为icome-我的时 剔除source参数 避免路由卡死
        if (paramsArr.length > 1) {
          zgStatistics("健康新奥-进入页面", { 来源: "icome-我的", 所属功能模块: "健康", 页面名称: "健康" });
          path = paramsArr[0];
        }
        router.push(path);
      };

      const queryData = async () => {
        const { code, data, message } = await queryGuidePageList();
        if (code === 0) {
          if (Object.keys(data).length === 0) {
            return routerPush();
          }
          state.imageData = data;
        } else {
          //console.log("queryData", message);
          // Toast(message)
        }
      };

      onMounted(() => {
        //console.log("guidePage=========>");
        queryData().then(() => {
          const countDownTime = state.imageData.countDownTime * 1000;
          state.timer = setTimeout(routerPush, countDownTime);
        });
      });

      onBeforeUnmount(() => {
        clearTimeout(state.timer);
      });

      function handlePageClick() {
        const jumpUrl = state.imageData.jumpUrl;
        if (jumpUrl && jumpUrl.trim()) {
          jumpTo(jumpUrl);
        }
      }

      //url = "https://c-qa.op.laikang.com/report/service?dd_full_screen=true&ticket=ticket"
      //url = "/service";
      function jumpTo(url) {
        //console.log("guide...");
        const paramsObj = getURLParameters(url) || {};
        paramsObj["ticket"] = localStorage.getItem("ticket");
        url = getFullURLFromParameters(url, paramsObj);
        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      }

      return {
        ...toRefs(state),
        routerPush,
        handlePageClick
      };
    }
  });
</script>

<template>
  <div class="guide-box" v-if="Object.keys(imageData).length > 0">
    <div class="skip-button" @click="routerPush">跳过</div>
    <img @click="handlePageClick" class="img-item" v-lazy="imageData.picture" />
  </div>
</template>

<style lang="scss" scoped>
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .guide-box {
    position: relative;
    width: 100%;
    .img-item {
      width: 100%;
      height: auto;
    }

    .skip-button {
      // position: fixed;
      position: absolute;
      z-index: 999;
      right: 40px;
      top: 40px;
      width: 124px;
      height: 60px;
      line-height: 60px;
      background: #000;
      border-radius: 30px;
      font-size: 28px;
      color: #fff;
      opacity: 0.3;
    }
  }
</style>
