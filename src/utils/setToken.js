/*
 * @Description: 获取token
 * @Author: IFLS
 * @Date: 2022-04-24 14:09:14
 * @LastEditTime: 2023-03-24 09:52:51
 */
import { getToken as queryToken } from "@/service/api";
import { Toast } from "vant";

// 获取url参数
const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a),
    {}
  );

const errorTips = message => {
  Toast({
    type: "fail",
    duration: 3000,
    message
  });
  throw Error(message);
};

const NO_TICKET = "noticket";
const NO_LOGIN = "nologin";

const getParams = () => {
  const val = getURLParameters(window.location.href);
  // 不登录情况
  if (val[NO_LOGIN]) {
    return NO_LOGIN;
  }
  // 无ticket情况
  if (!val.ticket) {
    return errorTips("获取关键信息失败,请重试!");
  }
  // 传递noticket情况
  if (val.ticket === NO_TICKET) {
    return val.ticket;
  }
  localStorage.setItem("ticket", val.ticket);
  return val;
};

const getToken = async () => {
  const params = getParams();
  if (params === NO_TICKET) {
    return await Promise.resolve({ code: -999, data: null, message: null });
  } else if (params === NO_LOGIN) {
    return await Promise.resolve({ code: -99, data: null, message: null });
  } else {
    localStorage.removeItem("accessToken");
    return await queryToken(params);
  }
};

const setToken = response => {
  if (response.code === 0) {
    //  注意: 不应往此处添加登录信息 所有登录信息均已保存到pinia userStore中
    localStorage.setItem("memberCode", response.data.memberBasicDTO.memberCode);
    localStorage.setItem("memberId", response.data.memberBasicDTO.memberId);
    localStorage.setItem("phrId", response.data.memberBasicDTO.phrId);
    localStorage.setItem("accompanyDay", response.data.accompanyDay || 0);
    localStorage.setItem("loginHealthPoints", response.data.loginHealthPoints);
    localStorage.setItem("empNo", response.data.empNo);
    sessionStorage.setItem("userStore", JSON.stringify({ userInfo: response.data })); // 构造pinia userStore数据
    window.zhuge && zhuge.identify(response.data.xinaoAccount.toLocaleLowerCase()); // 埋点用户识别
  } else if (response.code === -999) {
    console.warn(`warn: 监测到url传递参数${NO_TICKET}, 使用了上次登陆信息`);
  } else if (response.code === -99) {
    console.warn(`warn: 监测到url传递参数${NO_LOGIN}, 没有获取登录状态`);
  } else {
    errorTips(response.message || "token获取失败");
  }
};

export { getToken, setToken };
