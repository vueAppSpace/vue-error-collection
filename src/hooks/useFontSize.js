/*
 * @Description: icome pc版更改body字体
 * @Author: IFLS
 * @Date: 2022-07-05 15:22:51
 * @LastEditTime: 2022-07-05 15:42:52
 */
import { ref, onMounted, onBeforeUnmount } from "@vue/composition-api";

export default function (targetFontSize = "52px") {
  let defaultFontSize = ref("");
  const isPc = window.ic && !ic.isIOS && !ic.isAndroid;

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
