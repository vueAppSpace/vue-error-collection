/*
 * @Description: 健康百科
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:45:11
 */
import axios from "@/config/axios";
import { xinao, configUrl } from "@/config/env";

//字典表查询-类型
export const selectListByType = async data => axios(`${configUrl}/comm/dict/selectListByType`, data, "post");

//查询类别c端
export const queryCategoryList = data => axios(`${xinao}/articlecategory/clist`, data, "post");

//课程和信息联合分页查询
export const queryUnionArticlePage = data => axios(`${xinao}/articlecourse/union/page`, data, "post");

//文章详情
export const queryArticleDetail = data => axios(`${xinao}/articleinfo/detail`, data, "get");

//文章二级(查询某个分类下的课程列表)
export const queryCategoryArticlesPage = data => axios(`${xinao}/articleinfo/page`, data, "post");

//增加阅读量
export const addArticleReadNum = data => axios(`${xinao}/articleinfo/add/read`, data, "get");
