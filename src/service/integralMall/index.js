/*
 * @Description: 积分商城api
 * @Author: IFLS
 * @Date: 2022-11-18 18:10:31
 * @LastEditTime: 2023-03-23 17:45:13
 */

import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 获取积分列表
// export const queryPointList = (data) => axios(`${xinao}/healthdailytaskspersonal/myPage `, data, "post");
export const queryPointList = data => axios(`${xinao}/healthpointslog/myGroupPage`, data, "post");

// 获取每日任务
export const querydialyTask = () =>
  axios(`${xinao}/healthdailytaskspersonal/myDailyPage`, { pageIndex: 1, pageSize: 999 }, "post");

// 获取当日统计
export const queryTodayData = data =>
  axios(`${xinao}/healthdailytaskspersonal/dilyTasksPersonalByMemberId`, data, "post");
