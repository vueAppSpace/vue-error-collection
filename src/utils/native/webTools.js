/*
 * @Description: h5同钉钉或uniapp交互函数
 * @Author: IFLS
 * @Date: 2023-03-31 15:04:50
 * @LastEditTime: 2023-03-31 15:17:04
 */
import { orderLunchUrl as icomeTransitTicket } from "@/config/env";

/**
 * @description: web唤起icome
 * @param {object}
 *    - { targetUrl: 页面url, extraParame: 额外参数 &a=1&b=2形式 }
 * @return void
 */
export const webOpenIcome = ({ params }) => {
  const { targetUrl, extraParame = "" } = params;
  const dingUrl = `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(
    icomeTransitTicket + encodeURIComponent(targetUrl + "?ticket=ticket" + extraParame)
  )}`;
  window.location.href = dingUrl;
};
