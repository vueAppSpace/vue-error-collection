/*
 * @Description: 物联 权限3
 * @Author: IFLS
 * @Date: 2022-08-12 14:27:15
 * @LastEditTime: 2022-08-14 11:20:36
 */
const union = r => require.ensure([], () => r(require("@/page/union/union3/index")), "union");

export default [
    {
        // 物联
        path: "/union",
        name: "union",
        component: union,
        meta: {
            title: "物联",
            keepAlive: true,
            showTab: true,
            showFeedBack: true
        }
    }
];
