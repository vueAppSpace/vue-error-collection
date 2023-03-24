/*
 * @Description: 健康测评 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:32:56
 * @LastEditTime: 2023-03-22 11:00:00
 */

export default [
  {
    // 健康测评
    path: "/evaluate",
    name: "evaluate",
    component: () => import("@/page/evaluate/index.vue"),
    meta: {
      title: "健康测评"
      // showNavBar: false
    }
  }
];
