/*
 * @Description: vue防抖指令 v-debounce
 * @Author: IFLS
 * @Date: 2022-08-01 09:52:41
 * @LastEditTime: 2023-03-23 17:32:55
 */
import Vue from "vue";

const debounce = Vue.directive("debounce", {
  inserted(el, binding) {
    const time = binding.value;

    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        el.style.pointerEvents = "none";
        setTimeout(() => {
          el.disabled = false;
          el.style.pointerEvents = "auto";
        }, time || 3000);
      }
    });
  }
});

export { debounce };
