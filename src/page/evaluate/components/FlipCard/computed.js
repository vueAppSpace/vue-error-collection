/*
 * @Description: computed
 * @Author: IFLS
 * @Date: 2022-06-10 18:20:00
 * @LastEditTime: 2023-03-23 17:35:44
 */
import { computed } from "@vue/composition-api";

export default function (state, $el) {
  // 划出面积比例
  const offsetRatio = computed(() => {
    const width = $el && $el.offsetWidth;
    const height = $el && $el.offsetHeight;
    const offsetWidth = width - Math.abs(state.temporaryData.poswidth);
    const offsetHeight = height - Math.abs(state.temporaryData.posheight);
    const ratio = 1 - (offsetWidth * offsetHeight) / (width * height) || 0;
    return ratio > 1 ? 1 : ratio;
  });

  // 划出宽度比例
  const offsetWidthRatio = computed(() => {
    const width = $el && $el.offsetWidth;
    const offsetWidth = width - Math.abs(state.temporaryData.poswidth);
    const ratio = 1 - offsetWidth / width || 0;
    return ratio;
  });

  return {
    offsetRatio,
    offsetWidthRatio
  };
}
