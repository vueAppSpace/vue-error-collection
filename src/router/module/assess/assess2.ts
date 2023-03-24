/*
 * @Description: 评估页 2级权限
 * @Author: IFLS
 * @Date: 2022-11-22 14:00:33
 * @LastEditTime: 2023-03-22 10:58:56
 */

export default [
  {
    // 服务
    path: "/assess",
    name: "assess",
    component: () => import("@/page/assess/assess2/index.vue"),
    meta: {
      title: "评估",
      keepAlive: true,
      showTab: true,
      showFeedBack: true
    }
  }
];
