/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-09 14:49:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:42:48
 * @FilePath: \lk-xinaohealth-h5\src\pinia\modules\classReservations.js
 * @Description: 动态团操
 */
import { reactive, toRefs } from "@vue/composition-api";
import { defineStore } from "pinia";

export const useClassReservationsStore = defineStore("classReservations", () => {
  const state = reactive({
    //用于记录: 用户在补全预约课程必填用户信息页面，是直接点击返回按钮返回得，还是点击提交表单后自动返回
    isSubmitUserInfoFlag: false
  });

  const setSubmitUserInfoFlag = flag => {
    state.isSubmitUserInfoFlag = flag;
  };
  const resetSubmitUserInfoFlag = () => {
    state.isSubmitUserInfoFlag = false;
  };
  return { ...toRefs(state), setSubmitUserInfoFlag, resetSubmitUserInfoFlag };
});
