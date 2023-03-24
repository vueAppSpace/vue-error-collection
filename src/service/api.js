import axios from "../config/axios";
import { xinao, users } from "../config/env";
// 工间操详情
export const workBreakExercisesDetail = data => axios(xinao + "/exercisework/detail", data, "post");

// 工间操健康传递
export const healthDelivery = data => axios(xinao + "/exerciseworklog/healthDelivery", data, "post");

// 登录
export const login = data => axios(users + "/member/sendMobbleLogin", data, "post");

// 工间操点赞
export const workBreakExercisesLike = data => axios(xinao + "/exercisework/like", data, "post");

// 工间操不喜欢
export const workBreakExercisesDisLike = data => axios(xinao + "/exercisework/dislike", data, "post");

// 播放完成工间操

export const finishedVideo = data => axios(xinao + "/exerciseworklog/finishedVideo", data, "post");

// 工间操评价

export const feedbackVideo = data => axios(xinao + "/exerciseworklog/feedbackVideo", data, "post");

// 正在播放工间操用户操作

export const watchingVideo = data => axios(xinao + "/exerciseworklog/watchingVideo", data, "post");

// 正在播放工间操用户信息
export const getWatchingVideoUsers = data => axios(xinao + "/exerciseworklog/getWatchingVideoUsers", data, "post");

// 使用ICOME ticket 登录平台
// /xh/loginByIcomeTicket
export const getToken = data => axios(xinao + "/xh/loginByIcomeTicket", data, "post");

// 工间操场景绑定工间操
export const relatedExerciseworkjoblink = data => axios(xinao + "/exerciseworkjoblink/page", data, "post");

// 获取用户健康计划

export const getUserPlan = data => axios(xinao + "/healthPlan/getUserPlan", data, "post");

// 每日餐饮推荐

export const getUserMeals = data => axios(xinao + "/healthPlan/getUserMeals", data, "post");

// 获取每日能量摄入量-营养素和供能比(胖胖的你)

export const getUserNutrTargetRatio = data => axios(xinao + "/healthPlan/getUserNutrTargetRatio", data, "post");

// 获取情志推荐

export const getUserEmotion = data => axios(xinao + "/healthPlan/getUserEmotion", data, "post");

// 获取情志睡眠接口,这个接口主查睡眠
export const getUserEmotion2 = data => axios(xinao + "/healthPlan/getUserEmotionV2", data, "post");

// 获取宣教(文章接口)

export const getUserMission = data => axios(xinao + "/healthPlan/getUserMission", data, "post");

// 每日推荐饮食的详情(食材详情)

export const getUserMealsDetail = data => axios(xinao + "/healthPlan/getUserMealsDetail", data, "post");

// 推荐运动

export const exerciseRecommand = data => axios(xinao + "/healthPlan/getUserOneDayExerciseRecommand", data, "post");

export const exerciseTarget = data => axios(xinao + "/healthPlan/exerciseTarget", data, "post");

// 查询每日一修

export const healtheverydaystudyList = data => axios(xinao + "/healtheverydaystudy/page", data, "post");

// 查询健康关怀

export const healthcareList = data => axios(xinao + "/healthcare/page", data, "post");

// 查询本人情致数据

export const queryInterestByUserId = data => axios(xinao + "/healthPlan/queryInterestByUserId", data, "post");

// 新增情致数据

export const interestSave = data => axios(xinao + "/healthPlan/interestSave", data, "post");

// 查询用户宣教(查询用户宣教打卡)

export const getUserMissionRecord = data => axios(xinao + "/healthPlan/getUserMissionRecord", data, "post");

// 用户宣教打卡

export const saveUserMissionRecord = data => axios(xinao + "/healthPlan/saveUserMissionRecord", data, "post");

// 每日饮食推荐

export const getUserMealsRecommand = data => axios(xinao + "/healthPlan/getUserMeals", data, "post");

// 查询用户的饮食记录(用户饮食打卡没打卡)

export const getUserDietRecord = data => axios(xinao + "/healthPlan/getUserDietRecord", data, "post");

// 保存用户某天的饮食记录--饮食打卡

export const saveUserDietRecord = data => axios(xinao + "/healthPlan/saveUserDietRecord", data, "post");

// 晚餐重算

export const dinnerRecommend = data => axios(xinao + "/healthPlan/dinnerRecommend", data, "post");

// 膳食风险提示

export const riskWarning = data => axios(xinao + "/healthPlan/riskWarning", data, "post");

// 食堂列表

export const canteenList = data => axios(xinao + "/healthPlan/canteenList", data, "post");

// 个人点餐列表

export const orderListByEmployeeId = data => axios(xinao + "/phr/getHaveOrder", data, "post");

// 根据食堂id获取推荐菜品

export const getComponentList = data => axios(xinao + "/healthPlan/getComponentList", data, "post");

// 查询点餐宝菜品业务ID

export const getBizField = data => axios(xinao + "/healthPlan/getBizField", data, "post");

// 餐饮建议图片和信息

export const getDishesInfo = data => axios(xinao + "/phr/getDishesInfo", data, "post");

// 餐后饮食建议详情

export const getMealsProposeAndNutrients = data =>
  axios(xinao + "/healthPlan/getMealsProposeAndNutrients", data, "post");

// 查询工间操场景列表
export const queryExerciseWorkJobList = () =>
  axios(`${xinao}/exerciseworkjob/page`, { pageIndex: 1, pageSize: 999, status: 1 }, "post");

// 获取推荐的功法列表

export const searchSuggestGongfa = data => axios(`${xinao}/healthPlan/searchSuggestGongfa`, data, "post");

// 通用课程推荐

export const getExerciseCourse = data => axios(`${xinao}/healthPlan/getExerciseCourse`, data, "post");

//======== 二维码相关逻辑 ========
//1.首页扫一扫 2.Icome 扫一扫 统一二维码回调
export const getUnifyQRCodeCallback = data => axios(`${xinao}/qrcode/getUnifyQRCodeCallback`, data, "get");

//2.二维码短变长
export const icomeRestore = data => axios(`${xinao}/qrcode/icomeRestore`, data, "get");
