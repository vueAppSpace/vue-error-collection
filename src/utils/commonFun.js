/**
 * 根据疾病code进行数组升维
 * @param {Array} arr 疾病列表arr
 * @param {String} code 疾病code
 */
export function unFlatArr(arr, code) {
  return Object.values(
    arr.reduce((preVal, currentVal) => {
      preVal[currentVal[code]] ? preVal[currentVal[code]].push(currentVal) : (preVal[currentVal[code]] = [currentVal]);
      return preVal;
    }, {})
  );
}

// 格式化时间戳
export function formatTime(time) {
  if (!time) return "";
  let [date, Y, M, D] = [new Date(time), "", "", ""];
  Y = date.getFullYear();
  M = (date.getMonth() + 1).toString().padStart(2, "0");
  D = date.getDate().toString().padStart(2, "0");
  return `${Y}年${M}月${D}日`;
}

// 格式化时间戳
export function formatTimeForBirth(time) {
  if (!time) return "";
  let [date, Y, M, D] = [new Date(time), "", "", ""];
  Y = date.getFullYear();
  M = (date.getMonth() + 1).toString().padStart(2, "0");
  D = date.getDate().toString().padStart(2, "0");
  return `${Y}-${M}-${D}`;
}

// 格式化视频时间
export function formatVideoTime(value) {
  let minute = parseInt(value / 60);
  let ms = value % 60;
  if (minute <= 10) {
    minute = "0" + minute;
  }
  if (ms <= 10) {
    ms = "0" + ms;
  }
  return `${minute}:${ms}`;
}

export const formatDate = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
};

/**
 * 健康管理颜色字典
 * @param {*} num 色值
 */
export function fillColor(num) {
  const v = num > 0 ? 0 : num < 0 ? 1 : 2;
  const T = {
    0: { color: "#e5f9ef", textColor: "#00C863" }, // 绿色 适宜
    1: { color: "#feeff4", textColor: "#fc6294" }, // 粉色 不适宜
    2: { color: "#fff5e5", textColor: "#FF9C00" } // 黄色 中性
  };
  return T[v];
}

/**
 * 健康管理处理颜色
 * @param {*} listArr 列表接口arr
 * @param {*} detailArr 详情接口arr
 * ps: fuck back-end developer
 */
export function dealWithColor(listArr, detailArr) {
  if (!Array.isArray(listArr) || listArr.length === 0) return [];
  // 详情接口数组转换为数组对象
  const newDetailArr = detailArr.reduce((total, currentVal) => {
    total.push({ [currentVal]: 0 });
    return total;
  }, []);
  // 合并列表 详情的数组对象
  const arr = [...newDetailArr, ...listArr];
  let obj = {};
  // 利用对象key的唯一性 对数组对象去重
  arr.forEach(item => {
    obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
  });
  // 转换回对象数组
  let newArr = [];
  for (let [key, value] of Object.entries(obj)) {
    newArr.push({ [key]: value });
  }
  return newArr;
}

/**
 * 获取url参数对象
 * @param {String} url 原始url
 */
export const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a),
    {}
  );

/**
 * 动态拼接url参数
 * @param {String} url 原始url
 * @param {Object} params 参数对象
 */
export const getFullURLFromParameters = (url, params = {}) => {
  let endIndex = url.includes("?") ? url.indexOf("?") : url.length;
  url = url.slice(0, endIndex);
  const arr = [];
  for (let key in params) {
    arr.push(`${key}=${params[key]}`);
  }
  url = url + "?" + arr.join("&");
  return url;
};

/**
 * 动态加载script标签
 * @param {String} url 目标url
 */
export const loadScript = url => {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = url;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    // 标签加载完成
    script.onload = script.onreadystatechange = function () {
      if (
        !this.readyState || // firefox
        this.readyState == "loaded" ||
        this.readyState == "complete" // ie
      ) {
        resolve();
      }
    };
  });
};

export const loadBase64 = url => {
  if (!window.Base64) {
    return loadScript(url);
  }
  return Promise.resolve();
};
