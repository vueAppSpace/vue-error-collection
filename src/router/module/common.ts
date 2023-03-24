/*
 * @Description: 通用路由 注意: 新内容请勿在此添加路由 应去对应权限路由中添加
 * @Author: IFLS
 * @Date: 2022-08-12 14:14:58
 * @LastEditTime: 2023-03-22 11:15:59
 */

import guidePage from "@/router/module/guidePage/guidePage";
import activity from "@/router/module/activity/activity";
import integralList from "@/router/module/integralList/integralList";
import workBreakExercisesDetail from "@/router/module/health/workBreakExercisesDetail";
import user from "@/router/module/user";
import retirementReport from "@/router/module/retirementReport";
import achievement from "@/router/module/achievement/achievement";
import integralMall from "@/router/module/integralMall";
import sevenXiu from "@/router/module/sevenXiu/sevenXiu";
import healthEncyclopedia from "@/router/module/healthEncyclopedia/healthEncyclopedia";
import scanCodePage from "@/router/module/scanCodePage/scanCodePage";

export default [
  ...guidePage,
  ...activity,
  ...integralList,
  ...workBreakExercisesDetail,
  ...user,
  ...retirementReport,
  ...achievement,
  ...integralMall,
  ...sevenXiu,
  ...healthEncyclopedia,
  ...scanCodePage
];
