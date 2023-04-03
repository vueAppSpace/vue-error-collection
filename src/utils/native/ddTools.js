/*
 * @Description: 钉钉工具函数
 * @Author: IFLS
 * @Date: 2022-11-15 10:26:42
 * @LastEditTime: 2023-03-23 17:45:52
 */
import { Toast } from "vant";
import { orderLunchUrl as icomeTransitTicket } from "@/config/env";
import { isIcomeMobile, isIcomePC } from "@/utils/native/deviceEnv";

// /**
//  * @description: 判断运行环境
//  * @param void
//  * @return {string} 'pc' 'ios' 'android' ''
//  */
// export const ddEnv = () => {
//     if (window.ic) {
//         return ic.isIOS ? "ios" : ic.isAndroid ? "android" : "pc";
//     } else {
//         return "";
//     }
// };

// /**
//  * @description: 是否为手机
//  * @param void
//  * @return {boolean} true是手机 false不是手机
//  */
// export const ddIsMobile = () => {
//     if (window.ic) {
//         const env = ddEnv();
//         return env !== "pc";
//     } else {
//         return false;
//     }
// };

// 注：因为方法的参数在 ddTools 和 plusTools 方法里都会使用，所以尽量解构出具体值再用，避免误传多余参数。
/**
 * @description: 关闭当前webview
 */
export const ddCloseWebView = () => {
  // const env = ddEnv();
  // if (["ios", "android"].includes(env)) {
  //     ic.run({ action: "webview.close" });
  // } else {
  //     window.close();
  // }
  ic.run({ action: "webview.close" });
};

/**
 * @description: 通过基座开启新页面 刷新ticket
 * @param {object}
 *    - { targetUrl: 页面url, refreshTicket: 是否需要刷新ticket, extraParame: 额外参数 &a=1&b=2形式 }
 * @return void
 */
export const ddOpenWebView = ({ params }) => {
  const { targetUrl, refreshTicket = false, extraParame = "" } = params;

  let url = "";

  if (isIcomeMobile) {
    if (refreshTicket) {
      url = icomeTransitTicket + encodeURIComponent(`${targetUrl}?ticket=ticket${extraParame}`);
    } else {
      url = targetUrl + extraParame;
    }
  } else {
    if (refreshTicket) {
      url = `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(
        icomeTransitTicket + encodeURIComponent(targetUrl + "?ticket=ticket" + extraParame)
      )}&pc_slide=true`; // &web_wnd=general&width=390&height=844 // pc弹窗参数
    } else {
      url = `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(targetUrl + extraParame)}&pc_slide=true`;
    }
  }

  ic.run({
    action: "system.openWebView",
    params: { url }
  });
};

/**
 * @description: 通过icome打开微信小程序
 * @param {object}
 * {appletId: string 小程序username, path : string 小程序路径}
 * @return void
 */
export const ddOpenWXMiniProgram = ({ params }) => {
  const { appletId, path } = params;
  if (isIcomeMobile) {
    ic.run({
      action: "icome.wxsdk",
      params: {
        type: "2",
        sdkNeedParams: { appletId, path }
      }
    });
  } else {
    Toast("请至移动端打开");
  }
};

/**
 * @description: 唤起icome内私聊 pc端手机端均支持
 * @param {object}
 * {userId: string icome账号}
 * @return void
 */
export const ddOpenIcomeChat = ({ params, successCB }) => {
  ic.run({
    action: "system.openChat",
    params: { userId: params.userId },
    success: successCB
  });
};

/**
 * @description: 拨打电话 仅支持手机端
 * @param {object}
 * {tel: string 手机号,showDingCall: boolean 可选参数}
 * @return void
 */
export const ddCallPhone = ({ params }) => {
  const { showDingCall = false, tel } = params;
  if (isIcomeMobile) {
    ic.run({
      action: "device.call",
      params: { showDingCall, tel }
    });
  } else {
    Toast("请至移动端拨打电话");
  }
};

/**
 * @description: 扫描二维码 仅支持手机端
 * @return void
 */
export const ddScanQRCode = ({ successCB }) => {
  ic.run({
    action: "device.scanQRCode",
    params: { openType: "2" },
    success: successCB
  });
};

/**
 *  @param {string} text - 钉钉消息文本
 */
export const setLeft = ({ params }) => {
  ic.run({
    action: "navigation.setLeft",
    params: { text: params.text }
  });
};

/**
 * @description: 设置消息标题
 * @param {string}  title - 标题
 * @return void
 */
export const setTitle = ({ params }) => {
  ic.run({
    action: "webview.setTitle",
    params: { title: params.title }
  });
};

/**
 * @description: 隐藏右上角菜单按钮
 * @return void
 */
export const hideOptionMenu = () => {
  ic.run({ action: "webview.hideOptionMenu" });
};

/**
 * @description: 隐藏左上角关闭按钮
 * @return void
 */
export const hideCloseBtn = () => {
  ic.run({ action: "webview.hideCloseBtn" });
};

/**
 * @description: 禁用ios左滑返回
 * @param {object}
 * {disabled: string 可选}
 * @return void
 */
export const interactivePopDisabled = ({ params }) => {
  const { disabled = "1" } = params;
  ic.run({
    action: "webview.interactivePopDisabled",
    params: {
      disabled
    }
  });
};

/**
 * @description: 预览文件
 * @param {object}
 * {serverUrl: string, fileName: string}
 * @return void
 */
export const previewFile = ({ params, successCB, errorCB }) => {
  const { serverUrl, fileName } = params;
  ic.run({
    action: "device.previewFile",
    params: {
      serverUrl,
      ext: {
        fileName
      }
    },
    success: successCB,
    fail: errorCB
  });
};

/**
 * @description: 获取当前位置
 * @return void
 */
export const queryLocation = ({ successCB }) => {
  ic.run({
    action: "amap.location",
    success({ data }) {
      successCB(data);
    }
  });
};

/**
 * @description: 打开地图
 * @return void
 */
export const openMap = ({ successCB }) => {
  ic.run({
    action: "amap.openMap",
    success({ data }) {
      successCB(data);
    }
  });
};

/**
 * @description: 下载音频
 * @param {object}
 * mediaId string
 * @return void
 */
export const audioDownload = ({ params, successCB }) => {
  ic.run({
    action: "audio.download",
    params: { mediaId: params.mediaId },
    success: successCB
  });
};

/**
 * @description: 播放音频
 * @param {object}
 * localAudioId string
 * @return void
 */
export const audioPlay = ({ params }) => {
  ic.run({
    action: "audio.play",
    params: { localAudioId: params.localAudioId }
  });
};

/**
 * @description: pc 视频播放
 * @param {object}
 * {string} title - 视频标题
 * {string} url - 视频链接
 * @return void
 */
export const openModal = ({ params }) => {
  const { title = "视频详情", url } = params;
  if (isIcomePC) {
    ic.run({
      action: "util.openModal",
      params: {
        title,
        url
      }
    });
  } else {
    Toast("请至 iComePC端 打开");
  }
};
