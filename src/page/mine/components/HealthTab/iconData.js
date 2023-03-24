/*
 * @Description: 健康计划tab选项卡
 * @Author: IFLS
 * @Date: 2022-11-15 16:26:06
 * @LastEditTime: 2023-03-23 17:40:58
 */
export default [
  {
    name: "健康计划",
    children: [
      {
        name: "预约记录",
        url: "/physical-test-records?navTitle=预约记录",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan/1.png"
      },
      {
        name: "运动记录",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan/2.png"
      },
      // {
      //     name: "饮食记录",
      //     picture: 'https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan/3.png'
      // },
      {
        name: "膳食建议",
        url: "/mealSuggest",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan/5.png"
      }
      // {
      //     name: "情志记录",
      //     picture: 'https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan/4.png'
      // },
    ]
  },
  {
    name: "健康档案",
    children: [
      {
        name: "三济健康报告",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/1.png"
      },
      {
        name: "三济健康档案",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/2.png"
      },
      {
        name: "体测记录",
        url: "/physical-test-records?navTitle=体测记录",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/5.png"
      },
      {
        name: "体检报告",
        url: "/report-analysis",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/3.png"
      }
      // {
      //     name: "离退报告",
      //     picture: 'https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/4.png'
      // },
    ]
  }
];
