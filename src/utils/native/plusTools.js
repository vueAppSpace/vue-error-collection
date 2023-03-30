/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-21 11:24:48
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-03-30 10:09:39
 * @FilePath: \lk-xinaohealth-h5\src\utils\native\plusTools.js
 * @Description: ****
 */
import { isIOS } from "@/utils/native/deviceEnv";
import scriptUrl from "@/utils/url";
import { loadBase64 } from "@/utils/commonFun";
import { eServicePdfPreview } from "@/config/env";

/**
 * 关闭当前 webview
 */
export const closeWebView = () => {
  console.log("关闭webview>>>>>>>>>>");
  var ws = plus.webview.currentWebview();
  plus.webview.close(ws);
};

/**
 * 打开一个新的webview
 */
export const openWebView = ({ params }) => {
  console.log("打开新webview>>>>>>>>>>");

  const { targetUrl, title = "", refreshTicket = false, extraParame = "" } = params;
  let webview = plus.webview.create("", "custom-webview", {
    "uni-app": "none",
    titleNView: {
      backgroundColor: "#ffffff",
      titleText: title,
      titleColor: "#1989fa",
      autoBackButton: true,
      "padding-left": "12px",
      backButton: {
        title: "返回",
        titleSize: "14px",
        fontSize: "19px"
      }
    },
    top: isIOS ? 0 : -plus.navigator.getStatusbarHeight(),
    bottom: 0
  });
  webview.loadURL(targetUrl);

  const onBack = () => {
    webview.canBack(e => {
      plus.key.removeEventListener("backbutton", onBack);
      if (e.canBack) {
        webview.back();
      } else {
        webview.close();
      }
    });
  };

  plus.key.addEventListener("backbutton", onBack, false);

  var currentWebview = plus.webview.currentWebview();
  currentWebview.append(webview);
};

/**
 * 打电话
 */
export const callPhone = ({ params }) => {
  plus.device.dial(params.tel, true);
};

/**
 * 扫描二维码
 */
export const scanQRCode = ({ params, successCB, errorCB }) => {
  //创建扫码dom节点
  const htmlStr = `<div id="__qrCodeUUID"></div>`;
  const createNode = htmlStr => {
    const dom = document.createElement("div");
    dom.innerHTML = htmlStr;
    return dom.firstElementChild;
  };
  const scanNode = createNode(htmlStr);
  document.body.appendChild(scanNode);

  //创建扫码实例并开启扫码
  const statusbarHeight = plus.navigator.getStatusbarHeight();
  const barcodeInstance = new plus.barcode.Barcode(
    "__qrCodeUUID",
    [plus.barcode.QR],
    {
      frameColor: "#f6eeee",
      scanbarColor: "#f6eeee",
      background: "rgba(0, 0, 0, 1)"
    },
    true
  );
  barcodeInstance.onmarked = (type, reslut) => {
    console.log("scanCode finish>>>>>>>>>>");
    console.log("scaned type", type);
    console.log("scaned reslut", reslut);

    close();
    if (type === plus.barcode.QR) {
      console.log("识别二位码成功>>>");
      successCB &&
        successCB({
          qrcode: reslut
        });
    } else {
      errorCB && errorCB("不是合法二维码!");
    }
  };
  barcodeInstance.start({
    vibrate: true,
    sound: "default"
  });

  //为扫码控件添加导航栏
  let view1;
  const bitmap1 = new plus.nativeObj.Bitmap("bitmap1");
  bitmap1.loadBase64Data(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACqADAAQAAAABAAAAEgAAAABr6GS2AAAAoklEQVQoFYWSvQ6CQBAGL3aEh5COkhJLabEgFtfz7HY2WliYGOM5SyDZYpclmVyy33A/e5dS8JVS6kBJCWmGL0yuTJhX6c54NEWCET7whM6TzoRveMHJk/pVEHHwpI7wAbLkxZNaQtm0nDB7UkV4gx/MpkTx4AVmnZnipbc/kePDKDluj5IHZt9vuJLjK1SyfhTNVjdH6SvIJVxNQReRlof7B/t01YxY86eAAAAAAElFTkSuQmCC",
    () => {
      console.log("bmp1.png load success!");

      const viewRealTop = statusbarHeight + 20;
      console.log("viewRealTop", viewRealTop);

      //创建原生容器控件
      view1 = new plus.nativeObj.View("view1", {
        top: viewRealTop + "px",
        left: "0px",
        height: "100px",
        width: "100%"
      });
      // 绘制图片
      view1.drawBitmap(
        bitmap1,
        { top: "0px", left: "0px", width: "100%", height: "100%" },
        { top: "5px", left: "30px", width: "12px", height: "auto" }
      );
      //绘制文本
      view1.drawText(
        "扫码",
        { top: "0px", left: "0px", width: "100%", height: "wrap_content" },
        { top: "0px", size: "24px", color: "#f6eeee", align: "center" }
      );
      view1.show();

      //监控返回按钮
      view1.addEventListener(
        "click",
        () => {
          console.log("click return back btn!!!");
          close();

          errorCB && errorCB("用户取消扫码!");
        },
        false
      );
    },
    e => {
      errorCB && errorCB("bmp1.png load failed! ");
    }
  );

  const close = () => {
    bitmap1.clear();
    view1.close();
    barcodeInstance.close();
    scanNode.remove();
  };
};

