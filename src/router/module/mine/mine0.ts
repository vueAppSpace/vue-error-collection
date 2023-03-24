/*
 * @Description: 我的 权限0
 * @Author: IFLS
 * @Date: 2022-08-12 14:30:12
 * @LastEditTime: 2023-03-22 11:04:57
 */
export default [
  {
    // 我的
    path: "/mine",
    name: "mine",
    component: () => import("@/page/mine/mine0/index.vue"),
    meta: {
      title: "我的",
      keepAlive: true,
      showTab: true,
      showFeedBack: true,
      scrollTop: 0
    }
  }
];
