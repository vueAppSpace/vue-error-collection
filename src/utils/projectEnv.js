/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-10 14:47:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-24 11:47:47
 * @FilePath: \lk-xinaohealth-h5\src\utils\projectEnv.js
 * @Description: ****
 */
// import { PLATFORM } from "@/constants/platformConst";
// const host = window.location.href;
export function isProduction() {
  // return ~host.indexOf("c.op.laikang.com/report") || LK_PROJECT.PLATFORM === PLATFORM.PROD;
  return process.env.VITE_ENV.includes("pro");
}

export function isTesting() {
  // return ~host.indexOf("c-qa.op.laikang.com/report") || LK_PROJECT.PLATFORM === PLATFORM.TESTING;
  return process.env.VITE_ENV.includes("qa");
}
