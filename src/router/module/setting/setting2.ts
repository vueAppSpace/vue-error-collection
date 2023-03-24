/*
 * @Description: 设置 权限2
 * @Author: IFLS
 * @Date: 2022-08-12 14:55:00
 * @LastEditTime: 2023-03-22 11:15:04
 */

// 设置
export default [
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/page/setting/setting2/index.vue"),
    meta: {
      title: "设置",
      keepAlive: true
    }
  }
];
