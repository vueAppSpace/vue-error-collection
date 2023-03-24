export default [
  {
    // 健康成就详情
    path: "/achievement-detail",
    name: "achievementDetail",
    component: () => import("@/page/achievement/detail.vue"),
    meta: {
      title: "健康成就",
      showNavBar: false
    }
  },
  {
    // 健康成就列表页
    path: "/achievement",
    name: "achievement",
    component: () => import("@/page/achievement/index.vue"),
    props: (route: any) => ({ points: route.query.points }),
    meta: {
      title: "健康成就"
    }
  },
  {
    // 配饰
    path: "/ornament",
    name: "ornament",
    component: () => import("@/page/achievement/ornament.vue"),
    props: (route: any) => ({ type: route.query.type }),
    meta: {
      title: "配饰"
    }
  }
];
