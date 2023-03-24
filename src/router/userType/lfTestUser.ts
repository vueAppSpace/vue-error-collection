/*
 * @Description: 廊坊测试用户 3级权限
 * @Author: IFLS
 * @Date: 2022-08-12 13:44:31
 * @LastEditTime: 2023-03-23 14:14:21
 */

import common from "@/router/module/common";
import agreement from "@/router/module/agreement/agreement";
import evaluate from "@/router/module/evaluate/evaluate";
import meals from "@/router/module/meals/meals";
import pastHistory from "@/router/module/pastHistory/pastHistory";
import profile from "@/router/module/profile/profile";
// import question from "@/router/module/question/question";
import report from "@/router/module/report/report";
import health from "@/router/module/health/health3";

import mine from "@/router/module/mine/mine3";
import setting from "@/router/module/setting/setting3";
// import union from "@/router/module/union/union3";
import service from "@/router/module/service/service3";
// import union from "@/router/module/union/union2";
// import service from "@/router/module/service/service2";
// import diancan from "@/router/module/diancan/diancan";
import feedBack from "@/router/module/feedBack/feedBack";
import epidemicRegister from "@/router/module/epidemicRegister/epidemicRegister";
import venueStatus from "@/router/module/venueStatus/venueStatus";
import classReservations from "@/router/module/classReservations/classReservations";
import physicalTestRecords from "@/router/module/physicalTestRecords/physicalTestRecords";
import weighingRecords from "@/router/module/weighingRecords/weighingRecords";
import lottery from "@/router/module/lottery";
import healthEducation from "@/router/module/healthEducation/healthEducation";

export default [
  ...common,
  ...agreement,
  ...evaluate,
  ...meals,
  ...pastHistory,
  ...profile,
  // ...question,
  ...report,
  ...health,
  ...mine,
  ...setting,
  // ...union,
  ...service,
  // ...diancan,
  ...feedBack,
  ...epidemicRegister,
  ...venueStatus,
  ...classReservations,
  ...physicalTestRecords,
  ...weighingRecords,
  ...lottery,
  ...healthEducation
];