/**
 * 打开微信小程序
 */
export const openWXMiniProgram = ({ params }) => {
  console.log("打开微信小程序>>>>");
  const { appletId, path } = params;
  //to do
};

/**
 * 预览文件
 */
export const previewFile = ({ params }) => {
  console.log("预览文件>>>>");

  const { serverUrl, fileName } = params || {};
  loadBase64(scriptUrl.base64).then(() => {
    params = {
      targetUrl: `${eServicePdfPreview}?url=${encodeURIComponent(Base64.encode(serverUrl))}`
    };
    openWebView({ params });
  });
};

/**
 * 获取当前地理位置
 */
export const queryLocation = ({ successCB, errorCB }) => {
  console.log("start获取地理位置>>>>>>");
  plus.geolocation.getCurrentPosition(
    p => {
      console.log("获取地理位置成功>>>", p);
      const { coords, address = {} } = p;
      const { country, province, city, district, street, postalCode, cityCode } = address;
      successCB && successCB({ country, province, city, district, street, postalCode, cityCode });
    },
    err => {
      console.log("获取地理位置失败,", err);
      errorCB && errorCB("获取地理位置失败：", err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      //provider: "system", //amap>baidu>system
      geocode: true
    }
  );
};

/**
 * 音频播放
 */
export const audioPlay = ({ params, successCB, errorCB }) => {
  //const localAudioId = "https://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/audio/correct_sound.mp3";

  const { localAudioId } = params;
  console.log("音频播放>>>", localAudioId);
  const audioPlayer = plus.audio.createPlayer(localAudioId);
  audioPlayer.play(
    ret => {
      console.log("play audio success", ret);
    },
    err => {
      console.log("play audio err", err);
      errorCB && errorCB("play audio err" + err);
    }
  );
};

/**
 *下载音频
 */
export const audioDownload = ({ params, successCB, errorCB }) => {
  console.log("audioDownload>>>>", params);

  downLoadFile({
    params: {
      path: params.mediaId
    },
    successCB: localAudioId => {
      console.log("localAudioId>>>", localAudioId);
      successCB && successCB({ localAudioId });
    },
    errorCB: err => {
      errorCB && errorCB("下载音频失败!" + err);
    }
  });
};

/**
 * 文件下载
 */
export const downLoadFile = ({ params, successCB, errorCB }) => {
  const { path } = params;
  console.log("下载文件网络地址>>>>", path);
  var dtask = plus.downloader.createDownload(
    path,
    {},
    (d, status) => {
      if (status == 200) {
        console.log("downLoadFile success, file path >>>: ", d.filename);
        successCB && successCB(d.filename);
      } else {
        console.log("downLoadFile failed: ", status);
        errorCB && errorCB("downLoadFile failed: " + status);
      }
    },
    err => {
      console.log("downLoadFile failed: ", err);
      errorCB && errorCB("downLoadFile failed: " + err);
    }
  );
  dtask.start();
};
