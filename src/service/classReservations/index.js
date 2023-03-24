/*
 * @Description: 场地状态接口
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-23 17:44:52
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

//[约课]获取课程表
export const getSubClassTable = data => axios(`${xinao}/kkThird/getSubClassTable`, data, "post");

//确认预约
export const subClass = data => axios(`${xinao}/kkThird/subClass`, data, "post");

//获取用户约课列表
export const getUserSubClassList = data => axios(`${xinao}/kkThird/getUserSubClassList`, data, "post");

//获取用户历史约课列表
export const getUserSubClassPastList = data => axios(`${xinao}/kkThird/getUserSubClassPastList`, data, "post");

//分页查询运动记录列表
export const getSportPageList = data => axios(`${xinao}/kkThird/getSportPageList`, data, "post");

//查询运动记录汇总数据
export const getSportReportSummary = data => axios(`${xinao}/kkThird/getSportReportSummary`, data, "post");

//查询是否需要补全用户信息
export const queryNeedCompletedRequireInfo = data => axios(`${xinao}/kkThird/completedRequireInfo`, data, "post");

//补全用户上课信息
export const submitUserRequireInfo = data => axios(`${xinao}/kkThird/submitUserRequireInfo`, data, "post");

//分页查询称重记录列表
export const getWeightPageList = data => axios(`${xinao}/kkThird/getWeightPageList`, data, "post");

//========= 扫码 =========
//绑定称重
export const bindWeight = data => axios(`${xinao}/kkThird/bindWeight`, data, "post");

//绑定(替换)膝带，臂带
export const bindSign = data => axios(`${xinao}/kkThird/bindSign`, data, "post");

//获取绑定设备列表
export const getBindDevices = data => axios(`${xinao}/kkThird/getBindDevices`, data, "post");

//========= 场馆 =========
//获取场馆列表 to do
export const getVenueList = data => axios(`${xinao}/kkThird/xxx`, data, "post");
