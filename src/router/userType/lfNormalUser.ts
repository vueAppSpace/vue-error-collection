/*
 * @Description: 廊坊普通用户 1级权限
 * @Author: IFLS
 * @Date: 2022-08-12 14:00:21
 * @LastEditTime: 2023-03-22 11:14:30
 */
import common from "@/router/module/common";
import health from "@/router/module/health/health1";
import settings from "@/router/module/setting/setting1";
import mine from "@/router/module/mine/mine1";
// import union from "@/router/module/union/union1";
import service from "@/router/module/service/service1";
import assess from "@/router/module/assess/assess1";

export default [
  ...common,
  ...health,
  ...mine,
  ...settings,
  // ...union,
  ...service,
  ...assess
];
