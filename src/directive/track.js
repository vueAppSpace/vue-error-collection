/*
 * @Description:
 * @Author: IFLS
 * @Date: 2022-09-15 14:16:24
 * @LastEditTime: 2023-03-23 17:32:57
 */
import Vue from "vue";

const zg = (n, d) => window.zhuge && zhuge.track(n, d);

// 指令
Vue.directive("track", {
  bind(el, binding) {
    const { type, name, data } = binding.value;
    el.__zg__ = () => {
      try {
        zg(name, JSON.parse(data));
      } catch (e) {
        console.error("埋点参数异常, 请检查v-track指令data参数是否为json格式: ", { name, data });
      }
    };
    // 页面加载时触发的埋点
    if (type === "onload") {
      el.__zg__();
    } else {
      // 点击事件触发的埋点
      el.addEventListener("click", el.__zg__, false);
    }
  },
  unbind(el) {
    el.removeEventListener("click", el.__zg__);
  }
});
// 全局挂载
const zgGloable = {
  install(Vue) {
    Vue.prototype.zgStatistics = (name, data) => {
      zg(name, data);
    };
  }
};

export default zgGloable;

// v-track='{ type: "click", name: "健康新奥-点击下方功能菜单", data: `{"菜单名称": "${item.name}}"` }'
