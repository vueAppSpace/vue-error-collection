<!--
 * @Description: 中转页
 * @Author: IFLS
 * @Date: 2023-03-31 16:53:12
 * @LastEditTime: 2023-03-31 17:54:33
-->

<script>
  import { defineComponent, onMounted } from "@vue/composition-api";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  import { Toast } from "vant";
  import { jumpToDanaoPretreat } from "@/utils/lifeEntropyMethod";
  import { jumpToSportGym } from "@/utils/jumpToSportGym";

  export default defineComponent({
    beforeRouteEnter(to, from, next) {
      // 从vue实例内的页面跳转过来 直接关闭webview
      if (from.path !== "/") {
        return jsBridge.invoke("closeWebView");
      }
      // 缺少type
      if (!to.query.type) {
        return Toast("url传参异常:缺少type");
      }
      try {
        // 从其他网址跳转过来
        const entries = performance.getEntriesByType("navigation");
        const popstate = entries.map(nav => nav.type)[0];
        // 判断为回退时 直接关闭页面
        if (popstate === "back_forward") {
          jsBridge.invoke("closeWebView");
        } else {
          // 非回退时 正常加载页面
          next();
        }
      } catch (err) {
        next();
      }
    },
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const eventFn = {
        sjjkda: () => jumpToDanaoPretreat(4, "", router), // 三济健康档案
        sjjkbg: () => jumpToDanaoPretreat(2, "SJreport", router), // 三济健康报告
        yjs: () => jumpToSportGym({ type: 7 }), // 云健身
        cdyy: () => router.push("/epidemicRegister?type=2"), // 场地预约
        dgtc: () => router.push("/class-reservations"), // 动感团操
        bgjd: () => router.push("/upload-report?autoback=true&add=true"), // 报告解读
        yyjl: () => router.push("physical-test-records?navTitle=预约记录"), // 运动预约记录
        wdjk: () => router.push("/health") // 我的健康,
      };

      const trigger = type => {
        const T = new Map(Object.entries(eventFn));
        const fn = T.get(type);
        if (!fn) return Toast(`url传参异常:type=${type}`);
        fn();
      };

      onMounted(() => {
        const { type } = route.value.query;
        trigger(type);
      });

      return {};
    }
  });
</script>

<template> </template>
