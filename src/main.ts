/*
 * @Author: your name
 * @Date: 2020-09-04 17:59:02
 * @LastEditTime: 2023-04-18 14:20:25
 * @LastEditors: wangcheng357
 * @Description: In User Settings Edit
 * @FilePath: \lk-vite-error-collection\src\main.ts
 */
import "@/style/root.css";
import "amfe-flexible";
import Vue from "vue";
import App from "./App.vue";
import VueCompositionAPI from "@vue/composition-api";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@/directive/debounce";
// 埋点函数注册
import zgGloable from "@/directive/track";
import "@/directive/commom";
import Vant from "vant";
import { Lazyload } from "vant";
import { getToken, setToken } from "@/utils/setToken";
//引入vue-video-player视频插件 video.js的vue版本
import "@/utils/zhChVideojs";
import VideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import "@/style/myVideo.css"; //调整视频播放的样式
Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(VideoPlayer);
Vue.use(zgGloable);
Vue.use(VueCompositionAPI);
const pinia = createPinia();
Vue.use(PiniaVuePlugin);
pinia.use(piniaPluginPersistedstate);
Vue.config.productionTip = false;

//err-collection ===>
//全局捕获vue组件错误(template 类型错误)
//追踪运行时错误(指定组件的渲染和观察期间未捕获错误的处理函数)
//生命周期钩子里的错误

// Vue.config.errorHandler = (err, vm, info) => {
//   console.log("[Vue.config.errorHandler] 捕获到错误");
//   console.log(err);
//   console.log(info);
//   console.log(vm);
//   //直接扔给 onerror 处理
//   // throw err;
// };

(async () => {
  const data = await getToken();
  setToken(data);
  const { default: router } = await import("./router");
  new Vue({
    router,
    pinia,
    render: h => h(App)
  }).$mount("#app");
})();
