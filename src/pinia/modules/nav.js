/*
 * @Description: navbarStore
 * @Author: IFLS
 * @Date: 2023-02-03 10:26:56
 * @LastEditTime: 2023-03-27 10:17:44
 */
import { reactive, toRefs } from "@vue/composition-api";
import { defineStore } from "pinia";

export const useNavStore = defineStore("navStore", () => {
  const state = reactive({
    oneLevelPage: ["/health", "/guide", "/service", "/union", "/mine", "/themeActivityHome"],
    title: "",
    isTabShow: true,
    onbackFn: null
  });

  const setTitle = title => (state.title = title);

  const resetTitle = () => (state.title = "");

  const setTab = flag => (state.isTabShow = flag);

  // 注意: onback函数仅在页面首次加载时触发,keepAlive页面应在activated或onActivated中注册onback
  const onback = fn => (state.onbackFn = fn);

  return { ...toRefs(state), setTitle, resetTitle, setTab, onback };
});
