/*
 * @Description: 首页 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:21:03
 * @LastEditTime: 2023-03-22 11:03:07
 */
// 健康
export default [
  {
    // 健康
    path: "/health",
    name: "health",
    component: () => import("@/page/health/health3/index.vue"),
    meta: {
      title: "健康",
      keepAlive: true,
      showTab: true,
      showFeedBack: true,
      scrollTop: 0
    }
  }
];
