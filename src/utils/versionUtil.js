/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-10 15:50:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:46:46
 * @FilePath: \lk-xinaohealth-h5\src\utils\printVersion.js
 * @Description: ****
 */
export const printVersion = () => {
  if (typeof LK_PROJECT !== "undefined") {
    console.log("LK_PROJECT", LK_PROJECT);
  }
};
