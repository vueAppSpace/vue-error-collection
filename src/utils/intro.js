/*
 * @Description: 引导插件
 * @Author: IFLS
 * @Date: 2022-06-14 17:05:16
 * @LastEditTime: 2023-03-23 17:46:17
 */
import introJs from "intro.js";
import "intro.js/introjs.css";
import "./intro.css";

const intro = introJs();

// 提示步骤
const defaultSteps = [
  {
    element: ".location-box",
    title: "1/2",
    intro: "您当前的地理位置，为您提供最近的健康服务，可以点击切换。",
    position: "bottom-right"
  },
  {
    element: ".header-right",
    title: "2/2",
    intro: "从今天开始，我将常伴您的健康。",
    position: "bottom"
  }
];

// 基础配置
intro.setOptions({
  // tooltipClass: "customTooltip",
  nextLabel: "我知道了", // 下一个按钮文字
  doneLabel: "我知道了", // 完成按钮文字
  // prevLabel: "上一个", // 上一个按钮文字
  // skipLabel: '跳过', // 跳过按钮文字
  hidePrev: true, // 在第一步中是否隐藏上一个按钮
  hideNext: false, // 在最后一步中是否隐藏下一个按钮
  exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
  showStepNumbers: false, // 是否显示红色圆圈的步骤编号
  disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
  showBullets: false // 是否显示面板指示点
});

const isPassive = { passive: false };

const handler = event => event.preventDefault();

// 阻止页面滚动
const preventScroll = () => document.addEventListener("touchmove", handler, isPassive);

// 恢复页面滚动
const restoreScroll = () => document.removeEventListener("touchmove", handler, isPassive);

// 开始函数
const introStart = (version, steps = defaultSteps) => {
  if (typeof version !== "string") {
    throw new Error("引导插件缺少版本号参数");
  }

  const v = JSON.parse(localStorage.getItem(version));
  return new Promise(resolve => {
    if (!v) {
      intro.setOptions({ steps });
      preventScroll();
      intro
        .onbeforeexit(() => {
          restoreScroll();
          localStorage.setItem(version, "true");
          resolve(true);
        })
        .start();
    } else {
      resolve(false);
    }
  });
};

export default introStart;
