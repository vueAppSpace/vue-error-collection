/*
 * @Description: 健康成就
 * @Author: WANGCHENGAE
 * @Date: 2022-12-6 18:00:30
 * @LastEditTime: 2023-03-23 17:44:50
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

export const queryUserAchievements = data => axios(`${xinao}/healthlevel/list`, data, "post");
export const queryUserTopAchievement = data => axios(`${xinao}/healthlevel/maxlevel`, data, "get");
export const queryHealthLevelDetail = data => axios(`${xinao}/healthlevel/detail`, data, "get");
// 使用的配饰
export const ornamentUserCurrent = data => axios(`${xinao}/ornamentuser/current`, data, "get");
// 配饰列表
export const ornamentUserAll = data => axios(`${xinao}/ornamentuser/all`, data, "get");
// 佩戴
export const ornamentUserWear = data => axios(`${xinao}/ornamentuser/wear`, data, "post");
