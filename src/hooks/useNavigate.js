/*
 * @Description: 封装通用导航方法
 * @Author: WANGCHENGAE
 * @Date: 2022-12-19 11:00:30
 * @LastEditTime: 2023-03-23 17:33:02
 */

export default function useNavigate(router) {
  const navigateTo = function (params) {
    if (typeof params === "object") {
      vuePush(router, params);
    } else if (typeof params === "string") {
      if (params.includes("http")) {
        window.location.href = params;
      } else {
        vuePush(router, params);
      }
    } else {
      console.error("[LK Error]: The params of navigateTo must be object or string");
    }
  };
  return {
    navigateTo
  };
}

function vuePush(router, params) {
  if (!router) {
    console.error("[LK Error]: The param 'router' of useNavigate() method must be privided!");
  }
  router.push(params);
}
