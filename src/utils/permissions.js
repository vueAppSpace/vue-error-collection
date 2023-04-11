/*
 * @Description: 用户鉴权函数
 * @Author: IFLS
 * @Date: 2022-08-12 09:39:33
 * @LastEditTime: 2023-04-10 15:56:00
 */
import { Toast } from "vant";

function throwError(userStore) {
  if (userStore) {
    //console.log({ userStore });
  }
  Toast("服务即将开启，敬请期待~");
  throw new Error("用户权限异常");
}

// 生命熵测试用户
function isEntropy() {
  const userStore = JSON.parse(sessionStorage.getItem("userStore"));
  if (!userStore) return throwError(userStore);
  const isTestUser = userStore.userInfo.isTestUser;
  return isTestUser === 2;
}

// TODO: 权限需要改造
export default function () {
  const userStore = JSON.parse(sessionStorage.getItem("userStore"));
  if (!userStore) return throwError(userStore);
  const isTestUser = userStore.userInfo.isTestUser;
  // const isLangfang = userStore.userInfo.isLangfang;

  let user;
  // 生命熵+健康计划用户
  if (isTestUser === 2) {
    user = 3;
    // 健康计划用户
  } else if (isTestUser === 1) {
    user = 3;
    // 工间操用户
  } else if (isTestUser === 0) {
    user = 0;
  } else {
    user = -1;
    throwError(userStore);
  }
  return user;
}

export { isEntropy };
