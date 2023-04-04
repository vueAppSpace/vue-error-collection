/*
 * @Description: 新版首页 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 15:27:06
 * @LastEditTime: 2023-03-24 17:33:41
 */

export default [
  {
    // 新首页-餐食
    path: "/meals",
    name: "meals",
    component: () => import("@/page/meals/index.vue"),
    meta: {
      title: "餐食"
    }
  },
  {
    // 新首页-餐食
    path: "/lunch",
    name: "lunch",
    component: () => import("@/page/meals/lunch.vue"),
    meta: {
      title: "午餐"
    }
  },
  {
    // 菜谱或食材详情
    path: "/dietDetail",
    name: "dietDetail",
    component: () => import("@/page/meals/dietDetail.vue"),
    meta: {
      title: "餐品详情"
    }
  },
  {
    // 菜谱或食材详情
    path: "/foodDetail",
    name: "foodDetail",
    component: () => import("@/page/meals/foodDetail.vue"),
    meta: {
      title: "餐品详情"
    }
  },
  {
    // 食堂列表
    path: "/canteenList",
    name: "canteenList",
    component: () => import("@/page/meals/canteenList.vue"),
    meta: {
      title: "更换食堂"
    }
  },
  {
    // 文章详情
    path: "/articleDetail",
    name: "articleDetail",
    component: () => import("@/page/meals/articleDetail.vue"),
    meta: {
      title: "文章详情"
    }
  },
  {
    // 摄入量记录
    path: "/ADIHistory",
    name: "ADIHistory",
    component: () => import("@/page/meals/ADIHistory.vue"),
    meta: {
      title: "摄入量记录",
      hideFeedBack: true
    }
  },
  {
    // 膳食建议
    path: "/mealSuggest",
    name: "mealSuggest",
    component: () => import("@/page/meals/mealSuggest.vue"),
    meta: {
      title: "膳食建议"
    }
  },
  {
    // 食材推荐
    path: "/foodRecomList",
    name: "foodRecomList",
    component: () => import("@/page/meals/foodRecomList.vue"),
    meta: {
      title: "食材推荐"
    }
  },
  {
    // 选择地址
    path: "/address",
    name: "address",
    component: () => import("@/page/meals/address.vue"),
    meta: {
      title: "选择地址"
    }
  }
];
