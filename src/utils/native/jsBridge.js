import nativeMethods from "@/utils/native/nativeMethods";
import { isUniApp, isIcome } from "@/utils/native/deviceEnv";

class JsBridge {
  constructor() {
    this.registerFns = new Map();
    this.nativeMethods = nativeMethods;
  }

  /**
   * @description: js调用APP的方法
   * @param {string} name -  native 方法名（见 nativeMethods.js）
   * @param {object} payload - 调用方法时需要的参数，可选
   * @return {promise} 返回 Promise 对象
   */
  invoke(name, payload) {
    const promise = new Promise((resolve, reject) => {
      payload = {
        params: payload,
        successCB(res) {
          resolve(res);
        },
        errorCB(err) {
          reject(err);
        }
      };

      if (isUniApp || isIcome) {
        const nativeMethod = this.nativeMethods[name];
        if (nativeMethod) {
          console.log(`调用 ${name} 原生方法`);
          nativeMethod(payload);
        } else {
          reject(`未找到 ${name} 原生方法`);
        }
      } else {
        reject(`不在 app 中，原生方法 ${name} 不可用`);
      }
    });
    return promise;
  }

  // 注册供APP调用的方法，可注册多个同名方法
  register(cbName, callback) {
    let cbSet = this.registerFns.get(cbName);
    if (!cbSet) {
      cbSet = new Set();
      this.registerFns.set(cbName, cbSet);

      //  注册到全局
      window[cbName] = res => {
        for (const cb of cbSet) {
          if (typeof res === "string") {
            try {
              res = JSON.parse(res);
            } catch (err) {}
          }
          cb(res);
        }
      };
    }

    cbSet.add(callback);
  }
}

export const jsBridge = new JsBridge();
