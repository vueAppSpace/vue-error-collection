/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-01 10:21:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:42:54
 * @FilePath: \lk-xinaohealth-h5\src\pinia\modules\scanQRcode.js
 * @Description: 扫码store
 */
import { defineStore } from "pinia";
import { reactive, toRefs } from "@vue/composition-api";
import _get from "lodash.get";
import { Toast } from "vant";
import { jsBridge } from "@/utils/native/jsBridge";
import { getErrorMessage } from "@/utils/error";
import { getUnifyQRCodeCallback, icomeRestore } from "@/service/api";
import {
  CheckinState,
  CheckinProgressState,
  Status_msg_map,
  NOT_IDENTIFY_QRCODE_TIP
} from "@/page/classReservations/util/constant";
import { HardwareOptToast } from "@/constants/commonConst";
import { isUniApp, isIcome } from "@/utils/native/deviceEnv";
import {
  isQucikQucik,
  isWeight,
  isBiDai,
  isXiDai,
  getWeightParam,
  getXiDaiParam,
  getBiDaiParam,
  isUnifyQRCode,
  getUnifyParams
} from "@/utils/scanQRcodeUtil";
import { getUserSubClassList, bindWeight, bindSign } from "@/service/classReservations";

export const useScanQRcodeStore = defineStore("scanQRcode", () => {
  const state = reactive({
    qrcode: "", //暂存扫码结果
    tiZhiChenBindSuccessFlag: false //体测仪绑定成功标志
  });

  const setQRcode = qrcode => {
    state.qrcode = qrcode;
  };

  const setTiZhiChenBindSuccessFlag = flag => {
    state.tiZhiChenBindSuccessFlag = flag;
  };

  const resetTiZhiChenBindSuccessFlag = () => {
    state.tiZhiChenBindSuccessFlag = false;
  };

  //调起扫码
  const scanCodeFn = () => {
    if (isUniApp || isIcome) {
      jsBridge
        .invoke("scanQRCode")
        .then(async ({ qrcode }) => {
          await handleQRcodeCommon(qrcode);
        })
        .catch(err => {
          //console.log("扫码异常:", err);
        });
    } else {
      Toast("请至移动端扫码");
    }
  };

  //零: 二维码处理公共入口
  const handleQRcodeCommon = async qrcode => {
    try {
      //console.log("========== qrcode ==========");
      //console.log(qrcode);
      //console.log("========== qrcode ==========");
      //1. 快快二维码

      //1.1 臂带
      //qrcode = '"deviceid":16061027,"url":"http://d.kuaikuaikeji.com/tiotaservice/Checkqrcode","classesId":0';

      //1.2 膝带
      //qrcode = "130030073";

      //1.3 体测仪
      //qrcode = "https://kifs-test.kuaikuaikeji.com/kifs-web/config/KIFS_SCAN?action=weight&uuid=f2272db343d3491e89df7d32940fa1ea&gymId=318";

      //2. 统一二维码
      //qrcode = "https://t.uat.ennew.com/cFtD8";

      if (isQucikQucik(qrcode)) {
        await handleQucikQucik(qrcode);
      } else if (isUnifyQRCode(qrcode)) {
        await handleUnify(qrcode);
      } else {
        Toast(NOT_IDENTIFY_QRCODE_TIP);
      }
    } catch (e) {
      //console.log("handleQRcodeCommon...", e);

      Toast(getErrorMessage(e) || "系统异常!");
    }
  };

  //一: 快快逻辑
  const handleQucikQucik = async qrcode => {
    //console.log("isQucikQucik qrcode...");

    let params;
    let retData;
    if (isWeight(qrcode)) {
      params = getWeightParam(qrcode);
      retData = await bindWeightFn(params);
    } else if (isBiDai(qrcode)) {
      params = getBiDaiParam(qrcode);
      retData = await bindSignPreFn(params, qrcode);
    } else if (isXiDai(qrcode)) {
      params = getXiDaiParam(qrcode);
      retData = await bindSignPreFn(params, qrcode);
    }

    if (retData != "exit") {
      const data = _get(retData, "data");
      if (data) {
        const { bindMsg, status } = data;
        if (isWeight(qrcode)) {
          if (status == 1) {
            setTiZhiChenBindSuccessFlag(true); //暂存体脂称扫描状态
          }
          Toast(bindMsg || Status_msg_map[999]);
        } else {
          Toast(Status_msg_map[status] || bindMsg || Status_msg_map[999]);
        }
      } else {
        Toast(Status_msg_map[999]);
      }
    }
  };

  //1.1 绑定设备预处理
  //有可绑定设备的预约课程-扫码后直接进入绑定设备的列表页面，进行后续绑定操作
  const bindSignPreFn = async (params, qrcode) => {
    const { data } = (await getUserSubClassList()) || {};
    const userSubClassList = _get(data, "userSubClassList") || [];
    const hasActiveRecord = userSubClassList.find(item => {
      return judgeHasActiveRecord(item);
    });
    //console.log("hasActiveRecord", hasActiveRecord);

    if (hasActiveRecord) {
      const { default: router } = await import("@/router");
      //进入设备绑定页面
      router.push({
        name: "classReservationsBindDevices",
        params: {
          classId: hasActiveRecord.classId,
          qrcode
        }
      });
      return "exit";
    } else {
      return await bindSignFn(params);
    }
  };

  //1.2
  const bindSignFn = async params => {
    return await bindSign(params);
  };

  //1.3
  const bindWeightFn = async params => {
    return await bindWeight(params);
  };

  //1.4 绑定设备(臂带，膝带)，需要先查询当前用户是否存在一个处于可绑定设备状态的预约课程)
  const judgeHasActiveRecord = item => {
    const { checkin, checkinProgress } = item;
    let flag = false;
    if (CheckinState.notSign == checkin) {
      if (CheckinProgressState.in_sign_time == checkinProgress) {
        flag = true;
      }
    } else if (CheckinState.signed == checkin) {
      flag = true;
    }
    return flag;
  };

  //二: 统一扫码 (健检部门 || 聚合永健 || 更多...)
  const handleUnify = async qrcode => {
    //console.log("isUnifyQRCode qrcode...");

    const { code, data, message } = (await icomeRestore({ shortUrl: qrcode })) || {};
    if (code == 0) {
      const { url } = data || {};
      const params = getUnifyParams(url);
      await getUnifyQRCodeCallbackFn(params);
    } else {
      Toast(message || "二维码短变长失败!");
    }
  };

  const getUnifyQRCodeCallbackFn = async params => {
    const { code, message } = (await getUnifyQRCodeCallback(params)) || {};
    if (code == 0) {
      Toast(message || HardwareOptToast[params.type] + "成功!");
    } else {
      Toast(message || HardwareOptToast[params.type] + "失败!");
    }
  };

  return {
    ...toRefs(state),
    setQRcode,
    scanCodeFn,
    handleQRcodeCommon,
    handleQucikQucik,
    handleUnify,
    bindSignFn,
    bindWeightFn,
    getUnifyQRCodeCallbackFn,
    setTiZhiChenBindSuccessFlag,
    resetTiZhiChenBindSuccessFlag
  };
});
