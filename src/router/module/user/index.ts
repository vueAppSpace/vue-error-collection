/*
 * @Description: 选择用户版面
 * @Author: IFLS
 * @Date: 2022-12-05 15:11:55
 * @LastEditTime: 2023-03-22 11:15:37
 */

// 用户选择
export default [
  {
    path: "/user",
    name: "user",
    component: () => import("@/page/user/index.vue"),
    meta: {
      // title: "选择用户",
      controlBack: true
    }
  }
];
