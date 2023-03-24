/*
 * @Description: 引导页 无权限要求
 * @Author: IFLS
 * @Date: 2022-08-12 14:15:53
 * @LastEditTime: 2023-03-23 17:43:28
 */
import { isMobile } from "@/utils/native/deviceEnv";
import { jsBridge } from "@/utils/native/jsBridge";

export default [
  {
    path: "/",
    redirect: () => {
      if (isMobile) {
        // 避免回退时重复触发重定向
        const isRedirect = JSON.parse(String(sessionStorage.getItem("isRedirect")));

        if (isRedirect) {
          // @ts-ignore
          jsBridge.invoke("closeWebView");
          return;
        } else {
          sessionStorage.setItem("isRedirect", "1");
          return "/health";
        }
      } else {
        return "/health";
      }
    }
  },
  {
    // 引导页
    path: "/guide",
    name: "guidePage",
    component: () => import("@/page/guidePage/index.vue"),
    meta: {
      title: "引导页"
    }
  }
];
