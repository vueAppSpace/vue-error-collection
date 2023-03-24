/*
 * @Description: Detecting prefixes for saving time and bytes
 * @Author: IFLS
 * @Date: 2022-06-10 16:04:48
 * @LastEditTime: 2023-03-23 17:35:46
 */
export default function detectPrefixes() {
  let transform;
  let transition;
  let transitionEnd;
  let hasTranslate3d;
  (function () {
    let el = document.createElement("_");
    let style = el.style;
    let prop;
    if (style[(prop = "webkitTransition")] === "") {
      transitionEnd = "webkitTransitionEnd";
      transition = prop;
    }
    if (style[(prop = "transition")] === "") {
      transitionEnd = "transitionend";
      transition = prop;
    }
    if (style[(prop = "webkitTransform")] === "") {
      transform = prop;
    }
    if (style[(prop = "msTransform")] === "") {
      transform = prop;
    }
    if (style[(prop = "transform")] === "") {
      transform = prop;
    }
    document.body.insertBefore(el, null);
    style[transform] = "translate3d(0, 0, 0)";
    // hasTranslate3d = !!global.getComputedStyle(el).getPropertyValue(transform);
    hasTranslate3d = !!window.getComputedStyle(el).getPropertyValue(transform);
    document.body.removeChild(el);
  })();
  return {
    transform,
    transition,
    transitionEnd,
    hasTranslate3d
  };
}
