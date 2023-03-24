/*
 * @Description: 首页api接口
 * @Author: IFLS
 * @Date: 2022-04-22 10:14:40
 * @LastEditTime: 2023-03-23 17:45:06
 */

import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 查询工间操场景列表
export const queryExerciseWorkJobList = () =>
  axios(`${xinao}/exerciseworkjob/page`, { pageIndex: 1, pageSize: 999, status: 1 }, "post");

// 添加反馈
export const insertFeedback = data => axios(`${xinao}/feedbackinfo/insert`, data, "post");

// 签订用户隐私协议
export const setUserAccredit = () => axios(`${xinao}/phr/setUserAccredit`, {}, "post");

// 查询用户协议签署
export const getUserAccredit = () => axios(`${xinao}/phr/queryAuthorizationByUserId`, {}, "post");
// 推荐食堂列表
export const getCanteenListByEmp = data => axios(`${xinao}/healthPlan/canteenListByEmp`, data, "post");
// 饮食原则一句话
export const getDietPrinciples = data => axios(`${xinao}/healthPlan/getUserDietPrinciples`, data, "post");
// 特色餐能量低的时候 加餐接口
export const getEatAdjust = data => axios(`${xinao}/healthPlan/getEatAdjust`, data, "post");

// 获取生命熵数据
export const getCurrentEntropy = data => axios(`${xinao}/lifeEntropyInterpose/entropy/getCurrentEntropy`, data, "post");
