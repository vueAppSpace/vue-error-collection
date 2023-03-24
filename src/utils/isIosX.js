/*
 * @Description: 判断是否为iphone x等异形屏设备
 * @Author: IFLS
 * @Date: 2022-04-29 15:40:14
 * @LastEditTime: 2023-03-23 17:46:19
 */

const isIosX =
  /iphone/gi.test(window.navigator.userAgent) &&
  ((window.screen.height >= 812 && window.screen.width >= 375) ||
    (window.screen.height >= 896 && window.screen.width >= 414));

export { isIosX };
