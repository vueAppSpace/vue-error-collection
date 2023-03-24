/*
 * @Description: 体检报告 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:50:45
 * @LastEditTime: 2023-03-22 11:10:07
 */
export default [
  {
    // 上传报告
    path: "/upload-report",
    name: "uploadReport",
    component: () => import("@/page/uploadReport/index.vue"),
    meta: {
      title: "上传报告"
    }
  },
  {
    // 报告解读
    path: "/report-analysis",
    name: "reportAnalysis",
    component: () => import("@/page/faceReport/analysis.vue"),
    meta: {
      title: "报告解读"
    }
  },
  {
    // 报告列表
    path: "/history",
    name: "history",
    component: () => import("@/page/faceReport/history.vue"),
    meta: {
      title: "健康体检报告"
    }
  },
  {
    // 报告详情
    path: "/reportDetail",
    name: "reportDetail",
    component: () => import("@/page/faceReport/index.vue"),
    meta: {
      title: "报告详情"
    }
  }
];
