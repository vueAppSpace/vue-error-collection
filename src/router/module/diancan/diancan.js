/*
 * @Description: 问卷 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:24:54
 * @LastEditTime: 2022-08-14 11:18:08
 */
const diancan = r => require.ensure([], () => r(require("@/page/diancanIframe")), "diancanIframe");

export default [
    {
        // 大脑问卷评估
        path: "/diancan",
        name: "diancan",
        component: diancan,
        meta: {
            showTab: false,
            showFeedBack: false,
            title: '商品详情'
        }
    },
];
