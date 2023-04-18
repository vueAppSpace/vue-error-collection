import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { Toast } from "vant";
import { platform } from "./env";

// import store from '../store'
// import * as authType from '../page/auth/module/mutations_types'

// import qs from 'qs';

let _this = this;

//判断是否收集接口请求
function judgeNeedCollect(resp) {
  console.log(11111111111111, resp);
  const { config, data = {}, status } = resp || {};
  if (true || !(status >= 200 && status < 300) || (typeof data.isOk !== "undefined" && !data.isOk)) {
    const statsData = {
      type: "promise",
      traceId: config.headers.traceId || "",
      uid: ((JSON.parse(sessionStorage.getItem("userStore")) || {}).userInfo || {}).empNo,
      src: config.url,
      reqParams: JSON.parse(config.data),
      respData: data
    };

    console.log(statsData);

    //MtaStats.clickStats(statsData);
  }
}

// 创建axios实例
const service = axios.create({
  baseURL: "", // api的base_url
  timeout: 35 * 1000, // 请求超时时间
  withCredentials: false, // 表示跨域请求时是否需要使用凭证。默认不需要
  responseType: "json", // 表示服务器响应的数据类型。默认为json
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // 'Content-Type': 'application/json; charset=UTF-8'
  },

  transformRequest: [
    function (data) {
      // transformRequest 允许在向服务器发送前，修改请求数据
      // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
      // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream

      // form-data格式化数据，这里可以使用开头引入的qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      return data;
    }
  ],
  validateStatus: status => {
    // 200~300之间resolve，其余的reject
    return status >= 200 && status < 300;
  }
});
// request 请求拦截器, 主要是请求统一增加token
service.interceptors.request.use(
  config => {
    if (config.url.includes("qrcode")) {
      config.responseType = "blob";
    }

    //链接中包含qrcode白名单处理
    const whiteReg = /(getUnifyQRCode|getUnifyQRCodeCallback|icomeShorten|icomeRestore)/g;
    if (config.url.includes("qrcode") && whiteReg.test(config.url)) {
      config.responseType = "json";
    }

    if (config.contentType == "fromData") {
      config.headers = Object.assign(config.headers, {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        "Content-Type": "multipart/form-data;charset=UTF-8"
      });
    } else {
      config.headers = Object.assign(config.headers, {
        "Content-Type": "application/json; charset=UTF-8"
      });
    }

    config.headers.traceId = uuidv4();
    // #v-ifdef VITE_IFDEF=ICOME
    config.headers.AppId = "1562734232";
    config.headers.PlaceCompanyId = 240;
    config.headers.PlaceCompanyPid = 10;
    config.headers.CompanyId = 240;
    config.headers.CompanyPid = 10;
    config.headers.appCode = 9000042;
    // #v-endif
    const userStore = JSON.parse(sessionStorage.getItem("userStore"));
    if (userStore) {
      try {
        // #v-ifdef VITE_IFDEF=EMALL
        const { appId, appCode, companyId, companyPid } = userStore.userInfo;
        config.headers = Object.assign(config.headers, { appId, appCode, companyId, companyPid });
        // #v-endif
        const accessToken = userStore.userInfo.accessToken;
        config.headers.Authorization = "Bearer " + accessToken;
      } catch (err) {
        //console.log("userInfoErr", err);
      }
    }

    // config.headers.LkToken = token;

    // config.headers.usertoken = localStorage.getItem("dn_userToken");
    // config.headers.appkey = "6ebff3d5eb078ea2";
    // config.headers.appsource = "GZH";
    // config.headers.districtId = 2;

    // if (config.url.search("/info/enableJoinFamily") != -1) {
    //   delete config.headers.Authorization;
    // }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response 响应拦截器, 主要是对错误统一处理
service.interceptors.response.use(
  response => {
    judgeNeedCollect(response);

    // 构造blob返回结构
    if (response.config.responseType === "blob") {
      let resData = {};
      if (response.status === 200) {
        const img = URL.createObjectURL(response.data);
        resData = {
          code: 0,
          message: "返回成功",
          data: { img }
        };
      } else {
        resData = {
          code: response.status,
          message: "返回失败",
          data: null
        };
      }
      return resData;
    }
    // status code 200~300之间
    if (response.headers["redirect"]) {
      // this.$toast({
      //     message: '登录失效'
      // });
      //console.log("登录失效");
    }

    let res = response.data;
    if (res.code === "410") {
      // 410 需要授权或者令牌过期。清除lktoken信息,并提示重新加载页面
      // setTimeout(() => {
      //     store.commit({
      //         type: authType.CLEAR_LKTOKEN,
      //         payload: {
      //             message: res.message
      //         }
      //     })
      // }, 500)
    } else if (res.code === "411") {
      // 411
    }
    return response.data;
  },
  error => {
    // Toast('网络异常, 请稍后再试')
    if (error.response.status != 504) {
      // Toast(`服务器异常, 错误码: ${error.response.status}`)
    }
    if (error.response) {
      //  //console.log('http status code', error.response.status)
      switch (error.response.status) {
        case 400:
          // 400 页面不存在
          break;
        case 401:
          // 401 需要授权或者令牌过期。清除usercode信息并跳转到登录页面
          // store.commit(authType.CLEAR_USERCODE);
          // alert('权限失效')
          //console.log("token失效重新登陆");

          break;
        case 500:
          // 500 服务器内部出错
          break;
      }
    }
    return Promise.reject(error.response);
  }
);

export default async (url = "", data = {}, requesTtype = "GET", contentType = "", isFormData = false) => {
  const type = requesTtype.toUpperCase();
  let requestConfig = {
    method: type,
    url: url,
    contentType: contentType
  };
  if (type === "GET") {
    requestConfig.params = data;
  }
  if (type === "POST") {
    if (contentType) {
      requestConfig.data = JSON.stringify(data);
    } else {
      requestConfig.data = JSON.stringify(data);
    }
    if (isFormData) {
      requestConfig.data = data;
    }
  }

  const response = await service(requestConfig);
  return response;
};

// async function doRequest(error) {
//   try {
//     const data = await getNewToken(localStorage.getItem("refreshToken"));

//     if (data.data.code == -1) {
//       if (invalidRefreshTokenTask) {
//         invalidRefreshTokenTask.postMessage(0);
//       }
//       return;
//     }

//     localStorage.setItem("accessToken", data.data.data.accessToken);
//     if (data.data.data.accessToken) {
//       // 告诉张魏,更新token操作
//       if (setTokenTask) {
//         setTokenTask.postMessage(data.data.data.accessToken);
//       }
//     }
//     const res = await service.request(error.config);
//     return res;
//   } catch (err) {}
// }

async function createToken() {
  return await axios({
    url: platform + "/v1/uaa/user/createToken",
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    data: null
  });
}

async function getNewToken(refreshToken) {
  return await axios({
    url: platform + "/uaa/user/refreshToken",
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    data: {
      refreshToken: refreshToken
    }
  });
}
