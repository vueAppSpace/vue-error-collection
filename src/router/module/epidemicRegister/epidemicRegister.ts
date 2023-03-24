import { Route } from "vue-router";
export default [
  {
    path: "/epidemicRegister",
    name: "epidemicRegister",
    component: () => import("@/page/epidemicRegister/index.vue"),
    props: (route: Route) => ({ type: route.query.type }),
    meta: {
      // title: "信息登记",
    }
  }
];
