/*
 * @Description: 健康问答api
 * @Author: IFLS
 * @Date: 2022-06-29 10:03:23
 * @LastEditTime: 2023-03-23 17:44:59
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 查询问卷
export const queryAndSaveAnswer = data => axios(`${xinao}/phr/getHealthEnnQaAnswer`, data, "post");
