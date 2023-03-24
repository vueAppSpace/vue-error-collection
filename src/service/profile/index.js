/*
 * @Description: 编辑资料api
 * @Author: IFLS
 * @Date: 2022-06-17 18:55:35
 * @LastEditTime: 2022-07-04 11:34:47
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 个人信息查询
export const queryUserPortrait = data => axios(`${xinao}/phr/getUserPortrait`, data, "post");

// 个人信息修改
export const updateUserPortrait = data => axios(`${xinao}/phr/updateUserPortrait`, data, "post");

// 既往史查询
export const queryDiseaseProfile = data => axios(`${xinao}/standardData/getLkDiseaseProfileDictionary`, data, "post");
