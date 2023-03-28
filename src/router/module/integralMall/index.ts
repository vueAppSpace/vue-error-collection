/*
 * @Description: 积分商城 权限3
 * @Author: IFLS
 * @Date: 2022-11-16 09:55:52
 * @LastEditTime: 2023-03-28 14:10:23
 */

export default [
  {
    // 积分账单
    path: "/integral-bill",
    name: "integralBill",
    component: () => import("@/page/integralMall/bill.vue"),
    meta: {
      title: "积分账单"
    }
  },
  {
    // 每日任务
    path: "/integral-task",
    name: "integralTask",
    component: () => import("@/page/integralMall/task.vue"),
    meta: {
      title: "每日任务"
    }
  },
  {
    // 积分商城
    path: "/integral-mall",
    name: "integralMall",
    component: () => import("@/page/integralMall/mall.vue"),
    meta: {
      title: "积分商城"
    }
  }
];
