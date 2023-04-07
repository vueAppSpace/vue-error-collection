/*
 * @Description: 跳转大脑函数
 * @Author: IFLS
 * @Date: 2022-10-12 15:49:14
 * @LastEditTime: 2023-04-06 15:40:05
 */
import {
  danaoQuestionUrl,
  danaoComprehensiveUrl,
  danaoConsulationUrl,
  danaoHealthReport,
  sportsCours
} from "@/config/env";

export default function (type, code, extraParame = "") {
  const userStore = JSON.parse(sessionStorage.getItem("userStore"));
  const phrId = userStore.userInfo.phrId;

  const appKey = "6KRoN5rng";
  let url = "";
  // 健康评估&慢病评估
  if (type == 1) {
    // type 1 : 大脑问卷评估，对应服务模块
    url = `${danaoQuestionUrl}?code=${code}&userId=${phrId}&appkey=${appKey}&fr=zonghe&dd_full_screen=true`;
  } else if (type == 2) {
    // type 2 : 大脑综合报告，对应 我的 模块 我的画像
    url = `${danaoComprehensiveUrl}/${code}/?userId=${phrId}&appKey=${appKey}&dd_full_screen=true${extraParame}`;
  } else if (type == 3) {
    // type3: 大脑三济健康档案
    url = `${danaoConsulationUrl}?mCode=${code}&userId=${phrId}&appKey=${appKey}&fr=zonghe&dd_full_screen=true`;
  } else if (type == 4) {
    url = `${danaoHealthReport}?userId=${phrId}&appKey=${appKey}&dd_full_screen=true${extraParame}`;
  } else if (type == 5) {
    // type4: 大脑课程相关
    url = `${sportsCours}/${code}?userId=${phrId}&dd_full_screen=true&isNavBar=1${extraParame}`;
  }
  window.location.href = url;
}
