/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-01-03 09:00:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:32:49
 * @FilePath: \lk-xinaohealth-h5\src\constants\commonConst.js
 * @Description: ****
 */

//生命熵存储数据: key
export const JUMP_REPORT_DATA = "jumpReportData";

//积分任务类型
export const TaskTypeMap = {
  EW: 1, //"工间操"
  LOGIN: 2, //"登录"
  HD: 3, //"健康传递"
  CY: 4, //"积分超越"
  CYSB: 5, //"超越人失败"
  ACTIVITY: 6, //"活动动态打卡积分"
  MEALS: 7, //"膳食餐饮打卡积分"
  SPORTS: 8, //"运动打卡积分"
  OTHER: 0 //"其他"
};

/**
 * 硬件设备:
 * Icome 扫码 | 我的健康扫码
 */
export const HardwareDeviceType = {
  MYQRCODE: 1000, // "我的二维码"
  //健检部门
  JJHOTMIRROR: 2000, //"热源镜登录"
  JJNEWFOURCHECK: 2010, //"新四诊仪登录"
  //聚合永建
  JHYJAEROBICEQU: 2020, // "有氧设备登录绑定"
  JHYJPHYSICALEQU: 2030 //"体测仪报告绑定"
};

/**
 * 硬件设备: 扫码操作的toast
 */
export const HardwareOptToast = {
  1000: "我的二维码",
  2000: "热源镜登录",
  2010: "新四诊仪登录",
  2020: "有氧设备登录绑定",
  2030: "体测仪报告绑定"
};
