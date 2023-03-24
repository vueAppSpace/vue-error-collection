/*
 * @Description: 疫情接口
 * @Author: WANGCHENGAE
 * @Date: 2022-11-17 18:00:30
 * @LastEditTime: 2022-11-21 14:57:46
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

export const insertEpidemicRegister = data => axios(`${xinao}/register/insert`, data, "post");
export const queryUserNeededRegister = data => axios(`${xinao}/register/user/info`, data, "get");
