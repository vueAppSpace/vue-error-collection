/*
 * @Description: 服务数据
 * @Author: IFLS
 * @Date: 2022-11-17 14:09:24
 * @LastEditTime: 2023-02-27 15:52:50
 */

// 注意：顺序可以换，对应的 ID 不要改
export default [
  {
    id: "a",
    title: "运动健身",
    // url: "/epidemicRegister?type=1",
    children: [
      {
        id: "a1",
        name: "场地预约",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/changdiyuyue.png",
        url: "/epidemicRegister?type=2"
      },
      // {
      //     name: "团课预约",
      //     picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service-class.png",
      //     url: "/epidemicRegister?type=3",
      // },
      {
        id: "a2",
        name: "云健身",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/yunjianshen.png"
      },
      {
        id: "a3",
        name: "场地状态",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/changdizhuangtai.png",
        url: "/venueStatus"
      },
      {
        id: "a4",
        name: "动感团操",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/donggantuancao.png",
        url: "/class-reservations"
      },
      {
        id: "a5",
        name: "运动课程",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/yundongkecheng.png"
      },
      {
        id: "a6",
        name: "运动历史",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/yundonglishi.png"
      }
    ]
  },
  {
    id: "b",
    title: "医疗健康",
    children: [
      {
        id: "b1",
        name: "健康咨询",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/jiankangzixun.png"
      },
      // {
      //     id: "b2",
      //     name: "预约体检",
      //     picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/yuyuetijian.png",
      // },
      {
        id: "b3",
        name: "报告解读",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/baogaojiedu.png",
        url: "/upload-report?autoback=true&add=true"
      },
      {
        id: "b4",
        name: "预约挂号",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/yuyueguahao.png",
        url: "/appointment"
      }
    ]
  },
  {
    id: "c",
    title: "生活方式",
    children: [
      {
        id: "c1",
        name: "七修养生",
        url: "/seven-xiu",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/qixiuyangsheng.png"
      },
      {
        id: "c2",
        name: "健康百科",
        url: "/health-encyclopedia",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/jiankangbaike.png"
      },
      {
        id: "c3",
        name: "穴位按摩",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/xueweianmo.png"
      },
      {
        id: "c4",
        name: "健康宣教",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/jiankangxuanjiao.png",
        url: "/health-education"
      }
    ]
  },
  {
    id: "d",
    title: "慢病管理",
    children: [
      {
        id: "d1",
        name: "高血压管理",
        url: "/hypertension/pages/index",
        picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/gaoxueya.png"
      },
      {
        id: "d2",
        name: "痛风管理",
        url: "/goutManage/pages/index",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/tongfengguanli.png"
      },
      {
        id: "d3",
        name: "糖尿病管理",
        url: "/diabetesManage/pages/index",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/tangniaobingguanli.png"
      },
      {
        id: "d4",
        name: "体重管理",
        url: "/plumpManage/pages/index",
        picture:
          "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/newIcon/tizhongguanli.png"
      }
    ]
  }
];
