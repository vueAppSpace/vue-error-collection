/*
 * @Description: 跳转运动中心通用函数
 * @Author: WANGCHENGAE
 * @Date: 2022-12-9 18:00:30
 * @LastEditTime: 2023-03-23 17:46:24
 */

import { getThirdUserToken } from "@/service/service";
import { sportGym } from "@/config/env";
import { Toast } from "vant";

export const SourceDestUrlMap = {
  1: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&router=%2Fpages%2Ffitness-record%2Findex`, // 运动记录
  2: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&router=%2Fpages%2Fhome%2Findex&card=sitePack`, // 场地预约
  3: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&router=%2Fpages%2Fhome%2Findex&card=group`, // 团课预约
  4: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&router=%2Fpages%2FsignIn%2Findex`, // 预约记录
  5: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&type=$sportName&router=%2Fpages%2Ffitness-record%2Findex`, //有氧设备跳运动记录
  6: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&modular=bodyTest`, //体测报告
  7: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$token&router=%2Fpages%2Fhome%2Findex&card=live` // 云健身
};

export const SportType = {
  //服务页
  "service-motion_recording": 1, //运动记录
  "service-venuestatus_reservations": 2, //场地预约
  "service-group_class_reservations": 3, //团课预约
  "service-reservations_recording": 4, //预约记录
  //场地状态页
  "venuestatus-motion_recording": 5, //有氧设备跳运动记录
  "venuestatus-body_test": 6 //体测报告
};

//type(跳转链接类型) 必传参数
export async function jumpToSportGym({ type, sportName }) {
  const { code, message, data: token } = await getThirdUserToken();
  if (code === 0) {
    jumpToThirdParty({ type, token, sportName });
  } else {
    Toast(message);
  }
}

export function jumpToThirdParty({ type, token, sportName }) {
  let url = SourceDestUrlMap[type].replace("$token", token);
  if (type === SportType["venuestatus-motion_recording"]) {
    url = url.replace("$sportName", encodeURIComponent(sportName)); //所有得用户输入得链接参数，都得用该方法转义
  }
  console.log(url);
  window.location.href = url;
}
