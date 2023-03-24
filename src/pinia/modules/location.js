import { reactive, toRefs } from "@vue/composition-api";
import { defineStore } from "pinia";
export const useLocationStore = defineStore("cityCodeStore", () => {
  const state = reactive({
    cityCode: "0316",
    canteenList: ""
  });

  function setCityCode(param) {
    state.cityCode = param;
  }

  function setCanteenList(param) {
    state.canteenList = param;
  }

  // 函数赋值
  return { ...toRefs(state), setCityCode, setCanteenList };
});
