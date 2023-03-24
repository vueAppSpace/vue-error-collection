/*
 * @Description: navbarStore
 * @Author: IFLS
 * @Date: 2023-02-03 10:26:56
 * @LastEditTime: 2023-03-23 17:42:52
 */
import { reactive, toRefs } from "@vue/composition-api";
import { defineStore } from "pinia";

export const useNavStore = defineStore("navTitleStore", () => {
  const state = reactive({
    title: ""
  });

  const setTitle = title => (state.title = title);

  const resetTitle = () => (state.title = "");

  return { ...toRefs(state), setTitle, resetTitle };
});
