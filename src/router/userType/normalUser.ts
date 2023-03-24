/*
 * @Description: 普通用户 0级权限
 * @Author: IFLS
 * @Date: 2022-08-12 14:00:45
 * @LastEditTime: 2023-03-22 11:14:46
 */

import common from "@/router/module/common";
import health from "@/router/module/health/health0";
import settings from "@/router/module/setting/setting0";
import mine from "@/router/module/mine/mine0";
// import union from "@/router/module/union/union0";
import service from "@/router/module/service/service0";
import assess from "@/router/module/assess/assess0";

export default [
  ...common,
  ...health,
  ...mine,
  ...settings,
  // ...union,
  ...service,
  ...assess
];
