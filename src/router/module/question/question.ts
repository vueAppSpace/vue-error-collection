/*
 * @Description: 问卷 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:24:54
 * @LastEditTime: 2023-03-22 11:09:04
 */
export default [
  {
    // 大脑问卷评估
    path: "/danao",
    name: "danao",
    component: () => import("@/page/danaoIframe/index.vue"),
    meta: {
      showTab: false,
      showFeedBack: false
      // showNavBar: false
    }
  }
];
