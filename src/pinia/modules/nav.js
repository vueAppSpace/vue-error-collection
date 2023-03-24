/*
 * @Description: navbarStore
 * @Author: IFLS
 * @Date: 2023-02-03 10:26:56
 * @LastEditTime: 2023-03-24 17:32:30
 */
import { reactive, toRefs } from "@vue/composition-api";
import { useRoute, useRouter } from "@/hooks/useRouter";
import { defineStore } from "pinia";
import { jsBridge } from "@/utils/native/jsBridge";

export const useNavStore = defineStore("navStore", () => {
  const state = reactive({
    oneLevelPage: ["/health", "/guide", "/service", "/union", "/mine", "/themeActivityHome"],
    title: "",
    isTabShow: true,
    onbackFn: null
  });

  const route = useRoute();
  const router = useRouter();

  const setTitle = title => (state.title = title);

  const resetTitle = () => (state.title = "");

  const setTab = flag => (state.isTabShow = flag);

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
      const { path } = route;
      // 非pc的一级页面 点击关闭
      if (state.oneLevelPage.includes(path) && !state.isPc) {
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

  const onback = fn => {
    const {
      meta: { keepAlive }
    } = route.value;
    if (fn && keepAlive) {
      console.warn("检测到了在使用keepAlive缓存的页面中控制nav返回按钮,onback函数应在activated或onActivated中注册");
    }

    state.onbackFn = fn;
  };

  return { ...toRefs(state), setTitle, resetTitle, setTab, navGoback, onback };
});
