/*
 * @Description: 健康管理接口
 * @Author: IFLS
 * @Date: 2022-01-04 10:16:02
 * @LastEditTime: 2023-03-23 17:45:42
 */
import axios from "../config/axios";
import { platform, healthUrlRecommend } from "../config/env";

//运动推荐
export const getSportOrDietRecommand = data =>
  axios(healthUrlRecommend + "/management/getSportOrDietRecommand", data, "post");

export const queryRecommand = data => axios(healthUrlRecommend + "/management/foodOrCookbookRecommand", data, "post");
export const querySportOrDietRecommand = data =>
  axios(healthUrlRecommend + "/management/getSportOrDietRecommand", data, "post");
export const queryCookDetail = data =>
  axios(healthUrlRecommend + `/management/getCookbookDetail?cookbookName=${data}`, {}, "get");
export const queryFoodDetail = data =>
  axios(healthUrlRecommend + `/management/getFoodDetail?foodName=${data}`, {}, "get");
export const queryTagDetail = data => axios(healthUrlRecommend + `/management/tagContent?tagName=${data}`, {}, "get");
export const queryListByType = () =>
  axios(platform + "/config/comm/dict/selectListByType", { dictType: "meal_type" }, "post");

// 每日推荐饮食的详情

export const queryList1 = data => axios(platform + "/xinaohealth/healthPlan/getUserMealsDetail", data, "post");

// 新的食材详情接口

export const queryList = data => axios(platform + "/xinaohealth/healthPlan/ingredDetailWithHealth", data, "post");

// 食谱推荐

export const searchRelRecipe = data => axios(platform + "/xinaohealth/healthPlan/searchRelRecipe", data, "post");
