/*
 * @Description: userStore
 * @Author: IFLS
 * @Date: 2023-02-03 09:30:32
 * @LastEditTime: 2023-03-23 17:42:56
 */
import { ref } from "@vue/composition-api";
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const userInfo = ref({});

    const setUserInfo = data => (userInfo.value = data);

    const clearUserInfo = () => (userInfo.value = {});

    return { userInfo, setUserInfo, clearUserInfo };
  },
  {
    persist: {
      storage: window.sessionStorage
    }
  }
);
