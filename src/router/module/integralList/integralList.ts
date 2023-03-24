/*
 * @Description: 积分排行榜 无权限要求
 * @Author: IFLS
 * @Date: 2022-08-12 15:26:09
 * @LastEditTime: 2023-03-23 17:43:44
 */

export default [
  {
    // 积分排行榜
    path: "/rank",
    name: "integralList",
    component: () => import("@/page/integralList/index.vue"),
    meta: {
      title: "健康积分排行榜"
    }
  },

  {
    // 积分超越记录
    path: "/record",
    name: "surpassList",
    component: () => import("@/page/integralList/rankList.vue"),
    meta: {
      title: "健康积分超越记录"
    }
  },
  {
    // 活动排行榜
    path: "/rankList",
    name: "rankList",
    component: () => import("@/page/integralList/surpassList.vue"),
    meta: {
      title: "排行榜",
      showFeedBack: false
    }
  },
  {
    // 活动详情
    path: "/activityDetail2",
    name: "activityDetail2",
    component: () => import("@/page/integralList/activityDetail.vue"),
    meta: {
      title: "活动详情",
      keepAlive: true,
      hideFeedBack: true
    }
  }
];
