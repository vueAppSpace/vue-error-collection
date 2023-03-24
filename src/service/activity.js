/*
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-07-01 10:30:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:45:37
 * @FilePath: \workBreakExercises\src\service\activity.js
 * @Description: 活动的接口
 */
import axios from "../config/axios";
import { xinao, configUrl, users } from "../config/env";
// 活动列表
export const activityinfo = data => axios(xinao + "/activityinfo/page", data, "post");
// 活动详情
export const activityDetail = data => axios(xinao + "/activityinfo/detail", data, "post");
// 动态列表
export const getDynamicList = data => axios(xinao + "/activity/dynamic/getDynamicList", data, "post");
// 评论
export const getUserComm = data => axios(xinao + "/activity/comment/getUserComm", data, "post");
// 点赞
export const likeInsert = data => axios(xinao + "/activity/like/insert", data, "post");
// 查询是否点赞
export const activityLikePage = data => axios(xinao + "/activity/like/page", data, "post");
// 取消点赞
export const realDelete = data => axios(xinao + "/activity/like/realDelete", data, "post");
// 评论
export const commentInsert = data => axios(xinao + "/activity/comment/insert", data, "post");
// 查询字典
export const selectListByType = data => axios(configUrl + "/comm/dict/selectListByType", data, "post");

// 发布动态接口
export const publish = data => axios(xinao + "/activity/dynamic/insert", data, "post");
// 获取活动列表
export const getTopics = data => axios(xinao + "/activityinfo/page", data, "post");
// 获取动态详情
export const getDyanamics = data => axios(xinao + "/activity/dynamic/getDynamicDetail", data, "post");
// 获取用户评论接口
export const getUserComments = data => axios(xinao + "/activity/comment/getUserComm", data, "post");
// 获取动态打卡
export const queryClockInList = data => axios(xinao + "/activity/like/queryClockInList", data, "post");
// 获取活动详情接口
export const activeDetail = data => axios(xinao + "/activityinfo/detail", data, "post");
// 我的动态统计
export const getPersonCount = data => axios(xinao + "/activity/dynamic/getPersonCount", data, "post");
// 上传视频
export const uploadPic = data => axios(`${users}/file/uploadAndGet`, data, "post", "", true);

// 查询二级评论
export const activitysecondcommentPage = data =>
  axios(xinao + "/activitysecondcomment/getUserSecondComm", data, "post");
// 新增二级评论
export const activitysecondcommentInsert = data => axios(xinao + "/activitysecondcomment/insert", data, "post");

// 最热话题列表
export const getListByHot = data => axios(xinao + "/activitytopicinfo/getListByHot", data, "post");
// 获取话题详细
export const activitytopicinfoDetail = data => axios(xinao + "/activitytopicinfo/detail", data, "post");
