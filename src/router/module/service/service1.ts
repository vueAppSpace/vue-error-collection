/*
 * @Description: 服务 权限1
 * @Author: IFLS
 * @Date: 2022-08-12 14:21:44
 * @LastEditTime: 2023-03-22 11:11:43
 */

export default [
  {
    // 服务
    path: "/service",
    name: "service",
    component: () => import("@/page/service/service1/index.vue"),
    meta: {
      title: "健康服务集市",
      keepAlive: true,
      showTab: true,
      showFeedBack: true
    }
  }
];
