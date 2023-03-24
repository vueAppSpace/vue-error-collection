/*
 * @Description: 选择用户api
 * @Author: IFLS
 * @Date: 2022-12-06 11:28:28
 * @LastEditTime: 2023-03-23 17:45:33
 */

import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 查询用户角色
export const queryUserRole = () =>
  axios(`${xinao}/sys/role/userRole`, { roleTerminal: 1, roleCode: "sportsCenterServerRole" }, "post");

// 清除Reddit缓存
export const cleaerRedditCache = data => axios(`${xinao}/healthPlan/clearHealthCache`, data, "post");
