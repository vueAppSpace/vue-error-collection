<!--
 * @Description: 离退报告
 * @Author: IFLS
 * @Date: 2022-12-06 13:59:20
 * @LastEditTime: 2023-03-23 17:41:45
-->
<script>
  import { defineComponent, onMounted } from "@vue/composition-api";
  import { jsBridge } from "@/utils/native/jsBridge";
  import jumpToDanao from "@/utils/jumpToDanao";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    beforeRouteEnter(to, from, next) {
      // 从‘推送’进入
      if (to.query.source === "push") {
        try {
          const entries = performance.getEntriesByType("navigation");
          const popstate = entries.map(nav => nav.type)[0];
          // 判断为推送消息的回退时 直接关闭页面
          if (popstate === "back_forward") {
            jsBridge.invoke("closeWebView");
          } else {
            next();
          }
        } catch (err) {
          next();
        }
      } else {
        // 从‘我的’进入
        if (from.path === "/mine") {
          next();
        } else {
          // 回退情况
          window.history.back();
        }
      }
    },
    setup() {
      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      onMounted(() => {
        const memberId = userInfo.value.memberId;
        jumpToDanao(2, "leavers", `&memberId=${memberId}`);
      });

      return {};
    }
  });
</script>

<template> </template>
