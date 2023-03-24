export * from "./commonFun";
export * from "./native/ddTools";
export * from "./filter";
export * from "./isIosX";
export { default as jumpToDanao } from "./jumpToDanao";
export * from "./jumpToSportGym";
export * from "./lifeEntropyMethod";
export * from "./myStorage";
export * from "./permissions";
export { default as permissions } from "./permissions";
export { default as playerOptions } from "./playerOptions";
export * from "./setToken";
export { default as validator } from "./validator";

// 最多保留两位小数
export function mostKeepTwoDecimal(num) {
  if (isNaN(num)) {
    console.log(`${num} 类型错误，需要传入 Number 类型数据`);
    return false;
  } else {
    return parseFloat(num.toFixed(2));
  }
}
