/*
 * @Description: 任务类型字典
 * @Author: IFLS
 * @Date: 2022-11-18 18:09:49
 * @LastEditTime: 2023-03-23 17:37:10
 */
import jumpToDanao from "@/utils/jumpToDanao";

export const translateTargetUrl = type => {
  const val = new Map([
    ["1", "/health"], // 工间操
    ["2", "/health"], // 登录
    ["3", "/health"], // 健康传递
    ["4", "/rank"], // 积分超越
    ["5", "/health"], // 超越人失败
    ["6", "/themeActivityHome"], // 活动动态打卡
    ["7", "/ADIHistory?type=0"], // 膳食餐饮打卡
    ["8", () => jumpToDanao(2, "sportList")], // 运动打卡
    ["0", "/health"] // 其他
  ]);
  return val.get(type) || "/health";
};

export const translateName = val => {
  const arrMap = new Map([
    [1, "工间操"], // 工间操
    [2, "登录"], // 登录
    [3, "健康传递"], // 健康传递
    [4, "积分超越"], // 积分超越
    [5, "超越人失败"], // 超越人失败
    [6, "活动动态打卡"], // 活动动态打卡
    [7, "膳食餐饮打卡"], // 膳食餐饮打卡
    [8, "运动打卡"], // 运动打卡
    [-11, "健康积分福利商城兑换"], // icome减少积分
    [-12, "积分抽奖"], // 积分抽奖
    [11, "健康积分福利商城取消兑换"], // icome返还积分
    [12, "积分抽奖返还"], // 积分抽奖
    [0, val.remark] // 其他
  ]);
  return arrMap.get(val.source) || "其他";
};
