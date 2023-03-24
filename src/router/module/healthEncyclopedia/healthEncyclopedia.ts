/*
 * @Description: 健康百科
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:43:42
 */
import { Route } from "vue-router";

export default [
  {
    path: "/health-encyclopedia",
    name: "healthEncyclopedia",
    component: () => import("@/page/healthEncyclopedia/index.vue"),
    meta: {
      title: "健康百科",
      keepAlive: true
    }
  },

  {
    path: "/health-encyclopedia-course",
    name: "encyclopediaCourse",
    component: () => import("@/page/healthEncyclopedia/course.vue"),
    props: (route: Route) => ({ id: route.query.id }),
    meta: {
      title: "",
      keepAlive: true
    }
  },

  {
    path: "/health-encyclopedia-detail",
    name: "encyclopediaDetail",
    component: () => import("@/page/healthEncyclopedia/detail.vue"),
    props: (route: Route) => ({ id: route.query.id }),
    meta: {
      title: "文章详情",
      keepAlive: false
    }
  }
];
