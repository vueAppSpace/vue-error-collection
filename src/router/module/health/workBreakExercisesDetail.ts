/*
 * @Description: 工间操详情 无权限要求
 * @Author: IFLS
 * @Date: 2022-08-12 15:32:41
 * @LastEditTime: 2023-03-24 17:56:45
 */

// 每日工间操详情
export default [
  {
    // 每日工间操
    path: "/workBreakExercisesDetail",
    name: "workBreakExercisesDetail",
    component: () => import("@/page/workBreakExercisesDetail/index.vue"),
    meta: {
      title: "焕能工间操"
      // 页面控制navbar返回功能
    }
  }
];
