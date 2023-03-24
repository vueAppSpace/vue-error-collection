/*
 * @Description: 设置 权限0
 * @Author: IFLS
 * @Date: 2022-08-12 14:55:00
 * @LastEditTime: 2023-03-22 11:13:25
 */

// 设置
export default [
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/page/setting/setting0/index.vue"),
    meta: {
      title: "设置",
      keepAlive: true
    }
  }
];
