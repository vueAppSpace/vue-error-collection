/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-06 09:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:44:03
 * @FilePath: \lk-xinaohealth-h5\src\router\module\physicalTestRecords\physicalTestRecords.js
 * @Description: 体测记录
 */

export default [
  {
    path: "/physical-test-records",
    name: "physicalTestRecords",
    component: () => import("@/page/physicalTestRecords/index.vue"),
    meta: {
      // title: "体测记录",
      keepAlive: false
    }
  }
];
