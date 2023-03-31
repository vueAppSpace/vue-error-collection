/*
 * @Description: icome pc版更改body字体
 * @Author: IFLS
 * @Date: 2022-07-05 15:22:51
 * @LastEditTime: 2023-03-31 15:51:10
 */
import { ref, onMounted, onBeforeUnmount } from "@vue/composition-api";
import { isMobile } from "@/utils/native/deviceEnv";

export default function (targetFontSize = "52px") {
  let defaultFontSize = ref("");
  const isPc = !isMobile;

  onMounted(() => {
    if (isPc) {
      defaultFontSize.value = document.documentElement.style.fontSize;
      document.documentElement.style.fontSize = targetFontSize;
    }
  });

  onBeforeUnmount(() => {
    if (isPc) {
      document.documentElement.style.fontSize = defaultFontSize.value;
    }
  });

  return {
    defaultFontSize,
    targetFontSize
  };
}
