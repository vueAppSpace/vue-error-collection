/*
 * @Description: 诸葛埋点函数
 * @Author: IFLS
 * @Date: 2022-04-25 16:58:33
 * @LastEditTime: 2023-03-23 17:46:47
 */
export default {
  install(Vue) {
    Vue.prototype.zgStatistics = function (eventName, value) {
      if (window.zhuge) {
        zhuge.track(eventName, value);
      }
    };
  }
};
