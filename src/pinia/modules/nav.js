/*
 * @Description: navbarStore
 * @Author: IFLS
 * @Date: 2023-02-03 10:26:56
 * @LastEditTime: 2023-03-24 15:29:10
 */
import { reactive, toRefs } from "@vue/composition-api";
import { defineStore } from "pinia";

export const useNavStore = defineStore("navStore", () => {
  const state = reactive({
    title: "",
    isTabShow: true
  });

  const setTitle = title => (state.title = title);

  const resetTitle = () => (state.title = "");

  const setTab = flag => (state.isTabShow = flag);

  return { ...toRefs(state), setTitle, resetTitle, setTab };
});
