/*
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-06 10:57:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:35:25
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\util\constant.ts
 * @Description: 动感团操 - 常量定义
 */
export const OptStatusTextMap = {
  0: "预约",
  1: "已预约",
  2: "已约满",
  3: "需购买"
};

export const OptStatusMap = {
  booking: 0,
  booked: 1,
  bookedFilled: 2,
  needBuy: 3
};

export const ReportStatusMap = {
  normal: 0,
  exception: 1
};

/*
预约记录状态:
1.未完成
2.已完成
*/
export enum RecordState {
  notFinish = 0,
  finished = 1
}

/**
 * 是否已签到
 * 0-未签到 1-已签到
 */
export enum CheckinState {
  notSign = 0,
  signed = 1
}

/**
 * 签到进度值
 * 0-未到签到时间 1-正在签到时间 2-已过签到时间
 */
export enum CheckinProgressState {
  no_sign_time = 0,
  in_sign_time = 1,
  out_sign_time = 2
}

/**
 * 设备类型
 * 设备类型，1臂带，2左膝带，3右膝带，4体脂称
 */
export enum QucikQucikDeviceType {
  biDai = 1,
  leftXiDai = 2,
  rightXiDai = 3,
  tiZhiChen = 4
}

/**
 * 绑定设备code码提示
 */
export const Status_msg_map = {
  1: "设备绑定或替换成功",
  2: "请选择绑定膝带左右位置",
  3: "您还未约课，无法绑定设备",
  4: "开课前25分钟开始进行设备绑定哦",
  5: "正在上课中，无法绑定设备",
  6: "此设备已被绑定",
  7: "此设备您已绑定成功",
  8: "设备未注册，绑定失败",
  999: "暂时无法绑定设备，请咨询场内工作人员"
};

/**
 * 设备列表预填数据
 */
export const initDeivceList = [
  {
    name: "智能体测仪",
    deviceType: QucikQucikDeviceType.tiZhiChen,
    isBind: false,
    tip: "请使用体脂秤称重",
    bindedText: "未绑定",
    bindedTip: "",
    bindedTimeText: "称重时间",
    url: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/ticeyi.png"
  },
  {
    name: "智能臂带",
    deviceType: QucikQucikDeviceType.biDai,
    isBind: false,
    tip: "请扫描智能臂带",
    bindedText: "未绑定",
    bindedTip: "请佩戴至左臂",
    bindedTimeText: "扫描时间",
    url: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/bidai.png"
  },
  {
    name: "智能膝带 (左)",
    deviceType: QucikQucikDeviceType.leftXiDai,
    isBind: false,
    tip: "请绑定智能膝带 (左)",
    bindedText: "未绑定",
    bindedTip: "请佩戴至左膝",
    bindedTimeText: "扫描时间",
    url: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/xidaileft.png"
  },
  {
    name: "智能膝带 (右)",
    deviceType: QucikQucikDeviceType.rightXiDai,
    isBind: false,
    tip: "请绑定智能膝带 (右)",
    bindedTip: "请佩戴至右膝",
    bindedText: "未绑定",
    bindedTimeText: "扫描时间",
    url: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/xidaiRight.png"
  }
];

/**
 * 无法识别二维码提示
 */
export const NOT_IDENTIFY_QRCODE_TIP = "此二维码无法识别";
