/*
 * @Description: 首页 权限2
 * @Author: IFLS
 * @Date: 2022-08-12 14:16:51
 * @LastEditTime: 2023-03-22 11:02:54
 */
// 健康
export default [
  {
    // 健康
    path: "/health",
    name: "health",
    component: () => import("@/page/health/health2/index.vue"),
    meta: {
      title: "健康新奥-工间操",
      keepAlive: true,
      showTab: true,
      showFeedBack: true,
      scrollTop: 0
    }
  }
];
