import axios from "../config/axios";
import { xinao, users } from "../config/env";

// 获取健康档案列表
export const list = data => axios(xinao + "/phr/getList", data, "post");

// 健康档案详情
export const reportDetail = data => axios(xinao + "/phr/getInfo", data, "post");
