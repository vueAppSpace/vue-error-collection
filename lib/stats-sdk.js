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
    : ((global = global || self), (global.Vue = factory()));
})(this, function () {
  "use strict";

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
  })();

  //appid: 租户 id
  //appsecret: 租户密钥 (必须购买才能使用我们的服务,todo)
  function Stats(options) {
    if (options && options.appid) {
      this._init(options);
    } else {
      console.error("[Stats error]: 租户 appid 缺失!");
    }
  }

  Stats.prototype._init = function (options) {
    var vm = this;
    //覆盖默认配置
    vm.config = Object.assign(vm.config, options);
  };

  //统计错误信息
  Stats.prototype.clickStats = function (err) {
    const { name, message, stack } = err || {};

    const statsArray = Storage.getStorage(this.appid) || [];
    statsArray.push({
      name,
      message,
      stack
    });
    Storage.setStorage(this.appid, statsArray);
  };
});
