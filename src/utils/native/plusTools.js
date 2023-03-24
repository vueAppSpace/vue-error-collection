/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-21 11:24:48
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-03-24 14:28:31
 * @FilePath: \lk-xinaohealth-h5\src\utils\native\plusTools.js
 * @Description: ****
 */
import { isIOS } from "@/utils/native/deviceEnv";

/**
 * 关闭当前 webview
 */
export function closeWebView() {
  console.log("关闭webview>>>>>>>>>>");
  var ws = plus.webview.currentWebview();
  plus.webview.close(ws);
}

/**
 * 打开一个新的webview
 */
export function openWebView({ params }) {
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

  plus.key.addEventListener(
    "backbutton",
    function () {
      webview.canBack(function (e) {
        if (e.canBack) {
          webview.back();
        } else {
          webview.close();
        }
      });
    },
    false
  );

  //新打开得webview，添加到当前webview
  var currentWebview = plus.webview.currentWebview();
  currentWebview.append(webview);
}

/**
 * 打电话
 */
export function callPhone({ params, successCB }) {
  plus.device.dial(params.tel, true);
}

/**
 * 扫描二维码
 */
export function scanQRCode({ params, successCB, errorCB }) {
  //创建扫码dom节点
  const htmlStr = `<div id="__qrCodeUUID"></div>`;
  function createNode(htmlStr) {
    const dom = document.createElement("div");
    dom.innerHTML = htmlStr;
    return dom.firstElementChild;
  }
  const scanNode = createNode(htmlStr);
  document.body.appendChild(scanNode);

  //创建扫码实例并开启扫码
  const statusbarHeight = plus.navigator.getStatusbarHeight();
  const scanInstance = new plus.barcode.Barcode("__qrCodeUUID", [plus.barcode.QR], true);
  scanInstance.onmarked = (type, reslut) => {
    console.log("scanCode finish>>>>>>>>>>");
    console.log("scaned type", type);
    console.log("scaned reslut", reslut);

    close();
    if (type === plus.barcode.QR) {
      console.log("识别二位码成功>>>");
      successCB({
        qrcode: reslut
      });
    } else {
      errorCB("不是合法二维码!");
    }
  };
  scanInstance.start();

  //为扫码控件添加导航栏
  let view1;
  const bitmap1 = new plus.nativeObj.Bitmap("bitmap1");
  bitmap1.loadBase64Data(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACqADAAQAAAABAAAAEgAAAABr6GS2AAAAoklEQVQoFYWSvQ6CQBAGL3aEh5COkhJLabEgFtfz7HY2WliYGOM5SyDZYpclmVyy33A/e5dS8JVS6kBJCWmGL0yuTJhX6c54NEWCET7whM6TzoRveMHJk/pVEHHwpI7wAbLkxZNaQtm0nDB7UkV4gx/MpkTx4AVmnZnipbc/kePDKDluj5IHZt9vuJLjK1SyfhTNVjdH6SvIJVxNQReRlof7B/t01YxY86eAAAAAAElFTkSuQmCC",
    function () {
      console.log("bmp1.png load success!");

      const viewRealTop = statusbarHeight + 25;
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
        { top: "0px", left: "30px", width: "12px", height: "auto" }
      );
      //绘制文本
      view1.drawText(
        "扫码",
        { top: "0px", left: "10px", width: "100%", height: "wrap_content" },
        { size: "24px", color: "#f6eeee", align: "center" }
      );
      view1.show();

      //监控返回按钮
      view1.addEventListener(
        "click",
        () => {
          console.log("click return back btn!!!");
          close();

          errorCB("用户取消扫码!");
        },
        false
      );
    },
    function (e) {
      console.log("bmp1.png load failed! ");
    }
  );

  function close() {
    bitmap1.clear();
    view1.close();
    scanInstance.close();
    scanNode.remove();
  }
}

/**
 * 打开微信小程序
 */
export const openWXMiniProgram = ({ params }) => {
  console.log("打开微信小程序>>>>");
  const { appletId, path } = params;

  // ic.run({
  //     action: "icome.wxsdk",
  //     params: {
  //         type: "2",
  //         sdkNeedParams: { appletId, path },
  //     },
  // });
};

/**
 * 预览文件
 */
export const previewFile = ({ params, successCB, errorCB }) => {
  console.log("预览文件>>>");
  const { serverUrl, fileName } = params || {};

  const path =
    "https://entropy-tmp.oss-cn-beijing.aliyuncs.com/202206030014.pdf?Expires=3550557681&OSSAccessKeyId=LTAI5tNBUuD5RLXz1h85PPn3&Signature=KbnqFVa6UM4eGrKD08P0CLqyWSc%3D";
  params = {
    targetUrl: path
  };
  openWebView({ params });
};

/**
 * 获取当前地理位置
 */
export function queryLocation({ successCB, errorCB }) {
  console.log("start获取地理位置>>>>>>");
  plus.geolocation.getCurrentPosition(
    p => {
      console.log("获取地理位置成功>>>", p);
      const { coords, address = {} } = p;
      const { country, province, city, district, street, postalCode, cityCode } = address;
      successCB({ country, province, city, district, street, postalCode, cityCode });
    },
    err => {
      console.log("获取地理位置失败,", err);
      errorCB("获取地理位置失败：", err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      provider: "amap", //system
      geocode: true
    }
  );
}

/**
 * 音频播放
 */
export function audioPlay({ params, successCB, errorCB }) {
  //path = "https://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/audio/correct_sound.mp3";

  const { localAudioId } = params;
  console.log("音频播放>>>", localAudioId);
  const audioPlayer = plus.audio.createPlayer(localAudioId);
  audioPlayer.play(
    ret => {
      console.log("play audio success", ret);
    },
    err => {
      console.log("play audio err", err);
    }
  );
}

/**
 *下载音频
 */
export function audioDownload({ params, successCB, errorCB }) {
  console.log("audioDownload>>>>", params);

  downLoadFile({
    params: {
      path: params.mediaId
    },
    successCB: localAudioId => {
      console.log("localAudioId>>>", localAudioId);
      successCB({ localAudioId });
    },
    errorCB: () => {}
  });
}

/**
 * 文件下载
 */
export function downLoadFile({ params, successCB, errorCB }) {
  const { path } = params;
  console.log("下载文件网络地址>>>>", path);
  var dtask = plus.downloader.createDownload(
    path,
    {},
    function (d, status) {
      if (status == 200) {
        console.log("downLoadFile success file path >>>: " + d.filename);
        successCB(d.filename);
      } else {
        console.log("Download failed: " + status);
      }
    },
    err => {
      console.log("Download failed: " + err);
    }
  );
  dtask.start();
}
