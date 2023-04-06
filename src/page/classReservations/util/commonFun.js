const DayAndWeekNameMap = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六"
};

const DateNameIndexMap = {
  0: "今",
  1: "明"
};

//生成一个默认的dateList
export function getDefaultDateList() {
  console.log("getDefaultDateList====>");

  const currentDayZeroDateMillSecords = new Date().setHours(0, 0, 0, 0);
  const onDayTotalMillSecords = 24 * 60 * 60 * 1000;

  const dateList = [];
  for (let i = 0; i < 7; i++) {
    let date = currentDayZeroDateMillSecords + i * onDayTotalMillSecords;
    let dateObj = new Date(date);

    dateList.push({
      token: null,
      userEmpNo: null,
      date,
      dateName: i < 2 ? DateNameIndexMap[i] : dateObj.getDate(),
      weekName: DayAndWeekNameMap[dateObj.getDay()], //0-6: 0: 星期日
      subCount: 0,
      classList: []
    });
  }
  return dateList;
}
