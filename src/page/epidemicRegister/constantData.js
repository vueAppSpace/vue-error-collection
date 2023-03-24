import ValidMap from "@/utils/validator";
import { sportGym } from "@/config/env";

export const CodeNameMap = {
  lk1589863443379: "registerName", //姓名
  lk1589863444942: "registerCardNo", //身份证号
  lk1589863448622: "registerPhone" //手机号
};

//记录那些页面需要跳转到疫情注册页面
export const SourcePageArray = ["/service"];

//type值为 2或者3 的才能跳转疫情注册页面
export const ValidSourceTypeArray = ["2", "3"];
export const SourceType = {
  // 1: "运动记录",
  2: "场地预约",
  3: "团课预约"
  // 4: "预约记录",
  // 5: "云健身",
  // 6: "体测报告",
};
export const SourceDestUrlMap = {
  // 1: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$code&router=%2Fpages%2Ffitness-record%2Findex`, // 运动记录
  2: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$code&router=%2Fpages%2Fhome%2Findex&card=sitePack`, // 场地预约
  3: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$code&router=%2Fpages%2Fhome%2Findex&card=group` // 团课预约
  // 4: `${sportGym}?dd_full_screen=true/#/pages/sign/index?code=$code&router=%2Fpages%2FsignIn%2Findex`, // 预约记录
  // 5: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$code&router=%2Fpages%2Fhome%2Findex&card=live`, // 云健身
  // 6: `${sportGym}?dd_full_screen=true#/pages/sign/index?code=$code&modular=bodyTest`, // 体测报告
};

export function getSourceDestUrl(type, code) {
  return SourceDestUrlMap[type].replace("$code", code);
}

export const FieldType = {
  input: 0,
  check: 1,
  radio: 2
};

export const inputList = [
  {
    title: "您的姓名",
    name: "registerName",
    placeholder: "请输入您的姓名",
    type: "text",
    maxLength: 25,
    flag: "text"
  },
  {
    title: "证件号码（身份证）",
    name: "registerCardNo",
    placeholder: "请输入您的证件号码",
    type: "text",
    maxLength: 18,
    flag: "idCard",
    rules: [{ validator: ValidMap.idCard, message: "请输入正确的身份证号", trigger: "onBlur" }]
  },
  {
    title: "手机号码",
    name: "registerPhone",
    placeholder: "请输入您的手机号码",
    type: "tel",
    maxLength: 11,
    flag: "mobile",
    rules: [{ validator: ValidMap.mobile, message: "请输入正确的手机号", trigger: "onBlur" }]
  }
];

export const HealthType = {
  health: 0,
  notHealth: 1
};

//这几个问题选"是"代表用户不健康
export const NotHealthArray = ["q3", "q5", "q6", "q7"];

export const radioList = [
  {
    title: "在廊坊是否有固定居住所",
    name: "q1"
  },
  {
    title: "您是否已接种完疫苗",
    name: "q2"
  },
  {
    title: "您近14天是否接触过新冠确认病人或疑似病人？",
    name: "q3"
  },
  {
    title: "您近14天是否离开过廊坊",
    name: "q4"
  },
  {
    title: "您近14天是否到达过疫情中高风险地区？",
    name: "q5"
  },
  {
    title: "您是否处于隔离或居家观察中？",
    name: "q6"
  },
  {
    title: "您是否有发热、气促、呼吸道症状？",
    name: "q7"
  }
];

export const agreeList = [
  {
    title: "为疫情防控，本人同意以上信息依法提交所在辖区疫情防控部门统筹管理。",
    name: "a"
  },
  {
    title:
      "上述信息是我本人填写，本人对信息内容的真实性和完整性负责。如果信息有误或缺失，本人愿承担相应的法律责任。同时，本人保证遵守防控管控的各项规定，配合并听从各项措施和要求",
    name: "b"
  }
];

export function getInputList() {
  return inputList.map((item, index) => {
    item.index = index;
    item.fieldType = FieldType.input;
    item.value = "";
    item.required = true;
    return item;
  });
}

export function getRadioList() {
  return radioList.map((item, index) => {
    item.index = index;
    item.fieldType = FieldType.radio;
    item.value = ""; //选项组group的值
    item.valueArray = [
      { label: "是", value: 1 },
      { label: "否", value: 0 }
    ];
    item.required = true;
    return item;
  });
}

export function getAgreeData() {
  return {
    agreeList,
    agreeResult: []
  };
}
