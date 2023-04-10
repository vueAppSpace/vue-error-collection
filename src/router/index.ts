import Vue from "vue";
import Router, { RouterMode } from "vue-router";

import checkPermissions from "@/utils/permissions";
import normalUser from "@/router/userType/normalUser";
import lfNormalUser from "@/router/userType/lfNormalUser";
import testUser from "@/router/userType/testUser";
import lfTestUser from "@/router/userType/lfTestUser";

const getUserRouter = (type: any) => {
  const val = new Map([
    [0, normalUser],
    [1, lfNormalUser],
    [2, testUser],
    [3, lfTestUser]
  ]);
  return val.get(type) || ("" as any);
};

const permission = checkPermissions();
const accessRoutes = getUserRouter(permission);
console.log("用户权限: ", permission);

Vue.use(Router);

let mode: RouterMode = "history";
// #v-ifdef VITE_IFDEF=EMALL
mode = "hash";
// #v-endif

const router = new Router({
  base: "/report",
  mode,
  routes: [...accessRoutes]
});

// // 权限校验
router.beforeEach((to, from, next) => {
  // #v-ifdef VITE_IFDEF=ICOME
  // 若未查看过导航页 跳转去导航 或者从icome页进入 跳转导航
  if (localStorage.getItem("guideShow") !== "1" || to.query.source === "icome") {
    localStorage.setItem("guideShow", "1");
    return next(`/guide?url=${encodeURIComponent(to.fullPath)}`);
  }
  // #v-endif

  if (from.meta.keepAlive) {
    const pageBox = document.querySelector(".page-box");
    const scrollTop = pageBox ? pageBox.scrollTop : 0;
    from.meta.scrollTop = scrollTop;
  }

  // 所有路由跳转时添加icome参数
  const dd = "dd_full_screen";
  if (!to.query[dd]) {
    // 跳转时补全ticket参数
    if (!to.query["ticket"]) {
      // @ts-ignore
      next({ ...to, query: { ...to.query, [dd]: true, ticket: "noticket" } });
    } else {
      // @ts-ignore
      next({ ...to, query: { ...to.query, [dd]: true } });
    }
  } else {
    next();
  }
});

export default router;
