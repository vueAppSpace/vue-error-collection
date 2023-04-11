export default [
  // 健康签到
  {
    path: "/signIn",
    name: "signIn",
    component: () => import("@/page/signIn/index.vue"),
    meta: {
      title: "健康签到"
    }
  }
];
