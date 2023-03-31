/*
 * @Description: 离退报告
 * @Author: IFLS
 * @Date: 2022-12-06 14:13:28
 * @LastEditTime: 2023-03-31 17:57:58
 */
export default [
  {
    path: "/retirement-report",
    name: "retirementReport",
    component: () => import("@/page/retirementReport/index.vue"),
    meta: {
      title: "加载中"
    }
  },
  // #v-ifdef VITE_IFDEF=EMALL
  {
    path: "/transit",
    name: "transit",
    component: () => import("@/page/transit/index.vue"),
    meta: {
      title: ""
    }
  }
  // #v-endif
];
