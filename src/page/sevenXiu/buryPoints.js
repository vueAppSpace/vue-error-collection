export function clickTab(name, title) {
  this.zgStatistics("健康新奥-点击切换菜单", {
    所属功能: "服务",
    类型: "tab",
    所属模块: "七修养生",
    所点菜单名称: title
  });
}

export function clickViewAll(zgStatistics) {
  zgStatistics("健康新奥-点击’更多‘类型按钮", {
    按钮名称: "查看全部",
    所属功能: "服务",
    所属模块: "七修养生",
    名称: "每日一修"
  });
}

export function clickCard(zgStatistics, data) {
  const { type, name, link = "" } = data;
  zgStatistics("健康新奥-点击卡片", {
    所属功能: "服务",
    页面类型: "页面",
    所属模块: "七修养生",
    所属分类: type,
    卡片名称: name,
    跳转内容链接: link
  });
}
