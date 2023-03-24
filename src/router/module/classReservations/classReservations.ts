/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-06 09:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:43:19
 * @FilePath: \lk-xinaohealth-h5\src\router\module\classReservations\classReservations.js
 * @Description: 动感团操路由配置
 */

export default [
  {
    path: "/class-reservations",
    name: "classReservations",
    component: () => import("@/page/classReservations/index.vue"),
    meta: {
      title: "动感团操",
      keepAlive: true
    }
  },
  {
    path: "/class-reservations-fill-info",
    name: "classReservationsFillInfo",
    component: () => import("@/page/classReservations/fillInfo.vue"),
    meta: {
      title: "填写信息",
      keepAlive: false
    }
  },

  {
    path: "/class-reservations-record",
    name: "classReservationsRecord",
    component: () => import("@/page/classReservations/Record.vue"),
    meta: {
      title: "约课记录",
      keepAlive: true
    }
  },

  {
    path: "/class-reservations-report",
    name: "classReservationsReport",
    component: () => import("@/page/classReservations/Report.vue"),
    meta: {
      title: "运动报告",
      keepAlive: true
    }
  },

  {
    path: "/class-reservations-bind-devices",
    name: "classReservationsBindDevices",
    component: () => import("@/page/classReservations/BindDevices.vue"),
    meta: {
      title: "设备绑定",
      keepAlive: false
    }
  }
];
