/*
 * @Description: 用户鉴权函数
 * @Author: IFLS
 * @Date: 2022-08-12 09:39:33
 * @LastEditTime: 2023-03-24 09:43:26
 */
import { Toast } from "vant";

export default function () {
  const userStore = JSON.parse(sessionStorage.getItem("userStore"));
  const isTestUser = userStore.userInfo.isTestUser;
  const isLangfang = userStore.userInfo.isLangfang;

  let user;
  if (isTestUser === 0 && !isLangfang) {
    user = 0; //  非廊坊普通用户
  } else if (isTestUser === 0 && isLangfang) {
    user = 1; // 廊坊普通用户
  } else if (isTestUser > 0 && !isLangfang) {
    user = 2; // 非廊坊测试用户
  } else if (isTestUser > 0 && isLangfang) {
    user = 3; // 廊坊测试用户
  } else {
    user = -1;
    Toast("服务即将开启，敬请期待~");
    console.log({ isLangfang, isTestUser });
    throw new Error("用户权限异常");
  }
  return user;
}

// 生命熵测试用户
function isEntropy() {
  const isTestUser = JSON.parse(localStorage.getItem("isTestUser"));
  return isTestUser === 2;
}

export { isEntropy };
