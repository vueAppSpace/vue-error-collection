import * as ddTools from "@/utils/native/ddTools";
import * as plusTools from "@/utils/native/plusTools";
import * as webTools from "@/utils/native/webTools";
import { isUniApp } from "@/utils/native/deviceEnv";

export default {
  closeWebView(payload) {
    if (isUniApp) {
      callPlusMethod("closeWebView", payload);
    } else {
      ddTools.ddCloseWebView(payload);
    }
  },
  openWebView(payload) {
    if (isUniApp) {
      callPlusMethod("openWebView", payload);
    } else {
      ddTools.ddOpenWebView(payload);
    }
  },
  openWXMiniProgram(payload) {
    if (isUniApp) {
      callPlusMethod("openWXMiniProgram", payload);
    } else {
      ddTools.ddOpenWXMiniProgram(payload);
    }
  },
  openIcomeChat(payload) {
    // TODO e商城 不支持
    if (!isUniApp) {
      ddTools.ddOpenIcomeChat(payload);
    }
  },
  callPhone(payload) {
    if (isUniApp) {
      callPlusMethod("callPhone", payload);
    } else {
      ddTools.ddCallPhone(payload);
    }
  },
  scanQRCode(payload) {
    if (isUniApp) {
      callPlusMethod("scanQRCode", payload);
    } else {
      ddTools.ddScanQRCode(payload);
    }
  },
  queryLocation(payload) {
    if (isUniApp) {
      callPlusMethod("queryLocation", payload);
    } else {
      ddTools.queryLocation(payload);
    }
  },
  openMap(payload) {
    if (isUniApp) {
      // callPlusMethod("", payload);
    } else {
      ddTools.openMap(payload);
    }
  },
  // setLeft(payload) {
  //     if (isUniApp) {
  //         // callPlusMethod("queryLocation", payload);
  //     } else {
  //         ddTools.setLeft(payload);
  //     }
  // },
  // setTitle(payload) {
  //     if (isUniApp) {
  //         // callPlusMethod("queryLocation", payload);
  //     } else {
  //         ddTools.setTitle(payload);
  //     }
  // },
  // hideOptionMenu(payload) {
  //     if (isUniApp) {
  //         // callPlusMethod("queryLocation", payload);
  //     } else {
  //         ddTools.hideOptionMenu(payload);
  //     }
  // },
  // hideCloseBtn(payload) {
  //     if (isUniApp) {
  //         // callPlusMethod("queryLocation", payload);
  //     } else {
  //         ddTools.hideCloseBtn(payload);
  //     }
  // },
  interactivePopDisabled(payload) {
    if (isUniApp) {
      // callPlusMethod("", payload);
    } else {
      ddTools.interactivePopDisabled(payload);
    }
  },
  previewFile(payload) {
    if (isUniApp) {
      callPlusMethod("previewFile", payload);
    } else {
      ddTools.previewFile(payload);
    }
  },
  audioDownload(payload) {
    if (isUniApp) {
      callPlusMethod("audioDownload", payload);
    } else {
      ddTools.audioDownload(payload);
    }
  },
  audioPlay(payload) {
    if (isUniApp) {
      callPlusMethod("audioPlay", payload);
    } else {
      ddTools.audioPlay(payload);
    }
  },
  openModal(payload) {
    if (isUniApp) {
      // callPlusMethod("", payload);
    } else {
      ddTools.openModal(payload);
    }
  },
  openIcome(payload) {
    webTools.webOpenIcome(payload);
  }
};

function callPlusMethod(name, payload) {
  console.log("plus method");
  if (window.plus) {
    plusTools[name](payload);
  } else {
    document.addEventListener("plusready", () => plusTools[name](payload), false);
  }
}
