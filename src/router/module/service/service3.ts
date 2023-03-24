/*
 * @Description: 服务 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:21:44
 * @LastEditTime: 2023-03-22 11:30:07
 */

export default [
  {
    // 服务
    path: "/service",
    name: "service",
    component: () => import("@/page/service/service3/index.vue"),
    meta: {
      title: "健康服务",
      keepAlive: true,
      showTab: true,
      showFeedBack: true
    }
  },
  {
    // 预约挂号
    path: "/appointment",
    name: "appointment",
    component: () => import("@/page/service/appointment/index.vue"),
    meta: {
      title: "预约挂号"
    }
  }
];
