/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-24 09:33:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:46:35
 * @FilePath: \lk-xinaohealth-h5\src\utils\scanQRcodeUtil.ts
 * @Description: ****
 */
import { QucikQucikDeviceType } from "@/page/classReservations/util/constant";

export function getUrlParam(key: string, url?: string): string {
  var query = url || window.location.href;
  var v = query.match(new RegExp("(/?|&)" + key + "=([^&]*)(&|$)", "i"));
  var value;
  if (v != null) {
    value = decodeURI(v[2]);
  }
  return value || "";
}

/**臂带
 *
 *示例: "deviceid":16061027,"url":"http://d.kuaikuaikeji.com/tiotaservice/Checkqrcode","classesId":0
 *
 *特征值: 包含 deviceid 且 deviceid 的值是 16 开头
 */

// const qrcode = '"deviceid":16061027,"url":"http://d.kuaikuaikeji.com/tiotaservice/Checkqrcode","classesId":0';
// isBiDai(qrcode);
// getBiDaiParam(qrcode);
export function isBiDai(qrcode: string): boolean {
  let reg = /deviceid.*16\d{6}/g;
  return reg.test(qrcode);
}

export function getBiDaiParam(qrcode: string): object {
  let reg = /deviceid.*16\d{6}/g;
  let arr: RegExpMatchArray | [] = qrcode.match(reg) || [];
  const deviceNo = arr[0]?.split(":")[1];
  return {
    deviceNo,
    deviceType: QucikQucikDeviceType.biDai
  };
}

/**膝带
 *
 * 示例: 130030073 (9位数字，即为设备编号)
 *
 * 特征值：13 开头且长度是 9 位
 */

// const qrcode = "130030073";
// isXiDai(qrcode);
// getXiDaiParam(qrcode);
export function isXiDai(qrcode: string): boolean {
  let reg = /^13\d{7}$/g;
  return reg.test(qrcode);
}

export function getXiDaiParam(qrcode: string): object {
  return {
    deviceNo: qrcode,
    deviceType: QucikQucikDeviceType.leftXiDai //默认先填充左系带(设备列表页，用户再重新选择)
  };
}

/**
 * https://kifs-test.kuaikuaikeji.com/kifs-web/config/KIFS_SCAN?action=weight&uuid=f2272db343d3491e89df7d32940fa1ea&gymId=318
 *
 * 特征值: KIFS_SCAN?action=weight
 *
 * uuid：绑定标识
 * gymId：门店ID
 */

// const qrcode = "https://kifs-test.kuaikuaikeji.com/kifs-web/config/KIFS_SCAN?action=weight&uuid=f2272db343d3491e89df7d32940fa1ea&gymId=318";
// isWeight(qrcode);
// getWeightParam(qrcode);

export function isWeight(qrcode: string): boolean {
  let reg = /KIFS_SCAN\?action=weight/g;
  return reg.test(qrcode);
}

export function getWeightParam(qrcode: string): object {
  const uuid = getUrlParam("uuid", qrcode);
  const gymId = getUrlParam("gymId", qrcode);
  return {
    uuid,
    gymId,
    deviceType: QucikQucikDeviceType.tiZhiChen
  };
}

//一: 是快快得设备
export function isQucikQucik(qrcode: string): boolean {
  return isBiDai(qrcode) || isXiDai(qrcode) || isWeight(qrcode);
}

//二: 是统一二维码
// const qrcode = "https://t.ennew.com/1hVOEo";
// const qrcode = "https://t.uat.ennew.com/1hVOEo";
// isUnifyQRCode(qrcode);
export function isUnifyQRCode(qrcode: string): boolean {
  let reg = /t\.ennew\.com/;
  const ret = qrcode.match(reg);
  const flag = reg.test(qrcode);
  console.log(flag);
  return flag;
}

// const url =
//     "https://icome-dingtalk-h5.uat.ennew.com/transit?redirect_uri=https://c-qa.op.laikang.com/report/qrcode-page?dd_full_screen=true&ticket=ticket&type=2000&randomId=c24da17ca8eb4b25";
// const params = getUnifyParams(url);
export function getUnifyParams(url: string): object {
  const decodedURL = decodeURIComponent(url);
  const type = getUrlParam("type", decodedURL);
  const randomId = getUrlParam("randomId", decodedURL);
  return {
    type,
    randomId
  };
}
