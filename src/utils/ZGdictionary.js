/*
 * @Description: 诸葛埋点字典
 * @Author: IFLS
 * @Date: 2022-04-26 15:06:12
 * @LastEditTime: 2023-03-23 17:46:44
 */

// 页面来源字典翻译
const checkSource = v => {
  const T = {
    push: "推送",
    galaxy: "星系图",
    icome: "icome-我的",
    themeActivityHome: "活动首页",
    dynamicDetail: "动态详情",
    activityDetail: "活动详情",
    myUpdates: "我的动态",
    rankListActivity: "动态打卡排行",
    blzq: "86活动",
    homeBanner: "首页轮播图"
  };
  return T[v] ? T[v] : null;
};

// 满意程度字典翻译
const checkEvaluation = v => {
  const T = {
    1: "非常吃力",
    2: "吃力",
    3: "有点吃力",
    4: "轻松",
    5: "非常轻松"
  };
  return T[v];
};

export { checkSource, checkEvaluation };
