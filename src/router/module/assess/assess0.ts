/*
 * @Description: 评估页 无权限要求
 * @Author: IFLS
 * @Date: 2022-11-22 14:00:33
 * @LastEditTime: 2023-03-22 10:59:12
 */

export default [
  {
    // 服务
    path: "/assess",
    name: "assess",
    component: () => import("@/page/assess/assess0/index.vue"),
    meta: {
      title: "评估",
      keepAlive: true,
      showTab: true,
      showFeedBack: true
    }
  }
];
