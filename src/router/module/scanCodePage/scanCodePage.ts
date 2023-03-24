/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-02 10:09:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:44:15
 * @FilePath: \lk-xinaohealth-h5\src\router\module\scanCodePage\scanCodePage.js
 * @Description: ****
 */

export default [
  {
    path: "/scancode-page",
    name: "scanCodePage",
    component: () => import("@/page/scanCodePage/index.vue"),
    meta: {
      title: "扫码",
      showNavBar: true
    }
  }
];
