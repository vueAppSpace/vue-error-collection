/*
 * @Description: 开屏页api
 * @Author: IFLS
 * @Date: 2022-08-22 17:57:18
 * @LastEditTime: 2022-08-22 17:58:21
 */

import axios from "@/config/axios";
import { xinao } from "@/config/env";

// 当前开屏页
export const queryGuidePageList = () => axios(`${xinao}/screenfirstpage/findFirst`, {}, "post");
