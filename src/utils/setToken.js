/*
 * @Description: 获取token
 * @Author: IFLS
 * @Date: 2022-04-24 14:09:14
 * @LastEditTime: 2023-04-04 16:55:14
 */
import { getToken as queryToken } from "@/service/api";
import { getURLParameters } from "@/utils/commonFun";
import { Toast, Dialog } from "vant";
import { jsBridge } from "@/utils/native/jsBridge";
import { icomeH5Url } from "@/config/env";

const errorTips = message => {
  Toast({
    type: "fail",
    duration: 3000,
    message
  });
  throw new Error(message);
};

const NO_TICKET = "noticket";
const NO_LOGIN = "nologin";

const getParams = () => {
  const val = getURLParameters(window.location.href);
  const err = () => errorTips("获取关键信息失败,请重试!");
  /* 通用参数 */
  // 不登录情况
  if (val[NO_LOGIN]) {
    return NO_LOGIN;
  }
  // 传递noticket情况
  if (val.ticket === NO_TICKET) {
    return val.ticket;
  }

  // #v-ifdef VITE_IFDEF=ICOME
  /* icome参数 */
  // 无ticket情况
  if (!val.ticket) {
    return err();
  }
  localStorage.setItem("ticket", val.ticket);
  // #v-endif

  // #v-ifdef VITE_IFDEF=EMALL
  /* emall参数 */
  // 无grantCode或authTenantId情况
  if (!val.grantCode || !val.authTenantId) {
    return err();
  }
  const userInfo = { code: val.grantCode, id: val.authTenantId };
  localStorage.setItem("ticket", JSON.stringify(userInfo));
  // #v-endif
  return val;
};

const getToken = async () => {
  const params = getParams();
  if (params === NO_TICKET) {
    return await Promise.resolve({ code: -999, data: null, message: null });
  } else if (params === NO_LOGIN) {
    return await Promise.resolve({ code: -99, data: null, message: null });
  } else {
    localStorage.removeItem("accessToken"); // 清除旧版本用户登录信息
    sessionStorage.removeItem("userStore"); // 清除登录信息
    return await queryToken(params);
  }
};

const interceptCompanyId = companyId => {
  // #v-ifdef VITE_IFDEF=EMALL
  if (companyId === 240) {
    Dialog.alert({
      title: "提示",
      confirmButtonColor: "#4d87f9",
      message: "检测到您的租户信息在ICOME下, 点击确认后跳转ICOME"
    }).then(() => {
      jsBridge.invoke("openIcome", {
        targetUrl: `${icomeH5Url}/health`,
        extraParame: "&dd_full_screen=true"
      });
    });
    // 打断后续代码执行
    throw new Error("waiting to jump icome...");
  }
  // #v-endif
};

const setToken = response => {
  if (response.code === 0) {
    interceptCompanyId(response.data.memberBasicDTO.companyId);
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
