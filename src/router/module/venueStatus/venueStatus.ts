/*
 * @Description: 场地状态
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-23 17:44:35
 */

import { Route } from "vue-router";

export default [
  {
    path: "/venueStatus",
    name: "venueStatus",
    component: () => import("@/page/venueStatus/index.vue"),
    props: (route: Route) => ({ type: route.query.type }),
    meta: {
      title: "场地状态"
    }
  }
];
