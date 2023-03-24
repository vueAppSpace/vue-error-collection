/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-10 14:34:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:46:42
 * @FilePath: \lk-xinaohealth-h5\src\utils\vconsoleUtil.js
 * @Description: ****
 */
import scriptUrl from "@/utils/url";
import { loadScript } from "@/utils/commonFun";

export function loadVconsole(isShow) {
  if (!window.VConsole) {
    loadScript(scriptUrl.VConsole).then(() => {
      new VConsole();
      isShow && show();
    });
  } else {
    isShow && show();
  }
}

export function showVconsole() {
  loadVconsole(true);
}

export function hideVconsole() {
  hide();
}

function show() {
  const vconsole = document.querySelector(".vc-switch");
  if (vconsole) {
    vconsole.classList.add("active");
  }
}

function hide() {
  const vconsole = document.querySelector(".vc-switch");
  if (vconsole) {
    vconsole.classList.remove("active");
  }
}
