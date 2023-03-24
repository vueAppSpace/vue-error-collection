/*
 * @Description: 抽奖api接口
 * @Author: IFLS
 * @Date: 2023-02-08 14:03:58
 * @LastEditTime: 2023-03-23 17:45:17
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 查询系统配置
export const querySysConfig = () => axios(`${xinao}/sysconfig/detail`, { param: "point_num" }, "get");
// 查询奖品列表
export const queryLotteryList = () => axios(`${xinao}/raffleprizes/pool/list`, {}, "get");
// 抽奖
export const luckyDraw = () => axios(`${xinao}/rafflerecord/draw`, {}, "post");
// 查询中奖名单
export const queryLotteryRecord = data => axios(`${xinao}/rafflewinrecord/roll/page`, data, "post");
// 查询剩余积分
export const queryHealthPointByMemberCode = data => axios(`${xinao}/healthpoints/getPointsByMemberCode`, data, "post");
// 我的奖品
export const mineWinnerRecord = data => axios(`${xinao}/rafflewinrecord/my/page`, data, "post");
// 奖品详情
export const lotteryDetail = id => axios(`${xinao}/rafflewinrecord/detail`, { id }, "get");
// 更新奖品状态
export const updateLottery = data => axios(`${xinao}/rafflewinrecord/update`, data, "post");
