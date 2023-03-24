/*
 * @Date: 2023-02-27 15:36:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:43:39
 * @FilePath: \lk-xinaohealth-h5\src\router\module\healthEducation\healthEducation.js
 */

export default [
  {
    path: "/health-education",
    name: "healthEducation",
    component: () => import("@/page/healthEducation/index.vue"),
    meta: {
      title: "健康宣教",
      keepAlive: true
    }
  },
  {
    path: "/arcitle-detail",
    name: "arcitleDetail",
    component: () => import("@/page/healthEducation/arcitleDetail.vue"),
    meta: {
      title: "文章详情",
      keepAlive: false
    }
  },
  {
    path: "/search-page",
    name: "searchPage",
    component: () => import("@/page/healthEducation/searchPage.vue"),
    meta: {
      title: "搜索",
      keepAlive: false
    }
  }
];
