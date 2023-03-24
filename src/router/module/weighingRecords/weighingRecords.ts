/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-06 09:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:44:33
 * @FilePath: \lk-xinaohealth-h5\src\router\module\weighingRecords\weighingRecords.js
 * @Description: 历史称重记录
 */

export default [
  {
    path: "/weighing-records",
    name: "weighingRecords",
    component: () => import("@/page/weighingRecords/index.vue"),
    meta: {
      title: "历史称重记录",
      keepAlive: true
    }
  }
];
