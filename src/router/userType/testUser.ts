/*
 * @Description: 非廊坊测试用户 2级权限
 * @Author: IFLS
 * @Date: 2022-08-12 13:44:31
 * @LastEditTime: 2023-03-22 11:14:54
 */

import common from "@/router/module/common";
import health from "@/router/module/health/health2";
import settings from "@/router/module/setting/setting2";
import mine from "@/router/module/mine/mine2";
// import union from "@/router/module/union/union2";
import service from "@/router/module/service/service2";
import assess from "@/router/module/assess/assess2";

export default [
  ...common,
  ...health,
  ...mine,
  ...settings,
  // ...union,
  ...service,
  ...assess
];
