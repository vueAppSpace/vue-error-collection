/*
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-07-05 16:25:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:46:11
 * @FilePath: \workBreakExercises\src\utils\filter.js
 * @Description: 过滤器
 */
// import moment from 'moment'
// moment.locale('zh-cn');
//定义一个全局过滤器实现日期格式化
export function getMoment(dateTimeStamp) {
  let minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let month = day * 30;
  let now = new Date().getTime(); //获取当前时间毫秒
  let result = "";
  let diffValue = now - dateTimeStamp; //时间差

  if (diffValue < 0) {
    return;
  }
  let minC = diffValue / minute; //计算时间差的分，时，天，周，月
  let hourC = diffValue / hour;
  let dayC = diffValue / day;
  let weekC = diffValue / week;
  let monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = " " + parseInt(monthC) + "月前";
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前";
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前";
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前";
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前";
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚";
  } else {
    let datetime = new Date();
    datetime.setTime(dateTimeStamp);
    let Nyear = datetime.getFullYear();
    let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    result = Nyear + "-" + Nmonth + "-" + Ndate;
  }
  return result;
}
// 定义时间戳转时间工具函数
export const stampToTime = value => {
  let date = new Date(value);
  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM; //月补0
  let d = date.getDate();
  d = d < 10 ? "0" + d : d; //天补0
  let h = date.getHours();
  h = h < 10 ? "0" + h : h; //小时补0
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m; //分钟补0
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s; //秒补0
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
};
