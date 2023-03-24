/*
 * @Description: 场地状态接口
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-23 17:45:35
 */
import axios from "@/config/axios";
import { xinao } from "@/config/env";

export const getVenueList = data => axios(`${xinao}/langfangsports/corps`, data, "get");
export const getEquipmentList = data => axios(`${xinao}/langfangsports/fitnessDevices`, data, "get");
