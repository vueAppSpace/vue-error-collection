import axios from "@/config/axios";
import { xinao } from "@/config/env";
// 自助餐推荐
export const selfRecommend = data => axios(xinao + "/healthPlan/getComponentListByZZ", data, "post");
// 饮食智能推荐
export const commonRecommend = data => axios(xinao + "/healthPlan/getFoodIngredientsRec", data, "post");
// 智能推荐刷新
export const refreshRecommend = data => axios(xinao + "/healthPlan/refreshFoods", data, "post");

// 扫描有氧设备二维码
export const scanQRCode = data => axios(xinao + "/langfangsports/frontLoginFitnessDevice", data, "post");

// 获取推荐的食材列表
export const searchSuggestFoods = data => axios(xinao + "/healthPlan/searchSuggestFoods", data, "post");
