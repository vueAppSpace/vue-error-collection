/*
 * @Description: 选择用户版面
 * @Author: IFLS
 * @Date: 2022-12-05 15:11:55
 * @LastEditTime: 2023-03-24 17:56:54
 */

// 用户选择
export default [
  {
    path: "/user",
    name: "user",
    component: () => import("@/page/user/index.vue"),
    meta: {
      // title: "选择用户",
    }
  }
];
