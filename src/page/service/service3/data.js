/*
 * @Description: 服务数据
 * @Author: IFLS
 * @Date: 2022-11-17 14:09:24
 * @LastEditTime: 2023-03-23 17:42:03
 */
export default [
  {
    title: "运动服务预约",
    name: "运动历史",
    // url: "/epidemicRegister?type=1",
    children: [
      {
        name: "场地预约",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-space.png",
        url: "/epidemicRegister?type=2"
      },
      // {
      //     name: "团课预约",
      //     picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-class.png",
      //     url: "/epidemicRegister?type=3",
      // },
      {
        name: "云健身",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-workout.png"
      },
      {
        name: "场地状态",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-status.png",
        url: "/venueStatus"
      },
      {
        name: "动感团操",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-kuai.png",
        url: "/class-reservations"
      }
    ]
  },
  {
    title: "健康服务预约",
    children: [
      {
        name: "健康咨询",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-zx.png"
      },
      {
        name: "预约体检",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-tj.png"
      },
      {
        name: "报告解读",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-jd.png",
        url: "/upload-report?autoback=true&add=true"
      },
      {
        name: "预约挂号",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-gh.png",
        url: "/appointment"
      }
    ]
  },
  {
    title: "健康生活方式",
    children: [
      {
        name: "运动健身",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-improve.png"
      },
      {
        name: "七修养生",
        url: "/seven-xiu",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-ys.png"
      },
      {
        name: "健康百科",
        url: "/health-encyclopedia",
        picture: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-he.png"
      },
      {
        name: "穴位按摩",
        picture: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-massage.png"
      },
      {
        name: "健康宣教",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-jkxj.png",
        url: "/health-education"
      }
    ]
  },
  {
    title: "慢病健康管理",
    children: [
      {
        name: "高血压管理",
        url: "/hypertension/pages/index",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-hypertension.png"
      },
      {
        name: "痛风管理",
        url: "/goutManage/pages/index",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-gout.png"
      },
      {
        name: "糖尿病管理",
        url: "/diabetesManage/pages/index",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-diabetes.png"
      },
      {
        name: "体重管理",
        url: "/plumpManage/pages/index",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-weight.png"
      }
    ]
  }
];
