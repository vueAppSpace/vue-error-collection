import { ref } from "@vue/composition-api";
import { ornamentUserWear } from "@/service/achievement/index";
import { ImgsMap } from "../constant";

export function useOrnament(emit) {
  // 弹窗
  const showTips = ref(false);
  const selectedOrnament = ref({});
  function onSelectOrnament(headFrame) {
    selectedOrnament.value = headFrame;
    showTips.value = true;
  }

  // 按钮文本
  function getBtnText({ wearState, isHave }) {
    let text;
    if (wearState === 1) {
      text = "使用中";
    } else if (isHave === 0) {
      text = "未获得";
    } else if (isHave === 1) {
      text = "使用";
    }
    return text;
  }

  // 配饰操作
  function onHandleOrnament() {
    const { wearState, isHave, ornamenUsertId, ornamentNum, ornamentType } = selectedOrnament.value;
    if (wearState === 0 && isHave === 1) {
      ornamentUserWear({ ornamenUsertId, ornamentNum, ornamentType })
        .then(({ code, message }) => {
          if (code === 0) {
            emit("updateList");
            selectedOrnament.value.wearState = 1;
            setTimeout(() => {
              showTips.value = false;
            }, 300);
          } else {
            //console.log("ornamentUserAll:" + message);
          }
        })
        .catch(err => console.log("ornamentUserAll:" + err));
    }
  }

  return {
    ImgsMap,
    showTips,
    selectedOrnament,
    getBtnText,
    onSelectOrnament,
    onHandleOrnament
  };
}
