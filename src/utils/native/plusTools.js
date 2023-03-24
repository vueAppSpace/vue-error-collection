/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-21 11:24:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:45:59
 * @FilePath: \lk-xinaohealth-h5\src\utils\native\plusTools.js
 * @Description: ****
 */

/**
 * 关闭当前 webview
 */
export function closeWebView() {
  console.log("关闭webview>>>>>>>>>>");
  var ws = plus.webview.currentWebview();
  plus.webview.close(ws);
}

/**
 * 打开一个新得webview
 */
export function openWebView({ params }) {
  const { targetUrl, refreshTicket = false, extraParame = "" } = params;
  plus.webview.open(targetUrl);
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

      //创建原生容器控件
      view1 = new plus.nativeObj.View("view1", { top: "66px", left: "0px", height: "100px", width: "100%" });
      // 绘制图片
      view1.drawBitmap(
        bitmap1,
        { top: "0px", left: "0px", width: "100%", height: "100%" },
        { top: "0px", left: "30px", width: "14px", height: "auto" }
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
 * 获取当前地理位置
 */
export function queryLocation({ successCB, errorCB }) {
  plus.geolocation.getCurrentPosition(
    p => {
      console.log("获取地理位置成功>>>", p);
      const { coords, address = {} } = p;
      const { country, province, city, district, street, postalCode, cityCode } = address;
      successCB({ country, province, city, district, street, postalCode, cityCode });
    },
    err => {
      errorCB("获取地理位置失败：", err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      provider: "amap",
      geocode: true
    }
  );
}

/**
 * 文件系统操作
 */

/**
 * 音频播放
 */
export function audioPlay({ path, successCB, errorCB }) {
  const audioPlayer = plus.audio.createPlayer(path);
  audioPlayer.play(successCB, errorCB);
}
