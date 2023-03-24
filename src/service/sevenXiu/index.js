import axios from "@/config/axios";
import { xinao, configUrl } from "@/config/env";

// 字典表-类型列表
export const getSelectListByType = data => axios(configUrl + "/comm/dict/selectListByType", data, "post");
// 七修 tab 列表
export const videoCategoryList = data => axios(xinao + "/videocategory/list", data, "post");
// 七修分类 内容联合列表
export const videoCourseUnionList = data => axios(xinao + "/videocourse/union/page", data, "post");

// 七修课程视频
export const videoInfoList = data => axios(xinao + "/videoinfo/list", data, "post");

// 每日一修
export const healthEverydayStudy = data => axios(xinao + "/healtheverydaystudy/page", data, "post");
