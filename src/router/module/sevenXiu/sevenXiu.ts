/*
 * @Description: 七修养生
 * @Author: IFLS
 * @Date: 2022-11-16 09:55:52
 * @LastEditTime: 2023-03-23 17:44:26
 */

export default [
  {
    // 七修养生
    path: "/seven-xiu",
    name: "sevenXiu",
    component: () => import("@/page/sevenXiu/index.vue"),
    meta: {
      title: "七修养生",
      keepAlive: true
    }
  },
  {
    // 七修养生-课程
    path: "/seven-xiu-course",
    name: "sevenXiuCourse",
    component: () => import("@/page/sevenXiu/course.vue"),
    meta: {
      title: ""
    }
  },
  {
    // 每日一修
    path: "/daily-xiu",
    name: "dailyXiu",
    component: () => import("@/page/sevenXiu/dailyXiu.vue"),
    meta: {
      title: "每日一修"
    }
  }
];
