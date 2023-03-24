/*
 * @Description: 我的页面api接口
 * @Author: IFLS
 * @Date: 2022-05-18 13:47:58
 * @LastEditTime: 2023-03-24 14:21:54
 */

import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 获取单人排行榜榜单
export const queryMineRankList = memberCode => {
  return axios(
    `${xinao}/healthpoints/findLeaderboard`,
    {
      // companyPid: 10,
      // companyId,
      memberCode
    },
    "post"
  );
};

// 获取个人排行信息
export const queryExercisePlan = data => axios(`${xinao}/exerciseworksurpassplan/page`, data, "post");

// 更新排行计划
export const updateExercisePlan = data => axios(`${xinao}/exerciseworksurpassplan/update`, data, "post");

// 查询订阅
export const querySubscribe = memberCode => {
  return axios(
    `${xinao}/xinaoemployees/page`,
    {
      memberCode,
      pageSize: 1,
      pageNum: 1
    },
    "post"
  );
};

// 修改订阅
export const updateSubscribe = data => axios(`${xinao}/xinaoemployees/update`, data, "post");

// 获取最近一次体检详情
export const queryLastHealthInfo = memberCode => axios(`${xinao}/phr/getLastInfo`, { memberCode }, "post");

// 健康计划-课程训练
export const queryHealthPlan = () => axios(`${xinao}/healthPlan/getUserOneDayExerciseRecommand`, {}, "post");

// 健康计划-打卡
export const clockIn = data => axios(`${xinao}/healthPlan/exerciseSave`, data, "post");

// 健康计划-打卡查询
export const queryClockState = data => axios(`${xinao}/healthPlan/queryExerciseByUserId`, data, "post");

// 查询二维码
export const queryQRCode = data => axios(`${xinao}/qrcode/randomCreate`, data, "post");

// 查询是否在职
export const queryEmployeeList = data => axios(`${xinao}/sys/employee/list`, data, "post");
