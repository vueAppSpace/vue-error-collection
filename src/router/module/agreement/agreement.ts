/*
 * @Description: 隐私协议 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:31:32
 * @LastEditTime: 2023-03-22 10:55:36
 */

export default [
  {
    // 隐私协议
    path: "/agreement",
    name: "agreement",
    component: () => import("@/page/agreement/index.vue"),
    meta: {
      title: "隐私协议"
    }
  }
];
