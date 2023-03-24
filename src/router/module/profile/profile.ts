/*
 * @Description: 编辑资料 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:34:28
 * @LastEditTime: 2023-03-22 11:07:46
 */

export default [
  {
    // 编辑资料
    path: "/profile",
    name: "profile",
    component: () => import("@/page/profile/index.vue"),
    meta: {
      title: "编辑资料",
      keepAlive: true
    }
  }
];
