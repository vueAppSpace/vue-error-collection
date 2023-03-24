/*
 * @Description: 活动 无权限要求
 * @Author: IFLS
 * @Date: 2022-08-12 14:28:33
 * @LastEditTime: 2023-03-24 17:56:35
 */

export default [
  {
    // 活动
    path: "/activity",
    name: "activity",
    component: () => import("@/page/activity/index.vue"),
    meta: {
      title: "活动",
      keepAlive: false,
      showTab: true,
      showFeedBack: true
    }
  },
  {
    // 活动首页
    path: "/themeActivityHome",
    name: "themeActivityHome",
    component: () => import("@/page/activity/themeActivity/home/home.vue"),
    meta: {
      title: "健康动态",
      keepAlive: true,
      showTab: true,
      showFeedBack: true
    }
  },
  {
    // 活动列表
    path: "/activityList",
    name: "activityList",
    component: () => import("@/page/activity/themeActivity/activityList/activityList.vue"),
    meta: {
      title: "动态列表",
      keepAlive: false,
      showTab: false,
      showFeedBack: false
    }
  },
  {
    // 热门话题
    path: "/topicList",
    name: "topicList",
    component: () => import("@/page/activity/themeActivity/topicList/topicList.vue"),
    meta: {
      title: "热门话题",
      keepAlive: false,
      showTab: false,
      showFeedBack: false
    }
  },
  {
    // 选择话题
    path: "/topicSelect",
    name: "topicSelect",
    component: () => import("@/page/activity/themeActivity/topicList/topicSelect/topicSelect.vue"),
    meta: {
      title: "选择话题",
      keepAlive: false,
      showTab: false,
      showFeedBack: false
    }
  },
  {
    // 话题详情
    path: "/topicDetail",
    name: "topicDetail",
    component: () => import("@/page/activity/themeActivity/topicList/topicDetail/index.vue"),
    meta: {
      title: "话题详情",
      keepAlive: false,
      showTab: false,
      showFeedBack: false
    }
  },
  {
    // 活动详情
    path: "/activityDetail",
    name: "activityDetail",
    component: () => import("@/page/activity/themeActivity/activityDetail/activityDetail.vue"),
    meta: {
      title: "动态详情",
      keepAlive: false,
      showTab: true,
      showFeedBack: false
    }
  },
  {
    // 我的动态
    path: "/myUpdates",
    name: "myUpdates",
    component: () => import("@/page/activity/themeActivity/myUpdates/myUpdates.vue"),
    meta: {
      title: "我的动态",
      keepAlive: false,
      showTab: false,
      showFeedBack: false
    }
  },
  {
    // 打卡
    path: "/rankListActivity",
    name: "rankListActivity",
    component: () => import("@/page/activity/themeActivity/rankList.vue"),
    meta: {
      title: "动态打卡排行",
      showFeedBack: false
    }
  },
  {
    // 选择话题
    path: "/topics",
    name: "topics",
    component: () => import("@/page/activity/themeActivity/topics.vue"),
    meta: {
      title: "选择活动",
      showFeedBack: false
    }
  },
  {
    // 动态详情
    path: "/dynamicDetail",
    name: "dynamicDetail",
    component: () => import("@/page/activity/themeActivity/dynamicDetail.vue"),
    meta: {
      title: "动态详情",
      showFeedBack: false
    }
  },
  {
    // 动态详情
    path: "/publish",
    name: "publish",
    component: () => import("@/page/activity/themeActivity/publish.vue"),
    meta: {
      title: "发动态",
      keepAlive: true,
      showFeedBack: false
    }
  }
];
