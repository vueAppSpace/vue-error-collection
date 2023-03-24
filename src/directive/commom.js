/**
 * @Description: 常用指令封装
 * @Author: WANGCHENGAE
 * @Date: 2022-11-22 14:57:46
 * @LastEditTime: 2023-1-4 18:00:00
 */
import Vue from "vue";

// 防抖指令
/**
 * 1.不需要传递参数示例:
 * <div v-debounceFn="{ fn: debounceFunction, delay: 2000 }">示例1</div>
 *
 * 2.需要传递参数示例(params 是 debounceFunction 的参数)
 * <div v-debounceFn:params="{ fn: debounceFunction, delay: 2000 }">示例2</div>
 */
const debounceFn = Vue.directive("debounceFn", {
  inserted(el, binding, vnode) {
    let { fn, event = "click", delay = 800 } = binding.value;
    let timerA = null;
    el.addEventListener(
      event,
      () => {
        const argValue = vnode.context[binding.arg];
        if (timerA) {
          clearTimeout(timerA);
          timerA = null;
          timerA = setTimeout(() => {
            fn.call(this, argValue);
            clearTimeout(timerA);
            timerA = null;
          }, delay);
        } else {
          fn.call(this, argValue);
          timerA = setTimeout(() => {
            clearTimeout(timerA);
            timerA = null;
          }, delay);
        }
      },
      false
    );
  }
});

// 节流指令
/**
 * 1.不需要传递参数示例:
 * <div v-throttlingFn="{ fn: throttlingFunction, delay: 2000 }">示例1</div>
 *
 * 2.需要传递参数示例(params 是 throttlingFunction 的参数)
 * <div v-throttlingFn:params="{ fn: throttlingFunction, delay: 2000 }">示例2</div>
 */
const throttlingFn = Vue.directive("throttlingFn", {
  inserted(el, binding, vnode) {
    let { fn, event = "click", delay = 800 } = binding.value;
    let timerB = null;
    let flag = true;

    el.addEventListener(
      event,
      () => {
        const argValue = vnode.context[binding.arg];
        if (flag) {
          flag = false;
          fn.call(this, argValue);
          timerB = setTimeout(() => {
            flag = true;
            clearTimeout(timerB);
            timerB = null;
          }, delay);
        }
      },
      false
    );
  }
});

export { debounceFn, throttlingFn };
