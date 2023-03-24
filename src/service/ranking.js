import axios from "../config/axios";
import { xinao, users } from "../config/env";

// 获取单人排行榜榜单
export const rankingPerson = data => axios(xinao + "/healthpoints/findLeaderboard", data, "post");

// 根据排名获取排行榜

export const rankingList = data => axios(xinao + "/healthpoints/findLeaderboardByRownum", data, "post");

// 增加超越计划
export const surpassplanInsert = data => axios(xinao + "/exerciseworksurpassplan/insert", data, "post");

// 排行榜超越记录
export const surpassplanPage = data => axios(xinao + "/exerciseworksurpassplan/page", data, "post");

// 累计奖励积分数

export const integralNum = data => axios(xinao + "/healthpointslog/sumPoints", data, "post");

// 超越计划查询

export const queryPlan = data => axios(xinao + "/exerciseworksurpassplan/page", data, "post");

// 排行榜总量

export const findLeaderboardByCount = data => axios(xinao + "/healthpoints/findLeaderboardByCount", data, "post");

// 我的排名

export const mineInfo = data => axios(xinao + "/healthpointsranking/myRank", data, "get");

// 8.5活动排行榜

export const myRankList = data => axios(xinao + "/healthpointsranking/page", data, "post");

// 模拟运营平台accessToken

export const adminLogin = data => axios(users + "/member/adminLogin", data, "post");
