/*
 * @Date: 2023-02-27 13:38:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:45:08
 * @FilePath: \lk-xinaohealth-h5\src\service\healthEducation\index.js
 */

import axios from "@/config/axios";
import { xinao, configUrl } from "@/config/env";

//健康宣教检索
export const queryHealthMission = data => axios(`${xinao}/healthPlan/queryHealthMission`, data, "post");

//宣教标签元数据
export const queryHealthMissionTagList = data => axios(`${xinao}/healthPlan/queryHealthMissionTagList`, data, "get");
