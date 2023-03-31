import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 运动中心 详情
export const fetchSportCenterDetail = data => axios(`${xinao}/iotsportcenter/detail`, data, "post");
export const fetchSportCenterList = data => axios(`${xinao}/iotsportcenter/page`, data, "post");
// 获取第三方应用token
export const getThirdUserToken = () => axios(`${xinao}/lkThird/getThirdUserToken`, { appCode: "sportsCenter" }, "get");
// 获取教练端token
export const getCoachToken = () => axios(`${xinao}/lkThird/getCoachToken`, { appCode: "sportsCenter" }, "get");
// 获取三疗小程序url
export const getUrlLink = () => axios(`${xinao}/lkThird/getUrlLink`, {}, "post");
// 获取随机咨询师
export const getCounselor = () => axios(`${xinao}/consultant/random`, {}, "post");
// 记录咨询数据
export const insertRecord = data => axios(`${xinao}/consultationrecord/insert`, data, "post");

// 查询 banner
export const getHealthShufflingFigure = data => axios(`${xinao}/healthshufflingfigure/page`, data, "post");
// 查询我的服务
export const getHealthService = data => axios(`${xinao}/healthservice/page`, data, "post");
// 添加我的服务
export const healthServiceInsert = data => axios(`${xinao}/healthservice/insert`, data, "post");
// 修改我的服务
export const healthServiceUpdate = data => axios(`${xinao}/healthservice/update`, data, "post");
// banner 图片点击量
export const bannerAddClick = data => axios(`${xinao}/healthshufflingfigureimg/addClick`, data, "post");
