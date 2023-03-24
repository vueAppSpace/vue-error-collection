/*
 * @Description: 抽奖 权限3
 * @Author: IFLS
 * @Date: 2023-02-03 09:55:52
 * @LastEditTime: 2023-03-22 11:20:53
 */
export default [
  {
    // 积分账单
    path: "/lottery-home",
    name: "lotteryHome",
    component: () => import("@/page/lottery/index.vue"),
    meta: {
      title: "积分抽奖"
    }
  },
  {
    // 我的奖品
    path: "/lottery-list",
    name: "lotteryList",
    component: () => import("@/page/lottery/list.vue"),
    meta: {
      title: "我的奖品"
    }
  },
  {
    // 奖品领取
    path: "/lottery-gift",
    name: "lotteryGift",
    component: () => import("@/page/lottery/gift.vue"),
    meta: {
      title: "奖品领取"
    }
  },
  {
    // 奖品领取
    path: "/lottery-express",
    name: "lotteryExpress",
    component: () => import("@/page/lottery/express.vue"),
    meta: {
      title: "奖品领取"
    }
  }
];
