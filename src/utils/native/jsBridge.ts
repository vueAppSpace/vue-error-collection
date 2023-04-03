import nativeMethods from "@/utils/native/nativeMethods";
import { isUniApp, isIcome } from "@/utils/native/deviceEnv";
import { NativeMethods } from "@/utils/native/nativeMethods";

type Params = Record<string, any> | undefined;
type CallBack = (res?: any) => void;
type CBSet = Set<CallBack>;

export interface Payload {
  params: Params;
  successCB: (res: any) => void;
  errorCB: (err: any) => void;
}

class JsBridge {
  private registerFns: Map<string, CBSet>;
  nativeMethods: NativeMethods;
  constructor() {
    this.registerFns = new Map();
    this.nativeMethods = nativeMethods;
  }

  /**
   * @description js调用APP的方法
   * @param {string} name -  native 方法名（见 nativeMethods.js）
   * @param {object} params - 调用方法时需要的参数，可选
   * @return {promise} 返回 Promise 对象
   */
  invoke(name: string, params?: Params): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const payload: Payload = {
        params,
        successCB(res) {
          resolve(res);
        },
        errorCB(err) {
          reject(err);
        }
      };

      const nativeMethod = this.nativeMethods[name];
      if (isUniApp || isIcome) {
        if (nativeMethod) {
          console.log(`调用 ${name} 原生方法`);
          nativeMethod(payload);
        } else {
          reject(`未找到 ${name} 原生方法`);
        }
      } else {
        // h5环境
        if (nativeMethod) {
          console.log(`调用 ${name} h5方法`);
          nativeMethod(payload);
        } else {
          reject(`不在 app 中，原生方法 ${name} 不可用`);
        }
      }
    });

    return promise;
  }

  // 注册供APP调用的方法，可注册多个同名方法
  register(cbName: string, callback: CallBack): void {
    let cbSet = this.registerFns.get(cbName);
    if (!cbSet) {
      cbSet = new Set();
      this.registerFns.set(cbName, cbSet);

      //  注册到全局
      window[cbName] = (res: any) => {
        for (const cb of cbSet as CBSet) {
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
