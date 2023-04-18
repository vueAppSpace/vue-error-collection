/*!
 * stats-sdk.js v1.0.0
 * (c) 2014-2021 Cheng Wang
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.Stats = factory()));
})(this, function () {
  "use strict";
  function Stats(opts) {
    //默认配置
    this.options = {
      appid: "", //租户id
      appKey: "", //租户密钥
      reportUrl: "", //上报地址
      autoCapture: true, //是否开启自动捕获
      autoReport: true
    };

    if (opts && opts.appid && opts.appKey) {
      this._init(opts);
    } else {
      console.error("[Stats error]: appid 和 appsecret 是必传参数!");
    }
  }

  Stats.prototype._init = function (opts) {
    //覆盖默认配置
    this.options = Object.assign(this.options, opts);
    if (!this.options.reportUrl) {
      this.options.reportUrl = ""; //使用默认的上报地址
    }
  };

  //===================== 错误统计 =====================
  //启用错误监听,自动统计错误信息
  Stats.prototype.startListen = function () {
    console.log("开启全局错误监听...");

    //一：全局捕获js错误(js同步错误)
    window.onerror = function (message, source, lineno, colno, error) {
      const errObj = { message, source, lineno, colno, error };
      const errorType = "js_run";

      console.log("[window.onerror]: 捕获到异常,", errObj);
    };

    //二：全局捕获: 图片，script，css等资源文件加载错误
    /*
    {
      "type": "error",
      "src": "https://yun.tuia.cn/image/kkk.png",
      "tagName": "IMG"
    }

    {
      "type": "error",
      "src": "https://lk-webfont.oss-accelerate.aliyuncs.com/xxx.min.1.8.21.js",
      "tagName": "SCRIPT"
    }

    {
      "type": "error",
      "src": "",
      "tagName": "LINK"
    }
    
    */
    window.addEventListener(
      "error",
      error => {
        const { srcElement = {}, type = "" } = error || {};
        const { src = "", tagName = "", href = "" } = srcElement || {};

        const statObj = {
          type: "resource",
          url: src || href,
          target: tagName.toLocaleLowerCase()
        };

        console.log("[window.addEventListener error]: 捕获到异常,", error, statObj);
      },
      true
    );

    //三: 全局捕获 promise 错误(js异步错误)
    window.addEventListener("unhandledrejection", error => {
      const { reason } = error || {};
      const { message = "", stack } = reason || {};

      const statObj = {
        type: "promise",
        message,
        stack
      };

      console.log("[window.addEventListener unhandledrejection]: 捕获到异常,", error, statObj);
    });
  };

  //手动触发,统计错误信息
  Stats.prototype.clickStats = function (err) {
    const baseField = {
      uid: "", //用户id
      url: "", //发生该事件时url
      eventTime: "", //事件发生时间
      osType: "", // 用户设备类型  ios android pc
      userAgent: "", //用户代理
      commitID: "" // 应用版本号(那一次提交的版本)
    };

    const errField = {
      type: "js", //错误类型  1.js(js运行时错误) 2.promise (promise reject) 3.resource(静态资源加载错误)

      //for js_run
      message: "",
      source: "",
      lineno: "",
      colno: "",
      error: "",

      //for resource_load
      tagName: "",
      src: "",
      message: ""

      //for promise_reject
      // message:
    };

    let dataModel = {};
    if (typeof err === "string") {
    } else if (typeof err === "object") {
      dataModel = Object.assign(baseField, err);
    }
    const { name, message, stack } = err || {};

    const statsArray = Storage.getStorage(this.appid) || [];
    statsArray.push({
      name,
      message,
      stack
    });
    Storage.setStorage(this.appid, statsArray);
  };

  //===================== 错误上报 =====================
  Stats.prototype.report = function () {
    let _reportUrl = this.options.reportUrl;
    document.addEventListener("visibilitychange", function logData() {
      if (document.visibilityState === "hidden") {
        const statsArray = Storage.getStorage(this.appid) || [];
        if (statsArray.length) {
          if (navigator.sendBeacon) {
            //使用 post 请求发送埋点数据
            navigator.sendBeacon(_reportUrl, statsArray);
          } else {
            //image 对象可以跨域发送get请求(并且它不需要被添加到DOM上就能发送请求)
            statsArray.forEach(data => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = _reportUrl + "?" + QS.stringify(data);
              img.onload =
                img.onerror =
                img.onabort =
                  function () {
                    img = img.onload = img.onerror = img.onabort = null;
                  };
            });
          }
        }
      }
    });
  };

  return Stats;

  //===================== 工具方法封装 =====================
  //封装 QS
  var QS = (function () {
    function QS() {}

    QS.parse = function () {};

    //对象转 url 参数形式
    QS.stringify = function (param) {
      if (typeof param != "object") {
        console.error("The function stringify of QS which params need to be a object!!!");
      } else {
        const arr = [];
        for (let key in params) {
          arr.push(`${key}=${params[key]}`);
        }
      }
      return arr.join("&");
    };

    return QS;
  })(this);

  //封装localStorage
  var Storage = (function (global) {
    function Storage() {}
    Storage.normalizeKey = function (key) {
      if (typeof key !== "string") {
        console.error(key + " used as a key, but it is not a string.");
        key = String(key);
      }
      return key;
    };

    Storage.serialize = function (value) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      return value;
    };

    Storage.deserialize = function (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    };

    Storage.setStorage = function (key, value) {
      key = normalizeKey(key);
      value = serialize(value);
      localStorage.setItem(key, value);
    };

    Storage.getStorage = function (key) {
      key = normalizeKey(key);
      return deserialize(localStorage.getItem(key));
    };

    Storage.getStorage = function (key) {
      key = normalizeKey(key);
      localStorage.removeItem(key);
    };

    Storage.getStorage = function () {
      localStorage.clear();
    };

    return Storage;
  })(this);
});
