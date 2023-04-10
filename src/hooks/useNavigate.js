/*
 * @Description: 封装通用导航方法
 * @Author: WANGCHENGAE
 * @Date: 2022-12-19 11:00:30
 * @LastEditTime: 2023-04-10 14:41:54
 */
import { getURLParameters, getFullURLFromParameters } from "@/utils/commonFun";
import { ddOpenWebView } from "@/utils/ddTools.js";
import URL from "url-parse";

export default function useNavigate(router) {
    const navigateTo = function (params, isOpenView = true) {
        //debugger;
        if (!params) console.error("[LK Error]: The params of navigateTo() is not provided!");

        if (typeof params === "object") {
            vuePush(router, params);
        } else if (typeof params === "string") {
            if (params.includes("http")) {
                //来康内部链接，使用 push导航
                if (isLaiKangLink(params)) {
                    console.log("isLaiKangLink>>>");

                    params = paramsPreHandle(params);
                    vuePush(router, params);
                } else {
                    //非来康内部链接，默认开webview
                    if (isOpenView) {
                        console.warn("[LK Warn]: Please open the external link on your mobile phone!");
                        ddOpenWebView({
                            targetUrl: params,
                            refreshTicket: false,
                        });
                    } else {
                        window.location.href = params;
                    }
                }
            } else {
                vuePush(router, params);
            }
        } else {
            console.error("[LK Error]: The params of navigateTo must be object or string");
        }
    };
    return {
        navigateTo,
    };
}

function vuePush(router, params) {
    if (!router) {
        console.error("[LK Error]: The param 'router' of useNavigate() method must be privided!");
    }
    router.push(params);
}

function isLaiKangLink(url) {
    return /.*\.laikang\.com/g.test(url);
}

//https://c.op.laikang.com/report/health-encyclopedia-detail?id=115&dd_full_screen=true&ticket=ticket&backHome=true&source=push
function paramsPreHandle(params) {
    const exclude = ["dd_full_screen", "ticket", "backHome", "source"];

    const url = new URL(params);
    const path = url.pathname.slice("/report/".length);
    const urlParamsObj = getURLParameters(url.query);
    const retParamsObj = Object.keys(urlParamsObj).reduce((acc, cur) => {
        return exclude.includes(cur) ? acc : (acc[cur] = urlParamsObj[cur]) && acc;
    }, {});
    return getFullURLFromParameters(path, retParamsObj);
}
