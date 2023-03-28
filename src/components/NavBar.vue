<!--
 * @Description: 导航栏
 * @Author: IFLS
 * @Date: 2022-08-09 09:58:53
 * @LastEditTime: 2023-03-28 10:18:41
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, watch, shallowRef } from "@vue/composition-api";
  import { isMobile } from "@/utils/native/deviceEnv";
  import { useNavStore, storeToRefs } from "@/pinia";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { useRouter, useRoute } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        isPc: false,
        isShow: true,
        navTitle: ""
      });

      const { title: piniaTitle, onbackFn } = storeToRefs(useNavStore());
      const { oneLevelPage, onback } = useNavStore();

      // 监听pinia中title变化
      watch(
        () => piniaTitle.value,
        val => {
          state.navTitle = val;
        }
      );

      watch(route, to => {
        const {
          meta: { title: metaTitle, showNavBar },
          query: { navTitle },
          path
        } = to;

        // meta title > url navTitle > pinia title
        state.navTitle = metaTitle ? metaTitle : navTitle ? navTitle : piniaTitle;

        // 路由meta若传参showNavBar 比重最大 控制显示与否
        if (showNavBar !== undefined) {
          state.isShow = showNavBar;
          return;
        }

        // pc的一级页面 隐藏navbar
        if (oneLevelPage.includes(path) && state.isPc) {
          state.isShow = false;
        } else {
          state.isShow = true;
        }
      });

      const navGoback = () => {
        const {
          query: { backHome, nologin }
        } = route.value;

        // url传参: 回到首页
        if (backHome) {
          router.replace("/health");
          // url传参: 不登录情况
        } else if (nologin) {
          jsBridge.invoke("closeWebView");
        } else {
          const { path } = route.value;
          // 非pc的一级页面 点击关闭
          if (oneLevelPage.includes(path) && !state.isPc) {
            jsBridge.invoke("closeWebView");
          } else {
            // 下级页面存在history正常回退 注意: 此处不准确 可能多次跳转后 才到达当前页
            if (window.history.length > 1) {
              router.go(-1);
            } else {
              // 下级页面不存在history时 为推送的特定页面 返回到首页
              router.replace("/health");
            }
          }
        }
      };

      const goback = () => {
        // 自定义返回事件
        if (onbackFn.value) {
          onbackFn.value();
          // 调用完成后清空页面注册的事件
          onback(null);
        } else {
          navGoback();
        }
      };

      onMounted(() => {
        state.isPc = !isMobile;
      });

      return {
        ...toRefs(state),
        piniaTitle,
        oneLevelPage,
        goback
      };
    }
  });
</script>

<template>
  <van-nav-bar
    v-if="isShow"
    :title="navTitle"
    left-text="返回"
    :left-arrow="true"
    :fixed="true"
    :safe-area-inset-top="true"
    :placeholder="true"
    @click-left="goback"
  />
</template>
