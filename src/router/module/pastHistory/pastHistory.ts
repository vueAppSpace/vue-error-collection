/*
 * @Description: 既往史 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:45:06
 * @LastEditTime: 2023-03-24 17:56:50
 */

export default [
  {
    // 既往史
    path: "/past-history",
    name: "pastHistory",
    component: () => import("@/page/pastHistory/index.vue"),
    meta: {
      title: "既往史"
    }
  }
  // {
  //   // 既往史详情
  //   path: "/past-history-detail",
  //   name: "pastHistoryDetail",
  //   component: import('@/page/pastHistory/detail.vue'),
  //   meta: {
  //     title: "既往史详情"
  //   }
  // }
];
